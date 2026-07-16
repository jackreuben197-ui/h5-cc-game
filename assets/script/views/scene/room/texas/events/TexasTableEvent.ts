import { ClientMessageSeated, Code, Def, PotInsuranceBuy, RoomInfo } from '@silenthill/agreement-web';
import { traceClass } from '../../../../../core/decorator/LogTrace';
import TexasGameRoomData from '../../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataChat from '../../../../../data/room/texas/TexasGameRoomDataChat';
import TexasGameRoomDataPlayer from '../../../../../data/room/texas/TexasGameRoomDataPlayer';
import TexasGameRoomDataPlayerMine from '../../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import userStore from '../../../../../data/user/UserStore';
import UserStoreUtils from '../../../../../data/user/UserStoreUtils';
import { BringInMode } from '../../../../../game/constant/BringInMode';
import { GameType } from '../../../../../game/constant/LogicTypeConf';
import ProcedureDefine from '../../../../../game/procedure/ProcedureDefine';
import ProcedureManager from '../../../../../game/procedure/ProcedureManager';
import h5MessageManager from '../../../../../H5MsgMgr';
import { CPErrorCode } from '../../../../../i18n/CPErrorCode';
import { i18nMgr } from '../../../../../i18n/i18nMgr';
import agoraManager from '../../../../../net/agora/AgoraManager';
import { HttpRoomBringInByIDProtocol } from '../../../../../net/https/data/room/HttpRoomBringInByIDProtocol';
import { HttpRoomBringOutProtocol } from '../../../../../net/https/data/room/HttpRoomBringOutProtocol';
import {
    WebMiscGameRecordRound,
    WebMiscGameRemoveRound,
    WebMiscGameRoundStatus,
    WebRoomCenterGameWatch,
    WebRoomCenterGameWatchNum,
    WebRoomCenterHistoryViewPublicCards,
    WebRoomCenterHistoryViewPublicCardsFreeCount,
    WebUserDiamondsWallet,
    WebUserRoom,
    WebUserRoomBringin,
    WWW
} from '../../../../../net/https/WebRequest';
import ProtocolAgency from '../../../../../net/websocket/ProtocolAgency';
import { BringInCommitFn } from '../../../../dialog/bringin/provider/BringInProvider';
import viewManager from '../../../../UIViewManager';

