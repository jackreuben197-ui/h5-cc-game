const { ccclass, property, menu } = cc._decorator;

enum BarPosType {
    Inner = 1, //bar位置靠内侧
    Outer = 2 //bar位置靠外侧
}

enum Direction {
    Horizontal_L_R = 1, //横向 左-右
    Horizontal_R_L = 2, //横向 右-左 - 未处理
    Vertical_B_T = 3, //纵向 下-上
    Vertical_T_B = 4 //纵向 上-下 - 未处理
}
type data_type = {
    min_value: number;
    max_value: number;
    step: number;
    change?: Function;
    touch_start?: Function;
    touch_end?: Function;
    own?: any;
    scale?: number; // 值的缩放比例
};

@ccclass
@menu('component/SliderPlus')
export default class SliderPlus extends cc.Component {
    @property(cc.Node)
    top_touch: cc.Node = null;
    @property(cc.Node)
    background: cc.Node = null;
    @property(cc.Node)
    progress: cc.Node = null;
    @property(cc.Node)
    bar: cc.Node = null;
    @property(cc.Label)
    label_value: cc.Label = null;
    @property(cc.Label)
    label_precent: cc.Label = null;
    @property({ type: cc.Enum(BarPosType) })
    barPosType: BarPosType = BarPosType.Outer;
    @property({ type: cc.Enum(Direction) })
    direction: Direction = Direction.Horizontal_L_R;
    min: number = 0;
    max: number = 0;
    bar_half: number = 0;
    offset: number = 0;
    //滑动总距离
    slider_distance: number = 0;
    data: data_type = {
        min_value: 0,
        max_value: 100,
        step: 1
    };
    //步长距离
    private step_distance: number = 1;
    private curr_value: number = 0;

    onLoad() {
        if (!this.label_precent) {
            this.label_precent = this.node.getChildByName('move_button')?.getChildByName('label_precent')?.getComponent(cc.Label) || null;
        }
        this.initView();
        this.initEvents();
        this.initData(this.data);
    }

    initView() {
        let node_length = 0;
        if (this.direction == Direction.Horizontal_L_R || this.direction == Direction.Horizontal_R_L) {
            this.bar_half = this.bar.width / 2;
            node_length = this.node.width;
        } else {
            this.bar_half = this.bar.height / 2;
            node_length = this.node.height;
        }
        if (this.barPosType == BarPosType.Outer) {
            this.offset = 0;
        } else {
            this.offset = this.bar_half;
        }
        if (this.direction == Direction.Horizontal_L_R || this.direction == Direction.Vertical_B_T) {
            this.min = this.offset;
            this.max = node_length - this.offset;
        } else {
        }
        this.slider_distance = this.max - this.min;
        this.bar_offset = this.min;
        this.refreshValueLabel(this.data.min_value);
    }

    initEvents() {
        this.top_touch.on(cc.Node.EventType.TOUCH_START, this.backTouchStart, this);
        this.top_touch.on(cc.Node.EventType.TOUCH_MOVE, this.backTouchMove, this);
        this.top_touch.on(cc.Node.EventType.TOUCH_END, this.backTouchEnd, this);
        this.top_touch.on(cc.Node.EventType.TOUCH_CANCEL, this.backTouchEnd, this);
    }
    _bar_offset: number = 0;

    set bar_offset(value: number) {
        this._bar_offset = value;
        switch (this.direction) {
            case Direction.Horizontal_L_R:
                this.bar.x = value;
                this.progress.width = value;
                break;
            case Direction.Horizontal_R_L:
                break;
            case Direction.Vertical_B_T:
                this.bar.y = value;
                this.progress.height = value;
                break;
            case Direction.Vertical_T_B:
                break;
        }
    }

    get bar_offset() {
        return this._bar_offset;
    }

    ///////////////////////////event handler/////////////////////////
    backTouchStart(e: cc.Event.EventTouch) {
        this._touch(e, true);
        this.data.touch_start?.call(this.data.own);
    }

    backTouchMove(e: cc.Event.EventTouch) {
        this._touch(e, false);
    }

    backTouchEnd(e: cc.Event.EventTouch) {
        this.data.touch_end?.call(this.data.own);
    }

    _touch(e: cc.Event.EventTouch, tween: boolean = false) {
        if (this.data.min_value == this.data.max_value) return;
        let w = e.getLocation();
        let l = this.background.convertToNodeSpaceAR(w);
        let value = 0;
        if (this.direction == Direction.Horizontal_L_R || this.direction == Direction.Horizontal_R_L) {
            value = l.x;
        } else {
            value = l.y;
        }
        //console.log(value, this.min);
        if (value < this.min) value = Math.max(this.min, value);
        if (value > this.max) value = Math.min(this.max, value);
        let count = this.getCount(value);
        this.curr_value = this.data.min_value + count * this.data.step;
        if (this.curr_value > this.data.max_value) this.curr_value = this.data.max_value;
        this.refreshValueLabel(this.curr_value);
        this.data.change?.call(this.data.own, this.curr_value, count);
        let bar_move_target = this.min + count * this.step_distance;
        cc.Tween.stopAllByTarget(this);
        if (tween) {
            cc.tween<SliderPlus>(this).to(0.1, { bar_offset: bar_move_target }).start();
        } else {
            this.bar_offset = bar_move_target;
        }
    }

    refreshValueLabel(value: number) {
        if (this.label_value) {
            let scale = this.data.scale || 1;
            this.refreshValueLabelStr(`${value / scale}`);
        }
    }

    refreshValueLabelStr(str: string) {
        this.label_value.string = str;
    }

    refreshPercentLabelStr(str: string) {
        if (!this.label_precent) return;
        this.label_precent.string = str;
    }

    getCount(value: number) {
        let count = Math.round((value - this.min) / this.step_distance);
        return count;
    }

    show(data: data_type) {
        this.data = data;
        this.initData(this.data);
    }

    initData(data: data_type) {
        this.reset();
        if (data.min_value == data.max_value) {
            return;
        }
        let a = data.max_value - data.min_value; //范围
        let b = Math.ceil(a / data.step); //份数
        this.step_distance = this.slider_distance / b;
    }

    get value() {
        return this.curr_value;
    }

    set value(v: number) {
        this.curr_value = v;
        let k = (v - this.data.min_value) / (this.data.max_value - this.data.min_value);
        if (this.data.max_value == this.data.min_value) k = 0;
        this.bar_offset = this.min + (this.max - this.min) * k;
        this.data.change?.call(this.data.own, this.curr_value);
    }

    reset(): void {
        this.bar_offset = this.min;
        this.curr_value = this.data.min_value;
        this.refreshValueLabel(this.data.min_value);
    }
}
