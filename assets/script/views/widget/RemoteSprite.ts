const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Widget/RemoteSprite')
export default class RemoteSprite extends cc.Component {
    private _sprite: cc.Sprite = null;
    private _url: string = '';
    // 暴露给外部的 url 属性
    @property({
        displayName: '远程图片URL',
        tooltip: '给它赋值后会自动触发下载并显示'
    })
    @property(cc.Material)
    public customMaterial: cc.Material = null;
    get url(): string {
        return this._url;
    }
    set url(value: string) {
        if (this._url === value) return;
        this._url = value;
        this.loadRemoteImage();
    }

    onLoad() {
        // 自动获取当前节点上的 Sprite 组件，如果没有就自动挂一个
        this._sprite = this.getComponent(cc.Sprite);
        if (!this._sprite) {
            this._sprite = this.addComponent(cc.Sprite);
        }
    }

    start() {
        // 如果在编辑器里填了默认 URL，启动时自动加载
        if (this._url) {
            this.loadRemoteImage();
        }
    }

    /**
     * 核心加载逻辑
     */
    private loadRemoteImage() {
        if (!this._url) return;
        // 确保组件存在
        if (!this._sprite) {
            this._sprite = this.getComponent(cc.Sprite);
        }
        let loadingUrl = this._url;
        cc.assetManager.loadRemote(this._url, { ext: '.png' }, (err, texture: cc.Texture2D) => {
            texture.packable = false;
            // 【第一道防线】：检查当前组件实例或节点是否已经被引擎销毁
            // cc.isValid(this) 会检查当前脚本组件是否还活着
            // cc.isValid(this.node) 会检查节点是否还挂在场景里
            if (!cc.isValid(this) || !cc.isValid(this.node)) {
                cc.warn('[RemoteSprite] 图片下载完时，节点已被销毁，放弃赋值。');
                return;
            }
            if (err) {
                cc.error(`[RemoteSprite] 加载失败: ${this._url}`, err);
                return;
            }
            // 【第二道防线】：防列表滑动错位（如果是动态生成的 chips/钻石列表）
            if (this._url !== loadingUrl) {
                cc.warn('[RemoteSprite] 下载完时，URL 已经被换掉了。');
                return;
            }
            // 【第三道防线】：双重保险，确保 _sprite 此时依然有效
            if (!this._sprite) {
                cc.warn('[RemoteSprite] this._sprite 意外丢失');
                return;
            }
            // 走到这里，说明一切安全，可以放心赋值！
            // this.releaseOldTexture();
            let sf = new cc.SpriteFrame(texture);
            this._sprite.spriteFrame = sf;
            if (this.customMaterial) {
                this._sprite.setMaterial(0, this.customMaterial);
            }
        });
    }

    /**
     * 释放旧纹理的内存
     */
    private releaseOldTexture() {
        if (this._sprite && this._sprite.spriteFrame) {
            let oldTex = this._sprite.spriteFrame.getTexture();
            this._sprite.spriteFrame = null;
            if (oldTex) {
                cc.assetManager.releaseAsset(oldTex);
            }
        }
    }

    // 当节点被销毁时，自动清理内存
    onDestroy() {
        this.releaseOldTexture();
    }
}