@traceClass()
export default class TexasTableEvent {
    public static OpenPlayerInfo(player: TexasGameRoomDataPlayer): void {
        if (!player?.userID || !player.roomData) return;
        viewManager.openDialog('PlayerInfo', {
            roomID: player.roomData.roomID,
            matchID: player.roomData.matchID,
            player
        });
    }
    /// <summary>
    /// 坐下
    /// </summary>
    /// <param name="clientSeatId"></param>
    public static async Sitdown(seatData: TexasGameRoomDataPlayerMine, seatNo: number): Promise<void> {
        // 已经坐下,点击不处理
        if (seatData.roomData.mine.seatNo > 0) {
            this.tracelog.debug('Sitdown 不应该能点');
            return;
        }
        this.tracelog.debug('Sitdown', seatNo);
        const roomID = seatData.roomData.roomID;
        const matchID = seatData.roomData.matchID;
        await UserStoreUtils.updateUserInfoBasic();
        //被冻结
        if (userStore.forbid) {
            viewManager.openDialog('ConfirmOrNotice', {
                content: i18nMgr.Get('UIForbidBringInTips')
            });
            return;
        }
        // 视频房间：坐下前先请求浏览器摄像头权限（不依赖 Agora 频道状态）
        if (seatData.roomData.basicInfo.antiCheatConfig) {
            const seatedConfig = seatData.roomData.basicInfo.antiCheatConfig.getSeatedSetting();
            const ok = await agoraManager.getMediaDevicesSupported(seatedConfig.enableCamera, true);
            if (!ok) {
                viewManager.showToast('必须同意浏览器的音视频权限才能成功坐在视频桌');
                setTimeout(() => {
                    ProcedureManager.StartProcedure(ProcedureDefine.Return);
                }, 3000);
                return;
            }
        }
        //之前带入信息查询
        try {
            const response = await WWW.Instance.CommonAPI<HttpRoomBringOutProtocol.ResponseData>({
                web_class: WebUserRoom,
                api_id: roomID
            });
            // 请求异常
            if (response.code != 0) {
                this.tracelog.error(`Sitdown 坐下查询带入失败 ${response.code}`);
                return;
            }
            // // 异步请求期间可能已被清理
            // if (!seatData.mine) {
            //     this.tracelog.warn('Sitdown mainPlayer is null, abort');
            //     return;
            // }
            let seatedData: ClientMessageSeated.AsObject = {
                room: {
                    roomId: roomID,
                    matchId: matchID
                },
                seatId: seatNo,
                bringIn: 0,
                autoOnTable: 0,
                autoUseWallet: false,
                returnOrNew: response.data.return_table ? 1 : 0,
                store: 0,
                clubId: 0,
                applyBringIn: false,
                autoOnTableNoStore: false,
                autoOnTableFix: 0,
                depositAdvance: 0,
                autoOnTableMax: 0
            };
            // 自动藏钱要设置几个参数
            if (seatData.roomData.basicInfo.retainType == RoomInfo.RetainType.RT_AUTO) {
                seatedData.autoOnTable = seatData.roomData.basicInfo.retainMinRate * seatData.roomData.basicInfo.sbante.sb * 2;
                seatedData.autoOnTableFix = seatData.roomData.basicInfo.retainMinRate * seatData.roomData.basicInfo.sbante.sb * 2;
                seatedData.autoOnTableMax = seatData.roomData.basicInfo.retainMaxRate * seatData.roomData.basicInfo.sbante.sb * 2;
            }
            // this.tracelog.debug(seatedData.autoOnTable, seatData.roomData.basicInfo.retainMinRate * seatData.roomData.basicInfo.sbante.sb * 2);
            userStore.fillWalletInfo(response.data.wallet);
            if (response.data.wallet.length == 1) {
                seatData.currentWalletClubID = response.data.wallet[0].club_id;
            }
            // 联盟币
            if (seatData.roomData.basicInfo.bringInType == BringInMode.CURRENCY) {
                // 有带出
                if (response.data.last_bring_out != null) {
                    let returnAmount = response.data.last_bring_out.to_wallet + response.data.last_bring_out.fee;
                    // 要带回桌子上金额
                    let bringToTable = response.data.last_bring_out.to_wallet + response.data.last_bring_out.fee - seatData.roomData.basicInfo.deposit;
                    const returnFromWallet = response.data.last_bring_out.to_wallet;
                    const walletAmount = userStore.getWallet(response.data.last_bring_out.club_id)?.gold;
                    // 要反桌，但是钱包钱不够了
                    if (bringToTable > 0 && returnFromWallet > walletAmount) {
                        this.tracelog.warn('return table, not enough from wallet', 'need:', returnFromWallet, 'current:', walletAmount);
                        // 金额不足
                        viewManager.showToast(i18nMgr.Get('adaptation20010') + `(${returnFromWallet} > ${walletAmount})`);
                        return;
                    }
                    seatedData.bringIn = returnAmount;
                    seatedData.clubId = response.data.last_bring_out.club_id;
                    // 钱包够,没输光(反桌)
                    if (bringToTable > 0) {
                        // 没有藏钱直接坐下 || 如果自动藏钱而且钱大于自动上桌数字
                        if (
                            seatData.roomData.basicInfo.retainType == RoomInfo.RetainType.RT_DISABLE ||
                            (seatData.roomData.basicInfo.retainType == RoomInfo.RetainType.RT_AUTO && bringToTable >= seatedData.autoOnTable)
                        ) {
                            ProtocolAgency.Send({
                                code: Code.MSG_D_SEATED,
                                roomID: seatData.roomData.roomID,
                                matchID: seatData.roomData.matchID,
                                body: seatedData
                            });
                            return;
                        }
                        // 如果有藏钱的逻辑
                        if (seatData.roomData.basicInfo.retainType == RoomInfo.RetainType.RT_MANUAL) {
                            // (还要保留最小上桌
                            if (bringToTable >= seatData.roomData.basicInfo.retainMinRate * seatData.roomData.basicInfo.sbante.sb * 2) {
                                //手动逻辑自己管理Store
                                seatedData.store = bringToTable - seatData.roomData.basicInfo.retainMinRate * seatData.roomData.basicInfo.sbante.sb * 2;
                            }
                            ProtocolAgency.Send({
                                code: Code.MSG_D_SEATED,
                                roomID: seatData.roomData.roomID,
                                matchID: seatData.roomData.matchID,
                                body: seatedData
                            });
                            return;
                        }
                    }
                    // 其他都需要弹窗口输入
                    viewManager.openDialog('BringIn', {
                        GameType: GameType.HOLDEM,
                        RoomPlayer: seatData,
                        CommitFn: TexasTableEvent._commitBringInCallback(seatData, seatData.roomData.basicInfo.limitBringIn, seatedData)
                    });
                    return;
                }
                //是否需要显示安全提示
                if (!seatData.roomData.basicInfo.shouldShowBringInSecuritySetting) {
                    // if (this.CurlimitOutChip == RoomInfo.RetainType.RT_AUTO) {
                    //     // this.ShowAutoAddChips(data.wallet);
                    // } else {
                    viewManager.openDialog('BringIn', {
                        GameType: GameType.HOLDEM,
                        RoomPlayer: seatData,
                        CommitFn: TexasTableEvent._commitBringInCallback(seatData, seatData.roomData.basicInfo.limitBringIn, seatedData)
                    });
                    //}
                    return;
                }
                // 非首次不显示
                viewManager.openDialog('TexasTableSecurity', {
                    isFromBringIn: true,
                    bringInAct: () => {
                        viewManager.openDialog('BringIn', {
                            GameType: GameType.HOLDEM,
                            RoomPlayer: seatData,
                            CommitFn: TexasTableEvent._commitBringInCallback(seatData, seatData.roomData.basicInfo.limitBringIn, seatedData)
                        });
                    },
                    noAnimation: true,
                    roomID: seatData.roomData.roomID,
                    matchID: seatData.roomData.matchID
                });
                return;
            }
            // 记分牌(朋友卓)
            // 有带出
            if (response.data.last_bring_out != null) {
                let returnAmount = response.data.last_bring_out.to_wallet + response.data.last_bring_out.fee;
                // 要带回桌子上金额
                const bringToTable = response.data.last_bring_out.to_wallet + response.data.last_bring_out.fee - seatData.roomData.basicInfo.deposit;
                const returnFromWallet = response.data.last_bring_out.to_wallet;
                seatedData.bringIn = returnAmount;
                seatedData.clubId = response.data.last_bring_out.club_id;
                // 钱包够,没输光(反桌)
                if (bringToTable > 0) {
                    ProtocolAgency.Send({
                        code: Code.MSG_D_SEATED,
                        roomID: seatData.roomData.roomID,
                        matchID: seatData.roomData.matchID,
                        body: seatedData
                    });
                    return;
                }
                // 其他都需要弹窗口输入
                viewManager.openDialog('BringIn', {
                    GameType: GameType.HOLDEM,
                    RoomPlayer: seatData,
                    CommitFn: TexasTableEvent._commitBringInCallback(seatData, seatData.roomData.basicInfo.limitBringIn, seatedData)
                });
                return;
            }
            // 不提示安全提示直接带入
            viewManager.openDialog('BringIn', {
                GameType: GameType.HOLDEM,
                RoomPlayer: seatData,
                CommitFn: TexasTableEvent._commitBringInCallback(seatData, seatData.roomData.basicInfo.limitBringIn, seatedData)
            });
        } catch (e) {
            this.tracelog.error('sit down', e);
        }
    }

