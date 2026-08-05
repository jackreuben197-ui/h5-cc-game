import { PropsID } from './BroadcastCode';

export interface MagicEmojiDefinition {
    propCode: string;
    type: PropsID;
    spine: string;
    animation: string;
    sound: string;
}

export default class MagicEmojiConfig {
    public static readonly DEFINITIONS: MagicEmojiDefinition[] = [
        {
            propCode: 'smoke',
            type: PropsID.MAGICSMOKE,
            spine: 'expressionBlueBoy/blueboy',
            animation: 'smoke',
            sound: 'sound/emoji/sfx_smoke_mus'
        },
        {
            propCode: 'purpleSmoke',
            type: PropsID.MAGICPURPLESMOKE,
            spine: 'expressionPurpleSmoke/pinkrabbit_smoke',
            animation: 'newAnimation',
            sound: 'sound/emoji/sfx_purple_smoke_mus'
        },
        {
            propCode: 'gun',
            type: PropsID.MAGICGUN,
            spine: 'expressionBlueBoy/blueboy',
            animation: 'fire',
            sound: 'sound/emoji/sfx_gun_mus'
        },
        {
            propCode: 'smile',
            type: PropsID.MAGICSMILE,
            spine: 'expressionBlueBoy/blueboy',
            animation: 'laugh',
            sound: 'sound/emoji/sfx_smile_mus'
        },
        {
            propCode: 'shock',
            type: PropsID.MAGICSHOCK,
            spine: 'expressionShock/panda_excited',
            animation: 'animation',
            sound: 'sound/emoji/sfx_shock_mus'
        },
        {
            propCode: 'poor',
            type: PropsID.MAGICPOOR,
            spine: 'expressionBlueBoy/blueboy',
            animation: 'pitiful',
            sound: 'sound/emoji/sfx_poor_mus'
        },
        {
            propCode: 'pokePanda',
            type: PropsID.MAGICPOKEPANDA,
            spine: 'expressionPokePanda/stab',
            animation: 'animation',
            sound: 'sound/emoji/sfx_poke_panda_mus'
        },
        {
            propCode: 'amazed',
            type: PropsID.MAGICAMAZED,
            spine: 'expressionAmazed/amazed',
            animation: 'newAnimation',
            sound: 'sound/emoji/sfx_amazed_mus'
        },
        {
            propCode: 'octopus',
            type: PropsID.MAGICOCTOPUS,
            spine: 'expressionOctopus/octopoda',
            animation: 'newAnimation2',
            sound: 'sound/emoji/sfx_octopus_mus'
        },
        {
            propCode: 'happyMouse',
            type: PropsID.MAGICHAPPYMOUSE,
            spine: 'expressionDog/dog',
            animation: 'angry',
            sound: 'sound/emoji/sfx_happy_mouse_mus'
        },
        {
            propCode: 'knifeMan',
            type: PropsID.MAGICKNIFEMAN,
            spine: 'expressionKnifePanda/panda_knife_apple',
            animation: '1',
            sound: 'sound/emoji/sfx_knife_man_mus'
        },
        {
            propCode: 'sadDog',
            type: PropsID.MAGICSADDOG,
            spine: 'expressionDog/dog',
            animation: 'sad',
            sound: 'sound/emoji/sfx_sad_dog_mus'
        },
        {
            propCode: 'toothlessPanda',
            type: PropsID.MAGICTOOTHLESSPANDA,
            spine: 'expressionToothlessPanda/panda_laugh',
            animation: 'laugh',
            sound: 'sound/emoji/sfx_toothless_panda_mus'
        },
        {
            propCode: 'Whistle',
            type: PropsID.MAGICWHISTLE,
            spine: 'expressionWhistle/whistle',
            animation: 'animation',
            sound: 'sound/emoji/sfx_whistle_mus'
        },
        {
            propCode: 'coolDog',
            type: PropsID.MAGICCOOLDOG,
            spine: 'expressionDogGlasses/dog_glasses',
            animation: 'dog_glasses',
            sound: 'sound/emoji/sfx_cool_dog_mus'
        },
        {
            propCode: 'scorn',
            type: PropsID.MAGICSCORN,
            spine: 'expressionBlueBoy/blueboy',
            animation: 'scorn',
            sound: 'sound/emoji/sfx_scorn_mus'
        },
        {
            propCode: 'happy',
            type: PropsID.MAGICHAPPY,
            spine: 'expressionBlueBoy/blueboy',
            animation: 'happy',
            sound: 'sound/emoji/sfx_happy_mus'
        }
    ];

    public static getByPropCode(propCode: string): MagicEmojiDefinition {
        return MagicEmojiConfig.DEFINITIONS.find(item => item.propCode === propCode) || null;
    }

    public static getByType(type: number): MagicEmojiDefinition {
        return MagicEmojiConfig.DEFINITIONS.find(item => item.type === type) || null;
    }
}
