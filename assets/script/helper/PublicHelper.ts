import { i18nMgr } from '../i18n/i18nMgr';
import viewManager from '../views/UIViewManager';

export default class PublicHelper {
    static InitSprite(sprite: cc.Sprite) {
        sprite.node.color = cc.Color.WHITE;
        //sprite.spriteFrame = spriteFrame;
    }

    static InitNode(node: cc.Node, position?: cc.Vec3, active: boolean = true) {
        node.setPosition(position);
        node.setScale(1, 1);
        node.active = active;
    }

    static copyToClipBoard(str: string): boolean {
        if (cc.sys.isNative) {
            //原生自己实现 手机浏览器打开走下面的 可以复制
        } else if (cc.sys.isBrowser) {
            var textarea = document.createElement('textarea');
            textarea.textContent = str;
            document.body.appendChild(textarea);
            textarea.readOnly = true;
            textarea.select();
            textarea.setSelectionRange(0, textarea.textContent.length);
            try {
                const flag = document.execCommand('copy');
                document.body.removeChild(textarea);
                if (flag) {
                    //ToastManager.Instance.createToast("已经复制到剪贴板");
                    viewManager.showToast(i18nMgr.Get('adaptation10106'));
                    return true;
                } else {
                    viewManager.showToast(i18nMgr.Get('UIReplicationFailed'));
                    return false;
                }
            } catch (err) {
                viewManager.showToast(i18nMgr.Get('UIReplicationFailed'));
                return false;
            }
        }
    }

    static ossUploadImage() {
        // WARNING: For POST requests, body is set to null by browsers.
        var data = new FormData();
        data.append('file', new Blob(), 'bnt.jpg');
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
            }
        });
        xhr.open('POST', 'http://dev.k8s.awanptesting.com/api/oss/upload/image');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('md5at', 'd7126b25afd37362092b0aa7852095cc');
        xhr.send(data);
    }

    //min ,max 包括min/max取随机整数
    static RandomIntRange(min: number, max: number): number {
        return min + ((Math.random() * (max - min + 1)) ^ 0);
    }

    //修复很长浮点数，取一位小数位
    static FixFloat(num: number) {
        return +Number(num).toFixed(1);
    }

    public static Uint8ArrayToString(bytes: Uint8Array): string {
        let str = '';
        for (let i = 0; i < bytes.length; i++) {
            str += String.fromCharCode(bytes[i]);
        }
        return str;
    }

    //base64 to json (UTF-8 安全,浏览器环境无 Buffer)
    public static Base64ToJsonString(str: string): string {
        const bin = atob(str);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
            bytes[i] = bin.charCodeAt(i);
        }
        if (typeof TextDecoder !== 'undefined') {
            return new TextDecoder('utf-8').decode(bytes);
        }
        let encoded = '';
        for (let i = 0; i < bytes.length; i++) {
            encoded += '%' + ('0' + bytes[i].toString(16)).slice(-2);
        }
        return decodeURIComponent(encoded);
    }

    //不带透明度的颜色转换
    public static GetColorArr(color: string, opacity: number = 255): number[] {
        let color_value = parseInt(color, 16);
        let r = (color_value >> 16) & 0xff;
        let g = (color_value >> 8) & 0xff;
        let b = color_value & 0xff;
        return [r / 255, g / 255, b / 255, opacity / 255];
    }
}

(window as any).PublicHelper = PublicHelper;
