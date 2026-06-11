import storageManager from '../data/LocalStorage';
import StorageKey from '../data/StorageKey';
import { AssetCollectionType } from '../views/loader/AssetLoader';
import AssetManager from '../views/loader/AssetManager';
import { traceClass } from './decorator/LogTrace';

//声音
@traceClass()
export default class SoundComponent {
    static get Instance(): SoundComponent {
        return ((this as any).instance ??= new SoundComponent());
    }
    soundOn: boolean = false;
    // BGM 相关
    private _musicId: number = -1;
    private _musicClip: cc.AudioClip = null;
    private _musicVolume: number = 1;
    private _musicPath: string = '';
    private _cache: Map<string, cc.AudioClip> = new Map();

    initSound() {
        let soundIsOpen = storageManager.getItem(StorageKey.SOUND_IS_OPEN);
        if (soundIsOpen == null || +soundIsOpen == 1) {
            this.soundOn = true;
        } else {
            this.soundOn = false;
        }
    }

    Play(name: string, loop: boolean = false) {
        if (this.soundOn) {
            // let soundClip: cc.AudioClip = AssetContext.getAsset<cc.AudioClip>(name, AssetFold.sound_all);
            const soundClip = AssetManager.getAsset(AssetCollectionType.AudioSourceSound, name);
            soundClip && cc.audioEngine.playEffect(soundClip, loop);
        }
    }

    /** 播放背景音乐，支持指定音量 (0.0 ~ 1.0) */
    playMusicWithVolume(path: string, volume: number = 1) {
        this._musicVolume = volume;
        this._musicPath = path;
        if (!this.soundOn) return;
        this._playAudio(path, true);
    }

    /** 停止背景音乐 */
    stopMusic() {
        if (this._musicId !== -1) {
            cc.audioEngine.stop(this._musicId);
            this._musicId = -1;
        }
    }

    /** 设置音效开关，同时控制 BGM */
    setSoundOn(on: boolean) {
        this.soundOn = on;
        if (on) {
            // 恢复 BGM
            if (this._musicPath && this._musicId === -1) {
                this._playAudio(this._musicPath, true);
            }
        } else {
            // 关闭 BGM
            this.stopMusic();
        }
    }

    private _playAudio(path: string, loop: boolean) {
        const clip = this._cache.get(path);
        if (clip) {
            this._play(clip, loop);
        } else {
            cc.resources.load(path, cc.AudioClip, (err: Error, clip: cc.AudioClip) => {
                if (err) {
                    this.tracelog.error('load audio failed:', path, err);
                    return;
                }
                this._cache.set(path, clip);
                this._play(clip, loop);
            });
        }
    }

    private _play(clip: cc.AudioClip, loop: boolean) {
        if (this._musicId !== -1) {
            cc.audioEngine.stop(this._musicId);
        }
        this._musicClip = clip;
        const id = cc.audioEngine.play(clip, loop, this._musicVolume);
        this._musicId = id;
    }
}
