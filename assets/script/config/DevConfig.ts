import { LogLevel } from '../core/decorator/LogTrace';

export default class DevConfig {
    public static VERSION = 1.0;
    // 是否是老的进入房间
    public static IS_OLD = false;
    public static LOG_LEVEL: LogLevel = 'warn';
}
