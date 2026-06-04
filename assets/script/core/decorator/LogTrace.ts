/**
 * =========================================================================
 * @file LogTrace.ts
 * @description 游戏全自动日志追踪与动作流 Trace 模块
 * =========================================================================
 * 🎯 工业级全场景实战演练说明（API 备忘录）
 * =========================================================================
 * * 1. 【全局控制线设置】（通常在项目主入口或浏览器 F12 控制台动态注入）
 * ITraceLog.setGlobalLevel('error'); // 全局静音 debug, info, warn
 * * 2. 【最简空参装饰器示例】（全自动反射当前物理类名与函数名）
 * @traceClass() // 自动提取前缀 -> [SeatManager]
 * export class SeatManager extends cc.Component {
 * @traceMethod() // 自动提取前缀 -> [onUpdateSeats]
 * private onUpdateSeats(count: number) {
 * this.tracelog.info("当前座位数:", count); // 顺从全局，被静音不输出
 * this.tracelog.error("物理节点树生成失败"); // 完美见光 -> [SeatManager][onUpdateSeats] 物理节点树生成失败
 * }
 * }
 * * 3. 【局部定向放行示例：类级别重写】（单独把当前核心重构的类门禁拉低）
 * @traceClass({ level: 'info' }) // 强行让该类门禁线降到 info
 * export class TexasGameRoomData {
 * @traceMethod()
 * public updateRoomInfo() {
 * this.tracelog.info("房间基础数据刷新"); // 完美见光！豁免全局 error 阻断 -> [TexasGameRoomData][updateRoomInfo] 房间基础数据刷新
 * }
 * }
 * * 4. 【局部定向放行示例：方法级别重写】（全局和类都很高冷，只让这一个特殊方法疯狂输出）
 * @traceClass() // 顺从全局 error
 * export class ProtocolManager {
 * @traceMethod({ level: 'debug' }) // 最高优先级重写：单独放行此方法
 * public onReceiveServerPush(cmd: string, data: any) {
 * this.tracelog.debug("收到高频网络推送:", cmd); // 完美见光！-> [ProtocolManager][onReceiveServerPush] 收到高频网络推送: SC_JOIN
 * }
 * }
 * * 5. 【纯函数独立 Logger 示例】（写在类外面、文件头部的孤立模块）
 * const log = createLogger("CryptoUtils", "debug"); // 实例化时指定 debug，无视全局 error
 * export function signPokerPacket(data: any) {
 * log.debug("开始物理计算签名..."); // 完美见光！-> [CryptoUtils] 开始物理计算签名...
 * }
 * =========================================================================
 */
const METHOD_TRACE_KEY = Symbol('method_trace_prefix');

/**
 * 纯函数独立 Logger 接口约束
 */
export interface IFunctionLogger {
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    /**
     * 运行时动态改变当前独立 Logger 的过滤等级
     * @param level 新的日志等级，如 'debug'
     */
    setLevel(level: LogLevel): void;
}

