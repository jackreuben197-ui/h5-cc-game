/**
 * 声网视频渲染组件
 * 挂载到头像节点（Raw_Head）上，动态创建 VideoOverlay 子节点，
 * 将视频流渲染到覆盖层上，不修改原始头像的 spriteFrame。
 *
 * 渲染链路（无 canvas 中转，最高效）:
 *   <video> 元素 → cc.Texture2D.initWithElement(video) → handleLoadedTexture()
 *   浏览器底层完成 video 解码 → GPU 纹理上传，零 CPU 拷贝。
 *
 * 节点层级:
 *   Raw_Head (cc.Sprite) ← 头像图片，永远不被视频写入
 *   └── VideoOverlay (cc.Sprite) ← 视频覆盖层，仅渲染时可见
 *
 * 编辑器配置:
 *   renderTarget: local = 本地摄像头, remote = 远端用户
 *   remoteUid:    renderTarget 为 remote 时，指定远端用户 UID
 *   mirror:       镜像显示（本地摄像头建议开启）
 *   targetFps:    目标帧率
 */
import AgoraManager from './AgoraManager';

const { ccclass, property } = cc._decorator;

@ccclass
export default class AgoraVideoRender extends cc.Component {
    @property({
        tooltip: '点击时渲染的目标: local=本地摄像头, remote=远端用户'
    })
    renderTarget: string = 'local';
    @property({
        tooltip: '远端用户 UID（仅 renderTarget=remote 时生效）',
        visible: function (this: any) {
            return this.renderTarget === 'remote';
        }
    })
    remoteUid: number = 0;
    @property({ tooltip: '镜像显示（本地摄像头建议开启）' })
    mirror: boolean = false;
    @property({ tooltip: '目标帧率（视频聊天 15-30 够用）' })
    targetFps: number = 30;
    private _video: HTMLVideoElement = null;
    private _texture: cc.Texture2D = null;
    private _spriteFrame: cc.SpriteFrame = null;
    /** 动态创建的视频覆盖层节点（Raw_Head 的子节点） */
    private _overlayNode: cc.Node = null;
    /** 覆盖层上的 Sprite 组件 */
    private _videoSprite: cc.Sprite = null;
    /** 窗花贴纸覆盖层节点（叠在 VideoOverlay 之上） */
    private _maskNode: cc.Node = null;
    /** 窗花 Sprite 组件 */
    private _maskSprite: cc.Sprite = null;
    /** 当前座位玩家的 videoMaskId */
    private _videoMaskId: number = 0;
    /** 已加载的窗花纹理缓存 key=maskId, value=SpriteFrame */
    private static _maskCache: Map<number, cc.SpriteFrame> = new Map();
    private _stream: MediaStream = null;
    private _isRendering: boolean = false;
    private _isCancelled: boolean = false;
    private _ownsStream: boolean = false;
    private _gl: WebGLRenderingContext = null;
    private _frameInterval: number = 0;
    private _frameAccum: number = 0;
    private _lastLogTime: number = 0;
    /** 连续渲染帧异常计数，超过阈值才放弃 */
    private _consecutiveErrors: number = 0;
    private static readonly MAX_CONSECUTIVE_ERRORS = 30;
    /** 渲染异常或被停止时的回调，上层借此同步 UI 状态 */
    public onRenderStopped: (() => void) | null = null;
    /** 是否正在渲染 */
    public get isRendering(): boolean {
        return this._isRendering;
    }

    onLoad() {
        this._ensureOverlay();
    }

    private _videoPowerSaving: number;

    public initilize(videoPowerSaving: number) {
        this._videoPowerSaving = videoPowerSaving;
    }

    /** 确保视频覆盖层节点已创建（onLoad 或首次渲染时调用） */
    private _ensureOverlay(): void {
        if (this._overlayNode) return;
        this._overlayNode = new cc.Node('VideoOverlay');
        this._overlayNode.parent = this.node;
        this._overlayNode.setContentSize(this.node.getContentSize());
        this._overlayNode.active = false; // 默认隐藏
        this._videoSprite = this._overlayNode.addComponent(cc.Sprite);
        // 窗花覆盖层：叠在 VideoOverlay 之上
        this._maskNode = new cc.Node('VideoMask');
        this._maskNode.parent = this.node;
        this._maskNode.setContentSize(this.node.getContentSize());
        this._maskNode.active = false;
        this._maskSprite = this._maskNode.addComponent(cc.Sprite);
        this._gl = (cc.game as any)._renderContext;
        this._frameInterval = 1 / this.targetFps;
    }

