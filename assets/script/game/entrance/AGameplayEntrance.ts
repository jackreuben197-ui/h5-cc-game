import { RoomRecord } from '@silenthill/agreement-web';
import { traceClass } from '../../core/decorator/LogTrace';

/**
 * @description 加载指示器
 */
export enum LoadIndicator {
    /**
     * 进入玩法的入口UI：比如大厅界面、mtt列表界面等
     */
    FROM_UI = 0,
    /**
     * 其他玩法
     */
    GAMEPLAY,
    /**
     * 进入玩法之前的UI
     */
    ORIGIN_UI
}

/**
 * @description 玩法入口抽象基类
 * @remarks 通过入口(entrance)才能进入或离开玩法
 */
@traceClass()
export default abstract class AGameplayEntrance {
    public oldPathForEnter: boolean = false;
    // ==================== 属性 ====================
    /**
     * entrance所对应的桌子id
     */
    public get tableId(): string {
        return '';
    }
    /**
     * 当前是否为主桌
     */
    public get isMain(): boolean {
        return false;
    }
    /**
     * 玩法类型
     */
    public _roomType: number = 0;
    /**
     * 比赛id
     */
    public get matchId(): number {
        return this._matchId;
    }
    /**
     * 房间id - mtt比赛玩法过程中roomId可能会变动，允许派生类型修改
     */
    public _roomId: number = 0;
    private _matchId: number = 0;
    /**
     * 是否需要吐司；产品认为，进入房间时仅能有一个吐司存在
     */
    public _isHasToast: boolean = false;
    /**
     * 玩法变体类型
     */
    public _variantType: number = 0;
    /**
     * 玩法控制器
     */
    public _gameplay: any = null;
    /**
     * 请求玩法房间信息通信协议
     */
    public _protoRoomInfo: any = null;
    /**
     * 进入玩法通信协议
     */
    public _protoEnterRequest: any = null;
    /**
     * 进入玩法通信协议响应
     */
    public _protoEnterResponse: any = null;
    /**
     * 玩法进入后台或离开玩法后的加载指示
     */
    public _loadIndicator: LoadIndicator = LoadIndicator.FROM_UI;
    /**
     * 进入房间状态码
     */
    public _enterStatus: number = 0;
    /**
     * 是否通过入口人脸验证
     * @remarks 只在刚进入前台时进行验证，在验证成功后，前后台切换不再重复进行人脸验证
     */
    public _isPassFaceVerification: boolean = false;
    public _roomInfo: RoomRecord.AsObject = null;
    // ==================== 构造函数 ====================
    /**
     * 强制在构造时必须提供核心数据
     * @param roomType 玩法类型
     * @param matchId 比赛id
     * @param roomId 房间id
     */
    constructor(roomType: number, matchId: number, roomId: number) {
        this._roomType = roomType;
        this._roomId = roomId;
        this._matchId = matchId;
    }
    // ==================== 抽象方法 ====================
    /**
     * 通信层进入玩法 - 不考虑表现层
     * @param isEnterForeground 是否进入前台
     */
    protected abstract messageLayerEnterAsync(isEnterForeground: boolean): Promise<boolean>;
    /**
     * 通信层离开玩法 - 不考虑表现层
     */
    public abstract messageLayerLeave(): void;
    /**
     * 请求进入房间
     * @param isUseCache 是否使用缓存
     */
    public abstract requestEnterAsync(isUseCache: boolean): Promise<number>;
    /**
     * 加载整个玩法 - 逻辑层 + 表现层
     */
    protected abstract loadGameplay(): any;
    // ==================== 虚方法 ====================
    /**
     * 卸载逻辑层
     */
    protected unloadLogicLayer(): void {
        if (this._gameplay != null) {
            // TODO: 销毁玩法
        }
        this._gameplay = null;
    }

    /**
     * 卸载表现层
     * @param loadIndicator 卸载玩法表现层后执行何种加载行为
     */
    protected unloadViewLayer(loadIndicator: LoadIndicator): void {
        // TODO: 清理背景、皮肤、资源
    }