    // _commitBringInCallback 带入流程，最后按钮按下去的处理(要么坐下，要么带入)
    private static _commitBringInCallback(
        mine: TexasGameRoomDataPlayerMine,
        limitBringIn: boolean,
        seatedData?: ClientMessageSeated.AsObject
    ): BringInCommitFn {
        const roomID = mine.roomData.roomID;
        const matchID = mine.roomData.matchID;
        // 要坐下
        if (seatedData)
            return (amount, store, autoOnTable, clubID) => {
                seatedData.bringIn = amount;
                seatedData.clubId = clubID;
                // 如果用钱包自动充值
                if (autoOnTable > 0) {
                    seatedData.autoOnTableNoStore = true;
                    seatedData.autoUseWallet = true;
                    seatedData.autoOnTable = autoOnTable;
                } else {
                    // 手动藏钱
                    seatedData.store = store;
                    // 如果是自动藏钱，已经在初始化的时候用房间配置设定
                }
                mine.currentWalletClubID = clubID;
                ProtocolAgency.Send({
                    code: Code.MSG_D_SEATED,
                    roomID: roomID,
                    matchID: matchID,
                    body: seatedData
                });
            };
        return (amount, store, autoOnTable, clubID) => {
            ProtocolAgency.Send({
                code: Code.MSG_D_BRING_IN,
                roomID: roomID,
                matchID: matchID,
                body: {
                    room: {
                        roomId: roomID,
                        matchId: matchID
                    },
                    bringIn: amount,
                    useWallet: true,
                    applyBringIn: limitBringIn,
                    depositAdvance: 0
                }
            });
            // 用户想自动充值了使用协议设置自动化
            if (autoOnTable > 0) {
                ProtocolAgency.Send({
                    code: Code.MSG_D_SET_AUTO_ON_TABLE,
                    roomID: roomID,
                    matchID: matchID,
                    body: {
                        room: {
                            roomId: roomID,
                            matchId: matchID
                        },
                        autoOnTable: autoOnTable,
                        autoUseWallet: true,
                        autoOnTableNoStore: true,
                        autoOnTableFix: autoOnTable
                    }
                });
                mine.autoOnTableLocal = autoOnTable;
            }
        };
    }
    /// <summary>
    /// 站起
    /// </summary>
    /// <param name="clientSeatId"></param>
    public static Standup(seatData: TexasGameRoomDataPlayerMine): void {
        if (seatData.seatNo == 0) {
            return;
        }
        ProtocolAgency.Send({
            code: Code.MSG_D_STANDUP_ACTIVE,
            roomID: seatData.roomData.roomID,
            matchID: seatData.roomData.matchID,
            body: {
                room: {
                    roomId: seatData.roomData.roomID,
                    matchId: seatData.roomData.matchID
                },
                cancelStandup: false,
                manualChangeRoom: false
            }
        });
    }