    /** 用已有的 MediaStreamTrack 渲染 */
    public async renderFromTrack(track: MediaStreamTrack): Promise<boolean> {
        if (!track) {
            console.error('[AgoraVideoRender] track 为空');
            return false;
        }
        return this._startWithStream(new MediaStream([track]));
    }

    /** 渲染远端用户视频 */
    public async renderRemoteUser(uid: number): Promise<boolean> {
        console.log('[AgoraVideoRender] renderRemoteUser, uid:', uid);
        const track = AgoraManager.Instance.getRemoteVideoTrack(uid);
        if (!track) {
            console.warn('[AgoraVideoRender] 远端视频Track为空, uid:', uid);
            return false;
        }
        return this._startWithStream(new MediaStream([track]));
    }

    /**
     * 初始化: video 元素 + Texture2D（用 video 直接作为纹理源，无 canvas 中转）
     */
    private async _startWithStream(stream: MediaStream): Promise<boolean> {
        console.log('[AgoraVideoRender] _startWithStream 开始, stream tracks:', stream.getTracks().length);
        this._ensureOverlay();
        this.stopRender();
        this._isCancelled = false;
        this._stream = stream;
        this._frameAccum = 0;
        this._consecutiveErrors = 0;
        // 1. 创建隐藏的 video 元素
        this._video = document.createElement('video');
        this._video.setAttribute('playsinline', '');
        this._video.setAttribute('autoplay', '');
        this._video.muted = true;
        this._video.style.position = 'fixed';
        this._video.style.bottom = '0';
        this._video.style.right = '0';
        this._video.style.width = '1px';
        this._video.style.height = '1px';
        this._video.style.zIndex = '-9999';
        this._video.style.pointerEvents = 'none';
        document.body.appendChild(this._video);
        this._video.srcObject = stream;
        try {
            await Promise.race([this._video.play(), new Promise<void>((_, reject) => setTimeout(() => reject(new Error('play timeout')), 5000))]);
            console.log('[AgoraVideoRender] play() 成功');
        } catch (e: any) {
            if (this._isCancelled) {
                console.log('[AgoraVideoRender] play后已取消');
                return false;
            }
            console.warn('[AgoraVideoRender] play失败或超时:', e?.message || e);
            this.stopRender();
            return false;
        }
        if (this._isCancelled) {
            this._releaseResources();
            return false;
        }
        await new Promise<void>(resolve => {
            if (this._video.readyState >= 1) {
                resolve();
            } else {
                const onMeta = () => {
                    resolve();
                };
                this._video.addEventListener('loadedmetadata', onMeta, { once: true });
                setTimeout(() => {
                    this._video.removeEventListener('loadedmetadata', onMeta);
                    resolve();
                }, 3000);
            }
        });
        console.log(
            '[AgoraVideoRender] metadata 就绪, readyState:',
            this._video.readyState,
            'videoSize:',
            this._video.videoWidth,
            'x',
            this._video.videoHeight
        );
        if (this._isCancelled) {
            this._releaseResources();
            return false;
        }
        await new Promise<void>(resolve => setTimeout(resolve, 100));
        if (this._isCancelled) {
            this._releaseResources();
            return false;
        }
        const vw = this._video.videoWidth || 240;
        const vh = this._video.videoHeight || 240;
        // 关键：设置 video 元素的 width/height 属性
        // handleLoadedTexture 内部检查 this._image.width && this._image.height，
        // 对 video 元素来说，video.width 返回的是属性值而非 videoWidth，
        // 不设属性就是 0，handleLoadedTexture 会直接跳过纹理创建！
        this._video.setAttribute('width', String(vw));
        this._video.setAttribute('height', String(vh));
        // 2. 覆盖层对齐节点大小
        const nodeSize = this.node.getContentSize();
        const cw = nodeSize.width || vw;
        const ch = nodeSize.height || vh;
        // 3. 创建 Texture2D — 直接绑定 <video> 元素，无 canvas 中转
        //    initWithElement(video) 让浏览器原生处理 video → GPU 纹理上传
        this._texture = new cc.Texture2D();
        this._texture.initWithElement(this._video as any);
        this._texture.packable = false;
        this._texture.handleLoadedTexture();
        // 4. SpriteFrame — 居中裁剪：取视频中心正方形区域
        const cropSize = Math.min(vw, vh);
        const cropX = (vw - cropSize) / 2;
        const cropY = (vh - cropSize) / 2;
        this._spriteFrame = new cc.SpriteFrame();
        (this._spriteFrame as any).initWithTexture(this._texture, cc.rect(cropX, cropY, cropSize, cropSize), false, cc.v2(0, 0), cc.size(cw, ch));
        // 5. 显示视频覆盖层
        this._overlayNode.setContentSize(cw, ch);
        this._overlayNode.active = true;
        this._videoSprite.spriteFrame = this._spriteFrame;
        if (this.mirror) {
            this._overlayNode.scaleX = -1;
        }
        this._isRendering = true;
        // 6. 视频渲染成功后，尝试显示窗花覆盖层
        this._applyVideoMask();
        console.log('[AgoraVideoRender] 开始渲染 (video direct), video:', vw, 'x', vh, 'overlay:', cw, 'x', ch, 'fps:', this.targetFps);
        return true;
    }