export interface ITraceLogger {
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface TraceMethodOptions {
    prefix?: string;
    level?: LogLevel;
}

export interface TraceClassOptions {
    prefix?: string;
    level?: LogLevel;
}

const LOG_LEVEL_WEIGHTS: Record<LogLevel, number> = {
    debug: 1,
    info: 2,
    warn: 3,
    error: 4
};

// 逆向权重查字符串映射表
const WEIGHT_TO_LEVEL: Record<number, LogLevel> = {
    1: 'debug',
    2: 'info',
    3: 'warn',
    4: 'error'
};

// 全局静态总门禁线权重数值
let currentGlobalLogLevel: number = LOG_LEVEL_WEIGHTS['debug'];

/**
 * 【全局静态控制管理器】
 */
export const ITraceLog = {
    /**
     * 设置全局日志等级
     * @param level 日志等级
     */
    setGlobalLevel(level: LogLevel): void {
        currentGlobalLogLevel = LOG_LEVEL_WEIGHTS[level] || 1;
        console.log(`[ITraceLog] 全局日志等级已切换为: [${level.toUpperCase()}]`);
    },
    /**
     * 获取全局日志等级权重数值
     */
    getGlobalLevelWeight(): number {
        return currentGlobalLogLevel;
    },
    /**
     * 直接获取当前全局日志等级的字符串标识
     */
    getGlobalLevel(): LogLevel {
        return WEIGHT_TO_LEVEL[currentGlobalLogLevel] || 'debug';
    }
};

/**
 * 3. 【纯函数专属独立日志工厂】
 */
export function createLogger(prefix: string, level?: LogLevel): IFunctionLogger {
    const finalPrefix = `[${prefix}]`;
    let currentLocalWeight = level ? LOG_LEVEL_WEIGHTS[level] : undefined;
    const createLogWrapper = (logLevel: LogLevel, nativeLogMethod: Function) => {
        return (...args: any[]) => {
            const currentLineWeight = LOG_LEVEL_WEIGHTS[logLevel];
            const targetThreshold = currentLocalWeight !== undefined ? currentLocalWeight : currentGlobalLogLevel;
            if (currentLineWeight >= targetThreshold) {
                nativeLogMethod.call(console, finalPrefix, ...args);
            }
        };
    };
    return {
        debug: createLogWrapper('debug', console.log),
        info: createLogWrapper('info', console.info),
        warn: createLogWrapper('warn', console.warn),
        error: createLogWrapper('error', console.error),
        setLevel: function (newLevel: LogLevel) {
            currentLocalWeight = LOG_LEVEL_WEIGHTS[newLevel];
        }
    };
}

/**
 * 内部辅助：确保目标对象上存在 tracelog，@traceMethod 与 @traceClass 共用
 */
function ensureTracelog(target: any, className: string, traceLocalLevelWeight?: number) {
    if (target.tracelog) return;
    const finalClassPrefix = (className || 'Anonymous').startsWith('[') ? className : `[${className}]`;
    if (traceLocalLevelWeight !== undefined) {
        target._traceLocalLevelWeight = traceLocalLevelWeight;
    }
    Object.defineProperty(target, 'tracelog', {
        get: function () {
            const methodPrefix = this._activeMethodPrefix || '';
            const currentFullTag = `${finalClassPrefix}${methodPrefix}`;
            const createLogWrapper = (level: LogLevel, nativeLogMethod: Function) => {
                return (...args: any[]) => {
                    const currentLineWeight = LOG_LEVEL_WEIGHTS[level];
                    let targetThreshold = currentGlobalLogLevel;
                    if (this._activeMethodLevelWeight !== undefined) {
                        targetThreshold = this._activeMethodLevelWeight;
                    } else if (this._traceLocalLevelWeight !== undefined) {
                        targetThreshold = this._traceLocalLevelWeight;
                    }
                    if (currentLineWeight >= targetThreshold) {
                        nativeLogMethod.call(console, currentFullTag, ...args);
                    }
                };
            };
            return {
                debug: createLogWrapper('debug', console.log),
                info: createLogWrapper('info', console.info),
                warn: createLogWrapper('warn', console.warn),
                error: createLogWrapper('error', console.error)
            };
        },
        enumerable: false,
        configurable: true
    });
}

/**
 * 1. 【全能方法装饰器】@traceMethod
 */
export function traceMethod(options?: TraceMethodOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        let finalMethodPrefix = '';
        if (options && options.prefix !== undefined) {
            finalMethodPrefix = options.prefix && options.prefix.trim() !== '' ? `[${options.prefix}]` : '';
        } else {
            finalMethodPrefix = `[${propertyKey}]`;
        }
        originalMethod[METHOD_TRACE_KEY] = finalMethodPrefix;
        descriptor.value = function (...args: any[]) {
            ensureTracelog(this, this.constructor.name);
            const classPrefix = (this as any)?._traceClassPrefix || `[${this.constructor.name}]`;
            const fullPrefix = `${classPrefix}${finalMethodPrefix}`;
            let activeThreshold = currentGlobalLogLevel;
            if (options && options.level) {
                activeThreshold = LOG_LEVEL_WEIGHTS[options.level];
            } else if ((this as any)?._traceLocalLevelWeight !== undefined) {
                activeThreshold = (this as any)._traceLocalLevelWeight;
            }
            if (activeThreshold <= LOG_LEVEL_WEIGHTS['debug']) {
                console.log(`${fullPrefix} [Method Enter] -> arguments:`, args);
            }
            const prevMethodPrefix = (this as any)?._activeMethodPrefix;
            const instance = this as any;
            if (instance) {
                instance._activeMethodPrefix = finalMethodPrefix;
                if (options && options.level) {
                    instance._activeMethodLevelWeight = LOG_LEVEL_WEIGHTS[options.level];
                }
            }
            try {
                return originalMethod.apply(this, args);
            } finally {
                if (instance) {
                    instance._activeMethodPrefix = prevMethodPrefix;
                    delete instance._activeMethodLevelWeight;
                }
            }
        };
    };
}

/**
 * 2. 【全自动类装饰器】@traceClass
 */
export function traceClass(options?: TraceClassOptions) {
    return function (constructor: any) {
        const proto = constructor.prototype;
        const finalClassPrefix = options?.prefix?.trim() ? `[${options.prefix}]` : `[${constructor.name}]`;
        // 为实例原型和类构造器静态空间同步注入类前缀标识
        proto._traceClassPrefix = finalClassPrefix;
        constructor._traceClassPrefix = finalClassPrefix;
        // 为实例原型和类构造器静态空间同步注入 tracelog
        const localWeight = options && options.level ? LOG_LEVEL_WEIGHTS[options.level] : undefined;
        ensureTracelog(proto, finalClassPrefix, localWeight);
        ensureTracelog(constructor, finalClassPrefix, localWeight);
        // 统一类名/节点前缀获取器（LN）的物理定义
        const defineLNProperty = (target: any) => {
            Object.defineProperty(target, 'LN', {
                get: function () {
                    return finalClassPrefix;
                },
                enumerable: false,
                configurable: true
            });
        };
        defineLNProperty(proto);
        defineLNProperty(constructor);
    };
}
