import { traceClass } from '../../../../../core/decorator/LogTrace';
import TexasGameRoomDataPlayerMine from '../../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import userStore from '../../../../../data/user/UserStore';
import UserStoreUtils from '../../../../../data/user/UserStoreUtils';
import { BringInChipsType, BringInMode } from '../../../../../game/constant/BringInChipsType';
import { GameType } from '../../../../../game/constant/LogicTypeConf';
import ProcedureDefine from '../../../../../game/procedure/ProcedureDefine';
import ProcedureManager from '../../../../../game/procedure/ProcedureManager';
import h5MessageManager from '../../../../../H5MsgMgr';
import { i18nMgr } from '../../../../../i18n/i18nMgr';
import { HttpRoomBringInByIDProtocol } from '../../../../../net/https/data/room/HttpRoomBringInByIDProtocol';
import { HttpRoomBringOutProtocol } from '../../../../../net/https/data/room/HttpRoomBringOutProtocol';
import { HttpUserInfoProtocol } from '../../../../../net/https/data/user/HttpUserInfoProtocol';
import { WebUserInfo, WebUserRoom, WebUserRoomBringin, WWW } from '../../../../../net/https/WebRequest';
import ProtocolAgency from '../../../../../net/websocket/ProtocolAgency';
import { Code } from '../../../../../protobuf/holdem/code_pb';
import { RoomInfo } from '../../../../../protobuf/holdem/define_pb';
import { ClientMessageSeated } from '../../../../../protobuf/holdem/req_th_seated_pb';
import { BringInCommitFn } from '../../../../dialog/bringin/provider/BringInProvider';
import viewManager from '../../../../UIViewManager';

@traceClass({ level: 'debug' })
export default class TexasTableEvent {
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
        if (seatData.needVideoPermision) {
            try {
                this.tracelog.debug('[Sitdown] 请求浏览器摄像头权限...');
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                // 权限通过，立即释放 stream（Agora 的 enableCamera 会自己创建 track）
                this.tracelog.debug('[Sitdown] 摄像头权限通过，释放 stream');
                stream.getTracks().forEach(t => t.stop());
            } catch (e) {
                // 权限被拒绝
                console.error('[Sitdown] 摄像头权限被拒绝:', e);
                viewManager.showToast('必须同意浏览器的视频权限才能成功坐在视频桌');
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
            this.tracelog.debug(seatedData.autoOnTable, seatData.roomData.basicInfo.retainMinRate * seatData.roomData.basicInfo.sbante.sb * 2);
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
                        OpenType: BringInChipsType.BRING_IN,
                        GameType: GameType.HOLDEM,
                        RoomPlayer: seatData,
                        CommitFn: TexasTableEvent._commitBringInCallback(roomID, matchID, seatData.roomData.basicInfo.limitBringIn, seatedData)
                    });
                    return;
                }
                //是否需要显示安全提示
                if (!seatData.roomData.basicInfo.shouldShowBringInSecuritySetting) {
                    // if (this.CurlimitOutChip == RoomInfo.RetainType.RT_AUTO) {
                    //     // this.ShowAutoAddChips(data.wallet);
                    // } else {
                    viewManager.openDialog('BringIn', {
                        OpenType: BringInChipsType.BRING_IN,
                        GameType: GameType.HOLDEM,
                        RoomPlayer: seatData,
                        CommitFn: TexasTableEvent._commitBringInCallback(roomID, matchID, seatData.roomData.basicInfo.limitBringIn, seatedData)
                    });
                    //}
                    return;
                }
                // 非首次不显示
                viewManager.openDialog('TexasTableSecurity', {
                    isFromBringIn: true,
                    bringInAct: () => {
                        viewManager.openDialog('BringIn', {
                            OpenType: BringInChipsType.BRING_IN,
                            GameType: GameType.HOLDEM,
                            RoomPlayer: seatData,
                            CommitFn: TexasTableEvent._commitBringInCallback(roomID, matchID, seatData.roomData.basicInfo.limitBringIn, seatedData)
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
                    OpenType: BringInChipsType.BRING_IN,
                    GameType: GameType.HOLDEM,
                    RoomPlayer: seatData,
                    CommitFn: TexasTableEvent._commitBringInCallback(roomID, matchID, seatData.roomData.basicInfo.limitBringIn, seatedData)
                });
                return;
            }
            // 不提示安全提示直接带入
            viewManager.openDialog('BringIn', {
                OpenType: BringInChipsType.BRING_IN,
                GameType: GameType.HOLDEM,
                RoomPlayer: seatData,
                CommitFn: TexasTableEvent._commitBringInCallback(roomID, matchID, seatData.roomData.basicInfo.limitBringIn, seatedData)
            });
        } catch (e) {
            this.tracelog.error('sit down', e);
        }
    }

    // _commitBringInCallback 带入流程，最后按钮按下去的处理(要么坐下，要么带入)
    private static _commitBringInCallback(roomID: number, matchID: number, limitBringIn: boolean, seatedData?: ClientMessageSeated.AsObject): BringInCommitFn {
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

    // AddChips 补充筹码
    public static async BringIn(player: TexasGameRoomDataPlayerMine): Promise<void> {
        try {
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
                    OpenType: BringInChipsType.BRING_IN,
                    GameType: GameType.HOLDEM,
                    RoomPlayer: player,
                    CommitFn: TexasTableEvent._commitBringInCallback(player.roomData.roomID, player.roomData.matchID, player.roomData.basicInfo.limitBringIn)
                });
                return;
            }
            // 记分牌 @TODO
            viewManager.openDialog('BringIn', {
                OpenType: BringInChipsType.BRING_IN,
                GameType: GameType.HOLDEM,
                RoomPlayer: player,
                CommitFn: TexasTableEvent._commitBringInCallback(player.roomData.roomID, player.roomData.matchID, player.roomData.basicInfo.limitBringIn)
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
}