    /** BringIn 补充筹码 */
    public static async BringIn(player: TexasGameRoomDataPlayerMine): Promise<void> {
        try {
            const { minAmount, maxAmount } = player.caculateCanBringMinMax();
            if (maxAmount < minAmount) {
                viewManager.showToast(CPErrorCode.ServerErrorDescription(20058));
                return;
            }
            const [_nouse, response] = await Promise.all([
                UserStoreUtils.updateUserInfoBasic(),
                WWW.Instance.CommonAPI<HttpRoomBringInByIDProtocol.ResponseData>({
                    web_class: WebUserRoomBringin,
                    api_id: player.roomData.roomID
                })
            ]);
            // @TODO更新用户信息
            //GC.data.user.info  Update
            //被冻结
            if (userStore.forbid) {
                viewManager.openDialog('ConfirmOrNotice', {
                    content: i18nMgr.Get('UIForbidBringInTips'),
                    ok: i18nMgr.Get('UIClub_CreateRoom7')
                });
                return;
            }
            // 联盟币
            if (player.seatNo == 0) {
                TexasTableEvent.tracelog.error('BringIn mainPlayer is null, abort');
                return;
            }
            if (player.roomData.basicInfo.bringInType == BringInMode.CURRENCY) {
                userStore.fillWalletInfo([response.data]);
                viewManager.openDialog('BringIn', {
                    GameType: GameType.HOLDEM,
                    RoomPlayer: player,
                    CommitFn: TexasTableEvent._commitBringInCallback(player, player.roomData.basicInfo.limitBringIn)
                });
                return;
            }
            // 记分牌 @TODO
            viewManager.openDialog('BringIn', {
                GameType: GameType.HOLDEM,
                RoomPlayer: player,
                CommitFn: TexasTableEvent._commitBringInCallback(player, player.roomData.basicInfo.limitBringIn)
            });
        } catch (e) {
            TexasTableEvent.tracelog.error('BringIn', e);
        }
    }

