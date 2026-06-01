/*
 * @Author: xfj
 * @Date: 2026-02-28
 * @description: Telegram Web App SDK 工具类
 * @FilePath: /pokerqueen/assets/script/tools/TelegramUtils.ts
 */
/**
 * Telegram WebApp 工具类
 * 用于集成 Telegram Mini App SDK
 */

export default class TelegramUtils {
    private static _instance: TelegramUtils = null;
    private _webApp: any = null;
    private _isInTelegram: boolean = false;

    private constructor() {
        this.init();
    }

    public static get Instance(): TelegramUtils {
        if (!this._instance) {
            this._instance = new TelegramUtils();
        }
        return this._instance;
    }

    /**
     * 初始化 Telegram WebApp
     */
    private init(): void {
        try {
            // 检查是否在 Telegram 环境中
            if (window && (window as any).Telegram && (window as any).Telegram.WebApp) {
                this._webApp = (window as any).Telegram.WebApp;
                this._isInTelegram = true;
                console.log('=== Telegram WebApp SDK 初始化 ===');
                console.log('SDK 版本:', this._webApp.version);
                console.log('平台:', this._webApp.platform);
                console.log('是否已展开:', this._webApp.isExpanded);
                console.log('视口高度:', this._webApp.viewportHeight);
                console.log('视口稳定高度:', this._webApp.viewportStableHeight);
                console.log('用户信息:', this._webApp.initDataUnsafe?.user);
                // 通知 Telegram WebApp 已准备好
                this._webApp.ready();
                console.log('已调用 ready()');
                // 使用延迟调用来确保 SDK 完全准备好
                // 对于旧版本的 Telegram，需要给一些时间让 SDK 初始化完成
                setTimeout(() => {
                    this.expandToFullScreen();
                }, 100);
                // 再次尝试展开（兼容性处理）
                setTimeout(() => {
                    if (this._webApp && !this._webApp.isExpanded) {
                        console.log('第一次展开未成功，重试中...');
                        this.expandToFullScreen();
                    }
                }, 500);
                // 第三次尝试
                setTimeout(() => {
                    if (this._webApp && !this._webApp.isExpanded) {
                        console.log('第二次展开未成功，再次重试...');
                        this.expandToFullScreen();
                    }
                }, 1000);
                // 设置主题颜色（延迟调用以确保兼容性）
                setTimeout(() => {
                    this.setHeaderColor('#1a1a1a');
                    this.disableVerticalSwipes();
                }, 200);
            } else {
                console.log('不在 Telegram 环境中运行');
                console.log('window.Telegram:', (window as any).Telegram);
                this._isInTelegram = false;
            }
        } catch (error) {
            console.error('Telegram WebApp 初始化失败:', error);
            this._isInTelegram = false;
        }
    }

    /**
     * 展开到全屏模式
     */
    public expandToFullScreen(): void {
        if (this._isInTelegram && this._webApp) {
            try {
                console.log('准备展开到全屏...');
                console.log('当前展开状态:', this._webApp.isExpanded);
                console.log('当前视口高度:', this._webApp.viewportHeight);
                // 检查 expand 方法是否存在
                if (typeof this._webApp.expand === 'function') {
                    this._webApp.expand();
                    console.log('已调用 expand() 方法');
                    // 延迟检查展开结果
                    setTimeout(() => {
                        console.log('展开后状态:', this._webApp.isExpanded);
                        console.log('展开后视口高度:', this._webApp.viewportHeight);
                    }, 300);
                } else {
                    console.warn('当前 Telegram 版本不支持 expand() 方法');
                    // 尝试使用其他方法
                    this.tryAlternativeFullscreen();
                }
            } catch (error) {
                console.error('展开到全屏失败:', error);
                this.tryAlternativeFullscreen();
            }
        }
    }