    /** 停止渲染，释放所有资源，隐藏覆盖层 */
    public stopRender(): void {
        const wasRendering = this._isRendering;
        this._isCancelled = true;
        this._isRendering = false;
        this._releaseResources();
        // 通知上层渲染已停止（仅在实际渲染中停止时通知）
        if (wasRendering && this.onRenderStopped) {
            try {
                this.onRenderStopped();
            } catch (_) {}
        }
    }

    private _releaseResources(): void {
        // 1. video
        if (this._video) {
            try {
                this._video.pause();
            } catch (_) {}
            if (this._video.parentNode) this._video.parentNode.removeChild(this._video);
            this._video.srcObject = null;
            this._video = null;
        }
        // 2. stream
        if (this._stream) {
            if (this._ownsStream) {
                try {
                    this._stream.getTracks().forEach(t => t.stop());
                } catch (_) {}
            }
            this._stream = null;
        }
        this._ownsStream = false;
        // 3. Texture2D + SpriteFrame
        if (this._texture) {
            this._deleteGLTextures(this._texture);
            this._texture.destroy();
            this._texture = null;
        }
        if (this._spriteFrame) {
            this._spriteFrame.destroy();
            this._spriteFrame = null;
        }
        this._frameAccum = 0;
        // 4. 隐藏视频覆盖层
        if (this._overlayNode) {
            this._overlayNode.active = false;
            this._overlayNode.scaleX = 1; // 重置镜像
        }
        // 5. 隐藏窗花覆盖层
        if (this._maskNode) {
            this._maskNode.active = false;
        }
    }

    /** 删除 Texture2D 内部所有 GL 纹理 */
    private _deleteGLTextures(tex: cc.Texture2D): void {
        if (!tex || !this._gl) return;
        try {
            const t = tex as any;
            if (t._glID) this._gl.deleteTexture(t._glID);
            if (t._texture?._glID) this._gl.deleteTexture(t._texture._glID);
            if (t.getImpl) {
                const impl = t.getImpl();
                if (impl?._glID) this._gl.deleteTexture(impl._glID);
                if (impl?._texture?._glID) this._gl.deleteTexture(impl._texture._glID);
            }
            if (t._gpuTexture?._glID) this._gl.deleteTexture(t._gpuTexture._glID);
        } catch (_) {}
    }

