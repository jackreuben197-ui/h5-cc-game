import { GameConfig } from '../../config/GameConfig';
import { bindData, pureEvent } from '../../core/decorator/DataBind';
import { traceClass } from '../../core/decorator/LogTrace';

@bindData()
@traceClass()
export class CCViewData extends cc.EventTarget {
    public static GLOBAL_RESIZE = 'canvas-resize';
    public static FRAME_SIZE_UPDATE = 'FRAME_SIZE_UPDATE';
    private static readonly MIN_SCALE = 0.85;

    public startListen() {
        cc.view.on(CCViewData.GLOBAL_RESIZE, this.onResizeCallback);
    }

    private _vw: number = 0;
    private _vh: number = 0;
    private _fw: number = 0;
    private _fh: number = 0;
    private _scale: number = 0;
    private _realSaveTop: number = 0;

    public initData() {
        this.onResizeCallback();
    }

    private onResizeCallback() {
        const vs = cc.view.getVisibleSize();
        const fs = cc.view.getFrameSize();
        const scale = vs.height / fs.height;
        const saveTop = this._saveTop * scale;
        const minScale = Math.min(1, Math.max(vs.height / GameConfig.DESIGN_RESOLUTION.height, CCViewData.MIN_SCALE));
        [this._vw, this._vh, this._fw, this._fh, this._scale, this._realSaveTop] = [vs.width, vs.height, fs.width, fs.height, minScale, saveTop];
        this.resizeEvent(this._vw, this._vh, this._fw, this._fh, this._scale, this._realSaveTop);
    }

    private _saveTop: number = 0;

    public setSaveareaTop(h: number) {
        this._saveTop = h;
        this.onResizeCallback();
    }

    @pureEvent(CCViewData.FRAME_SIZE_UPDATE, {
        initParams() {
            return [this._vw, this._vh, this._fw, this._fh, this._scale, this._realSaveTop];
        }
    })
    private resizeEvent(vw: number, vh: number, fw: number, fh: number, minScale: number, savetopForDesign: number) {
        this.tracelog.debug('trigger resize', vw, vh, savetopForDesign);
    }
}

const ccviewData = new CCViewData();

export default ccviewData;