    /**
     * 离开房间
     */
    public static LeaveRoom(player: TexasGameRoomDataPlayerMine) {
        if (player.roomData.closed) {
            ProcedureManager.StartProcedure(ProcedureDefine.Return); // 直接离开 不做处理
            return;
        }
        if (player.roomData.basicInfo.isMtt) {
            ProcedureManager.StartProcedure(ProcedureDefine.Return); // 直接离开 不做处理
            return;
        }
        if (h5MessageManager.handshakeDone) {
            //GameCache.Instance.isActiveLeaving = true;
            ProtocolAgency.Send({
                code: Code.MSG_D_LEAVE,
                roomID: player.roomData.roomID,
                matchID: player.roomData.matchID,
                body: {
                    room: {
                        roomId: player.roomData.roomID,
                        matchId: player.roomData.matchID
                    }
                }
            });
        } else {
            ProcedureManager.StartProcedure(ProcedureDefine.Return); // 直接离开 不做处理
            return;
        }
    }

    /**
     * 提交"主动保险购买"。
     * 当多池存在时，前面的池调用 confirm=false 仅缓存到服务端；最后一池或超时/放弃时 confirm=true。
     * 服务端会以 BuyInsuranceActive(失败) 或 BuyInsurance(成功) 形式回执，由消息层负责清 operator。
     */
    public static CommitBuyInsurance(player: TexasGameRoomDataPlayerMine, buyList: PotInsuranceBuy.AsObject[], confirm: boolean): void {
        ProtocolAgency.Send({
            code: Code.MSG_D_BUY_INSURANCE_ACTIVE,
            roomID: player.roomData.roomID,
            matchID: player.roomData.matchID,
            body: {
                room: { roomId: player.roomData.roomID, matchId: player.roomData.matchID },
                buyList,
                confirm,
                step: true
            }
        });
    }

    /**
     * 操作
     */
    public static DoAction(player: TexasGameRoomDataPlayerMine, action: Def.ActionMap[keyof Def.ActionMap], amount: number) {
        if (action == Def.Action.FOLD) {
            //不显示牌型了，也不高亮了
            player.handValueType = '';
            player.highlightCards([]);
            player.roomData.publicCards.higlightPublicards([]);
        }
        ProtocolAgency.Send({
            code: Code.MSG_D_ACTION,
            roomID: player.roomData.roomID,
            matchID: player.roomData.matchID,
            body: {
                room: {
                    roomId: player.roomData.roomID,
                    matchId: player.roomData.matchID
                },
                action: action,
                amount: amount,
                clubId: player.currentWalletClubID
            }
        });
    }

    public static AgreePost(player: TexasGameRoomDataPlayerMine) {
        ProtocolAgency.Send({
            code: Code.MSG_D_AGREE_POST,
            roomID: player.roomData.roomID,
            matchID: player.roomData.matchID,
            body: {
                room: {
                    roomId: player.roomData.roomID,
                    matchId: player.roomData.matchID
                }
            }
        });
    }

    public static CancelKeepSeat(player: TexasGameRoomDataPlayerMine) {
        ProtocolAgency.Send({
            code: Code.MSG_D_KEEP_SEAT_ACTIVE,
            roomID: player.roomData.roomID,
            matchID: player.roomData.matchID,
            body: {
                room: {
                    roomId: player.roomData.roomID,
                    matchId: player.roomData.matchID
                },
                keep: false,
                duration: 0
            }
        });
    }

    public static KeepSeat(player: TexasGameRoomDataPlayerMine, duration: number) {
        ProtocolAgency.Send({
            code: Code.MSG_D_KEEP_SEAT_ACTIVE,
            roomID: player.roomData.roomID,
            matchID: player.roomData.matchID,
            body: {
                room: {
                    roomId: player.roomData.roomID,
                    matchId: player.roomData.matchID
                },
                keep: true,
                duration: duration
            }
        });
    }

    public static JoinSquid(player: TexasGameRoomDataPlayerMine) {
        ProtocolAgency.Send({
            code: Code.MSG_D_SQUID_IN_ACTIVE,
            roomID: player.roomData.roomID,
            matchID: player.roomData.matchID,
            body: {
                room: {
                    roomId: player.roomData.roomID,
                    matchId: player.roomData.matchID
                },
                enable: true
            }
        });
    }

