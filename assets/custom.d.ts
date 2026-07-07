/**
 * =========================================================================
 * @file custom.d.ts
 * @description 扑克游戏全域环境类型桥接与智能提示补丁
 * =========================================================================
 */

export {};

// 🚀 核心：向编译器声明此文件为模块化全局声明。
// 只有加了这行，下面通过 `declare global` 和 `declare namespace` 注入的属性，
// 才能彻底穿透所有带 `export` / `export default` 的普通单例类沙盒！

/**
 * 1. 完美兼容并轰炸 Cocos Creator 的基类命名空间
 * 确保所有挂载在场景、预制体上的 cc.Component 组件在输入 `this.` 时能秒出提示
 */
declare namespace cc {
    interface Component {
        /** 自动注入的追踪日志记录器 */
        readonly tracelog: import("./script/core/decorator/LogTrace").ITraceLogger;
    }
}

import type AgoraRTC from 'agora-rtc-sdk-ng';

/**
 * 2. 补刀全局作用域
 * 强化双重推导，确保 VS Code 提示器在任何极端隔离的文件里都不会丢失类型支持
 */
declare global {
    interface Object {
        /** 自动注入的追踪日志记录器 */
        readonly tracelog: import("./script/core/decorator/LogTrace").ITraceLogger;
    }

    interface Window {
        AgoraRTC: typeof AgoraRTC;
    }
}
