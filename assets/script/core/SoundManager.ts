import { AssetCollectionType } from '../views/loader/AssetLoader';
import AssetManager from '../views/loader/AssetManager';
import { traceClass } from './decorator/LogTrace';

export enum SoundEffectKey {
    // -- SFX --
    /** 玩家回合提示 */
    MyTurn = 'sfx_desk_player_turn',
    /** 玩家过牌 */
    Check = 'sfx_desk_player_check',
    /** 玩家弃牌 */
    Fold = 'sfx_desk_player_fold',
    /** Bet or Raise */
    RaiseBetCallPost = 'sfx_desk_post_raise',
    /** 跟注(Call)音效——取自 pokerqueen */
    Call = 'sfx_desk_post_call_p',
    /** 加注(Raise)音效——取自 pokerqueen */
    Raise = 'sfx_desk_post_raise_p',
    /** 自己获胜音效——取自 pokerqueen */
    MyWin = 'sfx_desk_mywin',
    /** 发新牌 */
    DealCards = 'sfx_desk_new_card',
    /** 筹码移动 */
    MoveChip = 'sfx_desk_move_chips',
    /** 全下 */
    AllIn = 'sfx_desk_allin',
    /** 胜利 */
    Win = 'sfx_win',
    /** 首次下注 */
    SB = 'sfx_desk_bet_first',
    /** 二次加注 */
    BB = 'sfx_desk_bet_second',
    /** 操作提醒 */
    ActionAlert = 'sfx_action_alert',
    /** 倒计时3s */
    CD3S = 'sfx_barrage_three',
    /** 聊天/表情 */
    DeskChat = 'sfx_desk_chat'
}

export enum SoundMusicKey {
    // -- BGM --
    /** 牌桌背景音乐 */
    BgmGame = 'bgm_game'
}

@traceClass()
export class SoundManager {
    private _soundOn: boolean = false;
    private _playingMusic: number = -1;
    // 只有真正播放过音乐后才记录恢复目标。不能默认成牌桌 BGM，否则用户从未
    // 进桌时，iOS 页面恢复后的首次点击也会被误判为需要恢复牌桌音乐。
    private _lastMusicKey: SoundMusicKey | null = null;
    private _lastMusicVolume: number = 0.3;
    public get isOn() {
        return this._soundOn;
    }
    public set isOn(b: boolean) {
        this.tracelog.debug('sound', b);
        this._soundOn = b;
    }
    private _needRecover: boolean = false;
    private _gestureHandler: ((e: Event) => void) | null = null;

    constructor() {
        this._installRecovery();
    }

    // ==================== 公开 API ====================
    /** 牌桌背景音乐已关闭，保留空实现，音效（SFX）不受影响 */
    playBGM() {
        return -1;
    }

    /** 播放 BGM，返回 audioID。自动停掉上次的 BGM，保证同一时刻只有一个 BGM */
    playMusic(key: SoundMusicKey, loop = true, volume = 1): number {
        if (!this._soundOn) return -1;
        const clip = AssetManager.getAsset(AssetCollectionType.AudioSourceSound, key);
        if (!clip) return -1;
        if (this._playingMusic !== -1) {
            cc.audioEngine.stop(this._playingMusic);
        }
        this._lastMusicKey = key;
        this._lastMusicVolume = volume;
        this._playingMusic = cc.audioEngine.play(clip, loop, volume);
        return this._playingMusic;
    }

    /** 播放 SFX，返回 audioID */
    playEffect(key: SoundEffectKey, loop = false): number {
        if (!this._soundOn) return -1;
        // cc.audioEngine.setEffectsVolume(volume);
        const clip = AssetManager.getAsset(AssetCollectionType.AudioSourceSound, key);
        if (!clip) return -1;
        return cc.audioEngine.playEffect(clip, loop);
    }

    /** 声音开关，持久化到 localStorage */
    volumeOnOff(onoff: boolean): void {
        this._soundOn = onoff;
        if (onoff && this._lastMusicKey) {
            this.playMusic(this._lastMusicKey, true, this._lastMusicVolume);
        }
        if (!onoff) {
            this._playingMusic = -1;
            cc.audioEngine.stopAll();
            cc.audioEngine.stopAllEffects();
        }
    }

    // ==================== iOS 锁屏恢复 ====================

    private _installRecovery(): void {
        if (cc.sys.os !== cc.sys.OS_IOS || !cc.sys.isBrowser) return;
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) return;
            requestAnimationFrame(() => {
                // 没有正在播放的音乐时只恢复引擎即可，不安装重播手势。
                // _soundOn 只是用户设置，不能代表用户已经进入过牌桌。
                if (this._playingMusic === -1 || !this._lastMusicKey) return;
                const ctx = this._getAudioContext();
                if (!ctx) return;
                try {
                    ctx.suspend();
                } catch (e) {}
                this._needRecover = true;
                this._installGestureHook();
            });
        });
    }

    private _getAudioContext(): AudioContext | null {
        try {
            return (cc.sys as any).__audioSupport?.context ?? null;
        } catch (e) {
            return null;
        }
    }

    private _installGestureHook(): void {
        if (this._gestureHandler) return;
        this._gestureHandler = () => {
            if (!this._needRecover) {
                this._removeGestureHook();
                return;
            }
            const ctx = this._getAudioContext();
            if (!ctx) return;
            try {
                ctx.resume();
            } catch (e) {}
            // 恢复后重播 BGM
            if (this._soundOn && this._lastMusicKey) {
                cc.audioEngine.stopAll();
                this.playMusic(this._lastMusicKey, true, this._lastMusicVolume);
            }
            this._needRecover = false;
            this._removeGestureHook();
        };
        document.addEventListener('touchstart', this._gestureHandler, { capture: true, once: true });
    }

    private _removeGestureHook(): void {
        if (this._gestureHandler) {
            document.removeEventListener('touchstart', this._gestureHandler, { capture: true } as any);
            this._gestureHandler = null;
        }
    }
}

const soundManager = new SoundManager();

export default soundManager;