    public static AddTime(player: TexasGameRoomDataPlayerMine, alreadyDelayTimes: number) {
        let consume: Def.ConsumeTypeMap[keyof Def.ConsumeTypeMap] = Def.ConsumeType.CT_NONE;
        switch (alreadyDelayTimes) {
            case 0:
            case 1:
            case 2:
                consume = Def.ConsumeType.CT_DELAY_2;
                break;
            case 3:
                consume = Def.ConsumeType.CT_DELAY_3;
                break;
            case 4:
                consume = Def.ConsumeType.CT_DELAY_4;
                break;
            case 5:
                consume = Def.ConsumeType.CT_DELAY_5;
                break;
            default:
                consume = Def.ConsumeType.CT_DELAY_6;
                break;
        }
        ProtocolAgency.Send({
            code: Code.MSG_D_ADD_TIME,
            roomID: player.roomData.roomID,
            matchID: player.roomData.matchID,
            body: {
                room: {
                    roomId: player.roomData.roomID,
                    matchId: player.roomData.matchID
                },
                consume: consume,
                directConsume: false
            }
        });
    }

    public static ShowPublicCards(player: TexasGameRoomDataPlayerMine, round: Def.RoundMap[keyof Def.RoundMap]) {
        ProtocolAgency.Send({
            code: Code.MSG_D_SHOW_PUBLIC_CARDS,
            roomID: player.roomData.roomID,
            matchID: player.roomData.matchID,
            body: {
                room: {
                    roomId: player.roomData.roomID,
                    matchId: player.roomData.matchID
                },
                round: round,
                consume: Def.ConsumeType.CT_VC_2
            }
        });
    }

    public static ViewPlayerCards(player: TexasGameRoomDataPlayerMine) {
        ProtocolAgency.Send({
            code: Code.MSG_D_VIEW_PLAYER_CARDS,
            roomID: player.roomData.roomID,
            matchID: player.roomData.matchID,
            body: {
                room: {
                    roomId: player.roomData.roomID,
                    matchId: player.roomData.matchID
                },
                targetSeatId: 0,
                targetUserRid: 0
            }
        });
    }

    public static ViewPlayerCardsNum(player: TexasGameRoomDataPlayerMine) {
        ProtocolAgency.Send({
            code: Code.MSG_D_VIEW_PLAYER_CARDS_NUM,
            roomID: player.roomData.roomID,
            matchID: player.roomData.matchID,
            body: {
                room: {
                    roomId: player.roomData.roomID,
                    matchId: player.roomData.matchID
                }
            }
        });
    }

    /** 牌谱回放:内存缓存 → 持久缓存(H5 侧 game_replays) → 服务端(回包走 PublicReplay 1018 写数据) */
    public static async RequestReplay(roomData: TexasGameRoomData, handNum: number): Promise<void> {
        const cached = roomData.replay.getCached(handNum);
        if (cached) {
            roomData.replay.applyReplay(cached);
            return;
        }
        const persisted = await roomData.replay.loadPersistent(handNum);
        if (persisted) {
            roomData.replay.applyReplay(persisted);
            return;
        }
        roomData.replay.pendingHandNum = handNum;
        ProtocolAgency.Send({
            code: Code.MSG_D_PUBLIC_REPLAY,
            roomID: roomData.roomID,
            matchID: roomData.matchID,
            body: {
                room: {
                    roomId: roomData.roomID,
                    matchId: roomData.matchID
                },
                handNum: handNum,
                uniqueId: roomData.basicInfo.roomUniqueID
            }
        });
    }

