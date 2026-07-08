import { traceClass } from '../../core/decorator/LogTrace';

const { ccclass, property } = cc._decorator;

@ccclass
@traceClass()
export default class AgoraVideoRender extends cc.Component {
    @property({ displayName: '镜像显示' })
    public mirror: boolean = false;
    @property({ displayName: '目标帧率' })
    public targetFps: number = 30;
    @property({ type: cc.Sprite, displayName: '视频覆盖层Sprite' })
    private videoSprite: cc.Sprite = null;
    @property({ type: cc.Sprite, displayName: '窗花覆盖层Sprite' })
    private maskSprite: cc.Sprite = null;
    private _video: HTMLVideoElement = null;
    private _texture: cc.Texture2D = null;
    private _spriteFrame: cc.SpriteFrame = null;
    private _stream: MediaStream = null;
    private _isRendering: boolean = false;
    private _isCancelled: boolean = false;
    private _gl: WebGLRenderingContext = null;
    private _frameInterval: number = 0;
    private _frameAccum: number = 0;
    private _lastLogTime: number = 0;
    private _consecutiveErrors: number = 0;
    private _switchToken: number = 0;
    private static readonly MAX_CONSECUTIVE_ERRORS = 30;
    public get isRendering(): boolean {
        return this._isRendering;
    }

    protected onLoad(): void {
        this._bindPrefabNodes();
    }

    public switchToMask(mask: cc.SpriteFrame): void {
        if (!this.maskSprite) return;
        this.maskSprite.spriteFrame = mask;
        this.maskSprite.node.active = true;
    }

    public stopMask(): void {
        this.maskSprite.node.active = false;
    }

    public async switchToOverlay(track: MediaStreamTrack): Promise<boolean> {
        if (track.readyState === 'ended') {
            this.stopOverlay();
            this.tracelog.warn('track 已结束');
            return false;
        }
        const switchToken = ++this._switchToken;
        return this._startVideoRender(track, switchToken);
    }

    public stopOverlay(): void {
        this._switchToken++;
        this._stopOverlayRender();
    }

    private _bindPrefabNodes(): boolean {
        if (!this.videoSprite || !this.maskSprite) {
            this.tracelog.warn('prefab 节点未绑定');
            return false;
        }
        this.videoSprite.node.scaleX = 1;
        this._gl = (cc.game as any)._renderContext;
        return true;
    }

    private async _startVideoRender(track: MediaStreamTrack, switchToken: number): Promise<boolean> {
        this._stopOverlayRender();
        if (switchToken !== this._switchToken || track.readyState === 'ended') return false;
        const stream = new MediaStream([track]);
        this.tracelog.debug('_startVideoRender 开始, stream tracks:', stream.getTracks().length);
        this._isCancelled = false;
        this._stream = stream;
        this._frameInterval = 1 / Math.max(1, this.targetFps || 30);
        this._frameAccum = 0;
        this._consecutiveErrors = 0;
        this._ensureVideoElement();
        this._video.srcObject = stream;
        try {
            await Promise.race([this._video.play(), new Promise<void>((_, reject) => setTimeout(() => reject(new Error('play timeout')), 5000))]);
            this.tracelog.debug('play() 成功');
        } catch (e: any) {
            if (this._isCancelled || switchToken !== this._switchToken) {
                this.tracelog.debug('play后已取消');
                return false;
            }
            this.tracelog.warn('playVideo失败或超时:', e?.message || e);
            this._stopOverlayRender();
            return false;
        }
        if (this._isCancelled || switchToken !== this._switchToken) {
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
        if (this._isCancelled || switchToken !== this._switchToken) {
            return false;
        }
        this.tracelog.debug('metadata 就绪, readyState:', this._video.readyState, 'videoSize:', this._video.videoWidth, 'x', this._video.videoHeight);
        await new Promise<void>(resolve => setTimeout(resolve, 100));
        if (this._isCancelled || switchToken !== this._switchToken) {
            return false;
        }
        const vw = this._video.videoWidth || 240;
        const vh = this._video.videoHeight || 240;
        this._video.setAttribute('width', String(vw));
        this._video.setAttribute('height', String(vh));
        const nodeSize = this.node.getContentSize();
        const cw = nodeSize.width || vw;
        const ch = nodeSize.height || vh;
        this._texture = new cc.Texture2D();
        this._texture.initWithElement(this._video as any);
        this._texture.packable = false;
        this._texture.handleLoadedTexture();
        const cropSize = Math.min(vw, vh);
        const cropX = (vw - cropSize) / 2;
        const cropY = (vh - cropSize) / 2;
        this._spriteFrame = new cc.SpriteFrame();
        this._spriteFrame.setTexture(this._texture);
        this.videoSprite.spriteFrame = this._spriteFrame;
        this.videoSprite.node.active = true;
        this.videoSprite.node.scaleX = this.mirror ? -1 : 1;
        this._isRendering = true;
        this.tracelog.info('开始渲染 (video material), video:', vw, 'x', vh, 'overlay:', cw, 'x', ch, 'fps:', this.targetFps);
        return true;
    }

    private _stopOverlayRender(): void {
        this._isCancelled = true;
        this._isRendering = false;
        if (this._video) {
            try {
                this._video.pause();
            } catch (_) {}
            this._video.srcObject = null;
        }
        if (this._stream) {
            this._stream = null;
        }
        if (this.videoSprite) {
            this.videoSprite.spriteFrame = null;
        }
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
        if (this.videoSprite.node) {
            this.videoSprite.node.active = false;
            this.videoSprite.node.scaleX = 1;
        }
    }

    private _ensureVideoElement(): void {
        if (this._video) return;
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
    }

    private _releaseVideoElement(): void {
        if (!this._video) return;
        try {
            this._video.pause();
        } catch (_) {}
        this._video.srcObject = null;
        if (this._video.parentNode) {
            this._video.parentNode.removeChild(this._video);
        }
        this._video = null;
    }

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

    protected update(dt: number): void {
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
                this.tracelog.warn('连续渲染帧异常达', this._consecutiveErrors, '次，停止渲染:', (e as Error).message);
                this.stopOverlay();
            }
        }
    }

    private _renderFrame(): void {
        (this._texture as any).initWithElement(this._video as any);
        this._texture.handleLoadedTexture();
        if (this.videoSprite) {
            (this.videoSprite as any)._vertsDirty = true;
        }
        const now = Date.now();
        if (now - this._lastLogTime > 10000) {
            this._lastLogTime = now;
            this.tracelog.debug('time:', this._video.currentTime.toFixed(2));
        }
    }

    protected onDestroy(): void {
        this.stopMask();
        this.stopOverlay();
        this._releaseVideoElement();
        this.videoSprite = null;
        this.maskSprite = null;
    }
}