    update(dt: number) {
        if (!this._isRendering || !this._video) return;
        if (this._isCancelled) {
            this._isRendering = false;
            return;
        }
        if (this._video.paused && this._video.srcObject) {
            this._video.play().catch(() => {});
        }
        if (this._video.readyState < 2) return;
        this._frameAccum += dt;
        if (this._frameAccum < this._frameInterval) return;
        this._frameAccum = 0;
        try {
            this._renderFrame();
            this._consecutiveErrors = 0;
        } catch (e) {
            this._consecutiveErrors++;
            if (this._consecutiveErrors >= AgoraVideoRender.MAX_CONSECUTIVE_ERRORS) {
                console.warn('[AgoraVideoRender] 连续渲染帧异常达', this._consecutiveErrors, '次，停止渲染:', (e as Error).message);
                this.stopRender();
            }
            // 未达阈值时仅打日志，下一帧继续尝试
        }
    }

    /**
     * 单帧渲染 — 无 canvas 中转
     * 直接用 initWithElement(video) + handleLoadedTexture() 通知 CC 纹理更新。
     * handleLoadedTexture 内部会:
     *   1. 上传 video 当前帧到 GPU（gl.texImage2D）
     *   2. emit("load") 事件 → SpriteFrame 感知 → Sprite dirty
     *   3. 强制 _vertsDirty 确保渲染器重绘制
     */
    private _renderFrame(): void {
        // 重新绑定 video 元素（video 的帧内容已自动更新）
        (this._texture as any).initWithElement(this._video as any);
        this._texture.handleLoadedTexture();
        // 强制标记 sprite 为 dirty，确保 batch renderer 重新处理
        if (this._videoSprite) {
            (this._videoSprite as any)._vertsDirty = true;
        }
        const now = Date.now();
        if (now - this._lastLogTime > 10000) {
            this._lastLogTime = now;
            console.log('[AgoraVideoRender] time:', this._video.currentTime.toFixed(2));
        }
    }

    onDestroy() {
        this.stopRender();
        if (this._overlayNode) {
            this._overlayNode.destroy();
            this._overlayNode = null;
        }
        if (this._maskNode) {
            this._maskNode.destroy();
            this._maskNode = null;
        }
    }
    // ==================== 窗花贴纸相关 ====================
    /**
     * 设置当前座位的 videoMaskId（由上层在坐下/变更时调用）
     */
    public setVideoMaskId(maskId: number): void {
        this._videoMaskId = maskId;
        // 如果视频正在渲染中，立即刷新窗花显示
        if (this._isRendering) {
            this._applyVideoMask();
        }
    }

    /**
     * 根据条件显示/隐藏窗花覆盖层
     * 条件：房间 power_saving=1 且 videoMaskId>0
     */
    private _applyVideoMask(): void {
        if (!this._maskNode) return;
        // 不满足条件则隐藏
        if (this._videoPowerSaving !== 1 || !this._videoMaskId) {
            this._maskNode.active = false;
            return;
        }
        // 尝试从缓存获取
        const cached = AgoraVideoRender._maskCache.get(this._videoMaskId);
        if (cached && cached.isValid) {
            this._maskSprite.spriteFrame = cached;
            this._maskNode.active = true;
            this._maskNode.setSiblingIndex(this.node.childrenCount - 1);
            return;
        }
        // 从 resources 加载纹理
        const captureMaskId = this._videoMaskId;
        const path = `videomask/vm${captureMaskId}`;
        cc.resources.load(path, cc.Texture2D, (err, texture: cc.Texture2D) => {
            if (err || !texture) {
                console.warn('[AgoraVideoRender] 窗花纹理加载失败:', path, err?.message);
                return;
            }
            // 加载期间组件可能已销毁、停止渲染或切换了 maskId
            if (!(this as any).isValid || !this._isRendering || this._videoMaskId !== captureMaskId) return;
            const spriteFrame = new cc.SpriteFrame(texture);
            AgoraVideoRender._maskCache.set(captureMaskId, spriteFrame);
            if (this._maskNode?.isValid && this._maskSprite) {
                this._maskSprite.spriteFrame = spriteFrame;
                this._maskNode.active = true;
                this._maskNode.setSiblingIndex(this.node.childrenCount - 1);
            }
        });
    }

    /**
     * 清理窗花纹理缓存（退房时调用）
     */
    public static clearMaskCache(): void {
        AgoraVideoRender._maskCache.clear();
    }
}