    /** 牌谱偷偷看:请求未亮牌玩家手牌,成功后合并进回放缓存(数据事件驱动视图刷新) */
    public static async PeekReplayHands(roomData: TexasGameRoomData, handNum: number): Promise<{ code: number }> {
        const cached = roomData.replay.getCached(handNum);
        try {
            const res: any = await WWW.Instance.CommonAPI({
                web_class: WebRoomCenterGameWatch,
                body: WebRoomCenterGameWatch.Request({
                    room_id: cached?.s?.rid || roomData.roomID,
                    room_unique_id: cached?.s?.unique || roomData.basicInfo.roomUniqueID,
                    hand_num: handNum,
                    be_watched_user_id: 0
                })
            });
            if (res?.code === 0 && res?.data) {
                roomData.replay.mergeWatchedHands(handNum, res.data.be_watched_user_hands);
                // 付费次数变了,失效缓存,下次取价重新拉档位
                roomData.replay.clearPeekTimes();
            }
            return { code: res?.code ?? -1 };
        } catch (e) {
            return { code: -1 };
        }
    }

    /** 牌谱发发看:请求揭示未发出的公共牌,成功后合并进回放缓存(数据事件驱动视图刷新) */
    public static async RevealReplayPublicCards(roomData: TexasGameRoomData, handNum: number, round: number): Promise<{ code: number }> {
        const cached = roomData.replay.getCached(handNum);
        try {
            const res: any = await WWW.Instance.CommonAPI({
                web_class: WebRoomCenterHistoryViewPublicCards,
                body: WebRoomCenterHistoryViewPublicCards.Request({
                    room_id: cached?.s?.rid || roomData.roomID,
                    hand_num: cached?.s?.hand || handNum,
                    round: round
                })
            });
            if (res?.code === 0 && res?.data) {
                roomData.replay.mergeViewedPublicCards(handNum, res.data);
                // 免费次数/付费状态变了,失效缓存,下次取价重新拉取
                roomData.replay.clearViewPubFreeCount();
            }
            return { code: res?.code ?? -1 };
        } catch (e) {
            return { code: -1 };
        }
    }

    /** 牌谱收藏状态查询(true=已收藏);缓存合并在手牌回放记录上,翻回已查询过的页不再请求 */
    public static async ReqReplayCollectStatus(
        roomData: TexasGameRoomData,
        params: { room_id: number; room_unique_id: string; hand_num: number }
    ): Promise<boolean> {
        const cached = roomData.replay.getCollected(params.hand_num);
        if (cached != null) return cached;
        return WWW.Instance.CommonAPI({
            web_class: WebMiscGameRoundStatus,
            body: WebMiscGameRoundStatus.Request(params)
        }).then(
            (res: any) => {
                const records = res?.data?.records;
                const isCollected = res?.code === 0 && records?.length > 0 && records[0].remove === 0;
                if (res?.code === 0) roomData.replay.setCollected(params.hand_num, isCollected);
                return isCollected;
            },
            () => false
        );
    }

    /** 牌谱收藏(成功后回写缓存) */
    public static ReqReplayAddCollect(roomData: TexasGameRoomData, body: typeof WebMiscGameRecordRound.RequestParams): Promise<{ code: number }> {
        return WWW.Instance.CommonAPI({
            web_class: WebMiscGameRecordRound,
            body: WebMiscGameRecordRound.Request(body)
        }).then(
            (res: any) => {
                if (res?.code === 0) roomData.replay.setCollected(body.hand_num, true);
                return { code: res?.code ?? -1 };
            },
            (err: any) => ({ code: err?.code ?? -1 })
        );
    }

    /** 取消牌谱收藏(成功后回写缓存) */
    public static ReqReplayRemoveCollect(
        roomData: TexasGameRoomData,
        params: { room_id: number; room_unique_id: string; hand_num: number }
    ): Promise<{ code: number }> {
        return WWW.Instance.CommonAPI({
            web_class: WebMiscGameRemoveRound,
            body: WebMiscGameRemoveRound.Request(params)
        }).then(
            (res: any) => {
                if (res?.code === 0) roomData.replay.setCollected(params.hand_num, false);
                return { code: res?.code ?? -1 };
            },
            (err: any) => ({ code: err?.code ?? -1 })
        );
    }

    /** 偷偷看已付费次数(阶梯计价档位用);缓存优先,偷偷看成功后由 PeekReplayHands 失效 */
    public static async ReqReplayPeekTimes(roomData: TexasGameRoomData): Promise<number> {
        const cached = await roomData.replay.getPeekTimes();
        if (cached != null) return cached;
        return WWW.Instance.CommonAPI({
            web_class: WebRoomCenterGameWatchNum,
            body: WebRoomCenterGameWatchNum.Request({ room_id: roomData.roomID })
        }).then(
            (res: any) => {
                const times = res?.data?.pay_times || 0;
                roomData.replay.setPeekTimes(times);
                return times;
            },
            () => 0
        );
    }