    /**
     * 尝试其他全屏方法（兼容旧版本）
     */
    private tryAlternativeFullscreen(): void {
        console.log('尝试使用备用全屏方法...');
        try {
            // 方法1: 设置视口样式
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
                console.log('已更新 viewport 设置');
            }
            // 方法2: 设置 body 样式强制全屏
            if (document.body) {
                document.body.style.position = 'fixed';
                document.body.style.top = '0';
                document.body.style.left = '0';
                document.body.style.width = '100%';
                document.body.style.height = '100vh';
                document.body.style.overflow = 'hidden';
                console.log('已设置 body 全屏样式');
            }
            // 方法3: 设置 Canvas 全屏
            const canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
            if (canvas) {
                canvas.style.width = '100%';
                canvas.style.height = '100vh';
                console.log('已设置 Canvas 全屏样式');
            }
        } catch (error) {
            console.error('备用全屏方法失败:', error);
        }
    }

    /**
     * 设置头部颜色
     * @param color 颜色值，格式为 #RRGGBB
     */
    public setHeaderColor(color: string): void {
        if (this._isInTelegram && this._webApp) {
            try {
                this._webApp.setHeaderColor(color);
                console.log('设置头部颜色:', color);
            } catch (error) {
                console.error('设置头部颜色失败:', error);
            }
        }
    }

    /**
     * 设置背景颜色
     * @param color 颜色值，格式为 #RRGGBB
     */
    public setBackgroundColor(color: string): void {
        if (this._isInTelegram && this._webApp) {
            try {
                this._webApp.setBackgroundColor(color);
                console.log('设置背景颜色:', color);
            } catch (error) {
                console.error('设置背景颜色失败:', error);
            }
        }
    }

    /**
     * 禁用垂直滑动关闭
     */
    public disableVerticalSwipes(): void {
        if (this._isInTelegram && this._webApp) {
            try {
                // 检查方法是否存在
                if (typeof this._webApp.disableVerticalSwipes === 'function') {
                    this._webApp.disableVerticalSwipes();
                    console.log('已禁用垂直滑动关闭');
                } else {
                    console.warn('当前 Telegram 版本不支持 disableVerticalSwipes()');
                }
            } catch (error) {
                console.error('禁用垂直滑动失败:', error);
            }
        }
    }

    /**
     * 启用垂直滑动关闭
     */
    public enableVerticalSwipes(): void {
        if (this._isInTelegram && this._webApp) {
            try {
                if (typeof this._webApp.enableVerticalSwipes === 'function') {
                    this._webApp.enableVerticalSwipes();
                    console.log('已启用垂直滑动关闭');
                } else {
                    console.warn('当前 Telegram 版本不支持 enableVerticalSwipes()');
                }
            } catch (error) {
                console.error('启用垂直滑动失败:', error);
            }
        }
    }

    /**
     * 获取用户信息
     */
    public getUserInfo(): any {
        if (this._isInTelegram && this._webApp) {
            return {
                id: this._webApp.initDataUnsafe?.user?.id,
                firstName: this._webApp.initDataUnsafe?.user?.first_name,
                lastName: this._webApp.initDataUnsafe?.user?.last_name,
                username: this._webApp.initDataUnsafe?.user?.username,
                languageCode: this._webApp.initDataUnsafe?.user?.language_code,
                isPremium: this._webApp.initDataUnsafe?.user?.is_premium
            };
        }
        return null;
    }

    /**
     * 获取启动参数
     */
    public getStartParam(): string {
        if (this._isInTelegram && this._webApp) {
            return this._webApp.initDataUnsafe?.start_param || '';
        }
        return '';
    }

    /**
     * 显示主按钮
     * @param text 按钮文本
     * @param onClick 点击回调
     */
    public showMainButton(text: string, onClick: () => void): void {
        if (this._isInTelegram && this._webApp && this._webApp.MainButton) {
            this._webApp.MainButton.setText(text);
            this._webApp.MainButton.show();
            this._webApp.MainButton.onClick(onClick);
            console.log('显示主按钮:', text);
        }
    }

    /**
     * 隐藏主按钮
     */
    public hideMainButton(): void {
        if (this._isInTelegram && this._webApp && this._webApp.MainButton) {
            this._webApp.MainButton.hide();
            console.log('隐藏主按钮');
        }
    }

    /**
     * 显示返回按钮
     * @param onClick 点击回调
     */
    public showBackButton(onClick: () => void): void {
        if (this._isInTelegram && this._webApp && this._webApp.BackButton) {
            this._webApp.BackButton.show();
            this._webApp.BackButton.onClick(onClick);
            console.log('显示返回按钮');
        }
    }

    /**
     * 隐藏返回按钮
     */
    public hideBackButton(): void {
        if (this._isInTelegram && this._webApp && this._webApp.BackButton) {
            this._webApp.BackButton.hide();
            console.log('隐藏返回按钮');
        }
    }

    /**
     * 显示提示消息
     * @param message 提示消息
     */
    public showAlert(message: string): void {
        if (this._isInTelegram && this._webApp) {
            this._webApp.showAlert(message);
        }
    }

    /**
     * 显示确认对话框
     * @param message 消息内容
     * @param callback 回调函数，参数为 true 表示确认
     */
    public showConfirm(message: string, callback: (confirmed: boolean) => void): void {
        if (this._isInTelegram && this._webApp) {
            this._webApp.showConfirm(message, callback);
        }
    }

    /**
     * 发送数据给机器人
     * @param data 要发送的数据
     */
    public sendData(data: string): void {
        if (this._isInTelegram && this._webApp) {
            this._webApp.sendData(data);
            console.log('发送数据给机器人:', data);
        }
    }

    /**
     * 打开链接
     * @param url 链接地址
     */
    public openLink(url: string): void {
        if (this._isInTelegram && this._webApp) {
            this._webApp.openLink(url);
        }
    }

    /**
     * 打开 Telegram 链接
     * @param url Telegram 链接
     */
    public openTelegramLink(url: string): void {
        if (this._isInTelegram && this._webApp) {
            this._webApp.openTelegramLink(url);
        }
    }

    /**
     * 关闭 WebApp
     */
    public close(): void {
        if (this._isInTelegram && this._webApp) {
            this._webApp.close();
        }
    }

    /**
     * 检查是否在 Telegram 环境中
     */
    public get isInTelegram(): boolean {
        return this._isInTelegram;
    }
    /**
     * 获取 WebApp 实例
     */
    public get webApp(): any {
        return this._webApp;
    }

    /**
     * 锁定屏幕方向（防止旋转）
     */
    public lockOrientation(): void {
        if (this._isInTelegram && this._webApp) {
            try {
                // Telegram WebApp 特有的方法
                if (typeof this._webApp.lockOrientation === 'function') {
                    this._webApp.lockOrientation();
                    console.log('已锁定屏幕方向');
                }
            } catch (error) {
                console.error('锁定屏幕方向失败:', error);
            }
        }
    }

    /**
     * 解锁屏幕方向
     */
    public unlockOrientation(): void {
        if (this._isInTelegram && this._webApp) {
            try {
                if (typeof this._webApp.unlockOrientation === 'function') {
                    this._webApp.unlockOrientation();
                    console.log('已解锁屏幕方向');
                }
            } catch (error) {
                console.error('解锁屏幕方向失败:', error);
            }
        }
    }

    /**
     * 启用屏幕常亮
     */
    public enableClosingConfirmation(): void {
        if (this._isInTelegram && this._webApp) {
            try {
                this._webApp.enableClosingConfirmation();
                console.log('已启用关闭确认');
            } catch (error) {
                console.error('启用关闭确认失败:', error);
            }
        }
    }

    /**
     * 禁用屏幕常亮
     */
    public disableClosingConfirmation(): void {
        if (this._isInTelegram && this._webApp) {
            try {
                this._webApp.disableClosingConfirmation();
                console.log('已禁用关闭确认');
            } catch (error) {
                console.error('禁用关闭确认失败:', error);
            }
        }
    }

    /**
     * 获取完整的调试信息（用于排查问题）
     */
    public getDebugInfo(): any {
        const debugInfo: any = {
            isInTelegram: this._isInTelegram,
            timestamp: new Date().toISOString()
        };
        if (this._isInTelegram && this._webApp) {
            debugInfo.webApp = {
                version: this._webApp.version,
                platform: this._webApp.platform,
                colorScheme: this._webApp.colorScheme,
                themeParams: this._webApp.themeParams,
                isExpanded: this._webApp.isExpanded,
                viewportHeight: this._webApp.viewportHeight,
                viewportStableHeight: this._webApp.viewportStableHeight,
                headerColor: this._webApp.headerColor,
                backgroundColor: this._webApp.backgroundColor,
                isClosingConfirmationEnabled: this._webApp.isClosingConfirmationEnabled,
                isVerticalSwipesEnabled: this._webApp.isVerticalSwipesEnabled
            };
            if (this._webApp.initDataUnsafe) {
                debugInfo.user = {
                    id: this._webApp.initDataUnsafe.user?.id,
                    firstName: this._webApp.initDataUnsafe.user?.first_name,
                    lastName: this._webApp.initDataUnsafe.user?.last_name,
                    username: this._webApp.initDataUnsafe.user?.username,
                    languageCode: this._webApp.initDataUnsafe.user?.language_code,
                    isPremium: this._webApp.initDataUnsafe.user?.is_premium
                };
                debugInfo.startParam = this._webApp.initDataUnsafe.start_param;
            }
            // 检查可用方法
            debugInfo.availableMethods = {
                expand: typeof this._webApp.expand === 'function',
                close: typeof this._webApp.close === 'function',
                disableVerticalSwipes: typeof this._webApp.disableVerticalSwipes === 'function',
                enableVerticalSwipes: typeof this._webApp.enableVerticalSwipes === 'function',
                setHeaderColor: typeof this._webApp.setHeaderColor === 'function',
                setBackgroundColor: typeof this._webApp.setBackgroundColor === 'function',
                lockOrientation: typeof this._webApp.lockOrientation === 'function'
            };
        }
        // 浏览器和设备信息
        debugInfo.browser = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio
        };
        return debugInfo;
    }

    /**
     * 打印调试信息到控制台
     */
    public printDebugInfo(): void {
        const info = this.getDebugInfo();
        console.log('='.repeat(50));
        console.log('Telegram WebApp 调试信息');
        console.log('='.repeat(50));
        console.log(JSON.stringify(info, null, 2));
        console.log('='.repeat(50));
    }
}

// 导出单例
(window as any).TelegramUtils = TelegramUtils;