    /**
     * 加载玩法前缓存相关全局数据
     * @param isClear 是否清理缓存数据
     */
    protected cacheGlobalDataBeforeLoad(isClear: boolean): void {
        // TODO: 缓存 roomType、matchId、roomId 等数据
    }

    /**
     * 加载玩法后缓存相关全局数据
     * @param isClear 是否清理缓存数据
     */
    protected cacheGlobalDataAfterLoad(isClear: boolean): void {
        // TODO: 缓存当前游戏实例
    }

    /**
     * 玩法进入前台 - 进入前台的玩法即为当前呈现的主玩法
     * @remarks 非虚接口, 不可覆盖, 在固定的流程下来实现逻辑
     */
    public async enterForegroundAsync(): Promise<boolean> {
        this.tracelog.debug(`EnterForegroundAsync: ${this.tableId}`);
        try {
            // 等待通信层进入成功
            const isOk: boolean = await this.messageLayerEnterAsync(true);
            if (!isOk) {
                // 进入失败，清理缓存防止残留脏数据
                this.cacheGlobalDataBeforeLoad(true);
                this.cacheGlobalDataAfterLoad(true);
                return false;
            }
            // TODO: 触发消息层进入玩法的全局通知
            // 注: 在此处触发是因为为了支持多桌RTC, 需要确保ATable数据模型在加载Gameplay前先实例化
            // Game.EventSystem.Run(EventIdType.MULTI_TABLE_EVENT_MESSAGE_LAYER_ENTERED, this);
            // /////////////////////////////////////////////////////////////
            // 此时消息层面进入已成功, 玩法启动所需的所有必要数据都已经准备好
            // 接下来的逻辑都建立在此基础上
            // /////////////////////////////////////////////////////////////
            // 缓存加载玩法前的必要数据
            this.cacheGlobalDataBeforeLoad(false);
            // 等待加载完成并获取玩法控制器 (此玩法即为当前呈现的主玩法)
            this._gameplay = this.loadGameplay();
            // 缓存加载玩法后的必要数据
            this.cacheGlobalDataAfterLoad(false);
            return true;
        } catch (ex) {
            console.error(`${this.constructor.name}: EnterForegroundAsync: ${ex}`);
            this.cacheGlobalDataBeforeLoad(true);
            this.cacheGlobalDataAfterLoad(true);
            // TODO: 没有选中多桌条上的任意一个，已经退出了牌局返回了大厅，保护性处理恢竖屏
            // ScreenManager.Instance.ChangeOrientationByExitGame();
        }
        return false;
    }

    /**
     * 玩法进入后台
     * @param isReuseViewLayer 是否复用表现层
     * @param loadIndicator 玩法进入后台后执行何种加载行为
     * @remarks 同类型玩法可以复用表现层，这样可以提升切换房间时的流畅度
     */
    public async enterBackgroundAsync(isReuseViewLayer: boolean, loadIndicator: LoadIndicator = LoadIndicator.FROM_UI): Promise<boolean> {
        // TODO: 实现进入后台的逻辑
        return true;
    }

    /**
     * 退出玩法
     * @param isReuseViewLayer 是否复用表现层
     * @param loadIndicator 离开房间后执行何种加载行为
     * @remarks 同类玩法可以复用表现层，这样可以提升切换房间时的流畅度
     */
    public leave(isReuseViewLayer: boolean, loadIndicator: LoadIndicator = LoadIndicator.FROM_UI): void {
        // TODO: 实现离开玩法的逻辑
    }

    /**
     * 处理前台进入失败的异常情况
     * @param loadIndicator 加载指示器
     * @remarks 由于进入前台失败可能存在很多无法确定及恢复的情况，默认直接返回大厅
     */
    public handleEnterForegroundException(loadIndicator: LoadIndicator = LoadIndicator.FROM_UI): void {
        // TODO: 实现异常处理逻辑
    }

    /**
     * 是否可复用表现层
     * @param roomType 玩法类型
     */
    public isCanReuseViewLayer(roomType: number): boolean {
        return this._roomType === roomType;
    }
}