    /** 发发看 VIP 免费剩余次数;缓存优先,发发看成功后由 RevealReplayPublicCards 失效 */
    public static async ReqReplayViewPubFreeCount(roomData: TexasGameRoomData): Promise<number> {
        const cached = await roomData.replay.getViewPubFreeCount();
        if (cached != null) return cached;
        return WWW.Instance.CommonAPI({
            web_class: WebRoomCenterHistoryViewPublicCardsFreeCount
        }).then(
            (res: any) => {
                const count = res?.data?.free_count ?? 0;
                roomData.replay.setViewPubFreeCount(count);
                return count;
            },
            () => 0
        );
    }

    /** 钻石余额(仅展示,不回写 store) */
    public static ReqDiamondBalance(): Promise<number | null> {
        return WWW.Instance.CommonAPI({
            web_class: WebUserDiamondsWallet
        }).then(
            (res: any): number | null => res?.data?.diamonds_wallet?.diamonds ?? null,
            (): number | null => null
        );
    }

    /**
     * 发送牌桌聊天消息（对应 pokerqueen UIChatDlg.click_sendMsg）。
     * 先写 pending 等 1019 status=0 确认（BroadcastMsg.ts → chat.confirmPendingMessage）后才落聊天记录。
     */
    public static SendChatMessage(roomData: TexasGameRoomData, text: string, sendDanmu: boolean = false): void {
        const content = (text || '').trim();
        if (!content) return;
        roomData.chat.setPendingMessage({
            name: userStore.name || '',
            content,
            headUrl: userStore.avatar || '',
            sex: userStore.sex || 0,
            time: TexasGameRoomDataChat.formatNowTime()
        });
        this._sendChatBroadcast(roomData, content, Def.BroadcastMsgType.BC_MSG_AVATAR, false);
        if (sendDanmu) {
            this._sendChatBroadcast(roomData, content, Def.BroadcastMsgType.BC_MSG_BULLET, true);
            // 本人弹幕本地立即回显（网络回包在 GetMsg 中按 user_id 过滤，不会重复播放）
            roomData.chat.addDanmu({
                name: userStore.name || '',
                content
            });
        }
    }

    private static _sendChatBroadcast(
        roomData: TexasGameRoomData,
        content: string,
        msgType: Def.BroadcastMsgTypeMap[keyof Def.BroadcastMsgTypeMap],
        isDanmu: boolean
    ): void {
        const data: {
            name: string;
            type: number;
            user_id: number;
            target_user_id: number;
            message: string;
            msgType: number;
            time: number;
            sex: number;
            headUrl: string;
            isDanmu?: boolean;
            danmuType?: number;
        } = {
            name: userStore.name || '',
            type: 0,
            user_id: userStore.userID,
            target_user_id: 0,
            message: content,
            msgType: 2,
            time: Date.now(),
            sex: userStore.sex || 0,
            headUrl: userStore.avatar || ''
        };
        if (isDanmu) {
            data.isDanmu = true;
            data.danmuType = 1;
        }
        const broadcastMsgData = JSON.stringify(data);
        const extraJson = JSON.stringify({ code: 1000, data: broadcastMsgData });
        ProtocolAgency.Send({
            code: Code.MSG_D_BROADCAST_MSG,
            roomID: roomData.roomID,
            matchID: roomData.matchID,
            body: {
                room: { roomId: roomData.roomID, matchId: roomData.matchID },
                consume: Def.ConsumeType.CT_NONE,
                msgType,
                message: content,
                extra: new TextEncoder().encode(extraJson)
            }
        });
    }

    public static PrefetchhReportRoomers(roomID: number, matchID: number): void {
        if (!roomID) return;
        ProtocolAgency.Send({
            code: Code.MSG_D_ROOMERS,
            roomID,
            matchID,
            body: {
                room: { roomId: roomID, matchId: matchID },
                history: true,
                historyOffset: 0,
                historyLimit: 1000
            }
        });
    }
}
