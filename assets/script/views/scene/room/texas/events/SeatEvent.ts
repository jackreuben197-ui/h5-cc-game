import { traceClass } from '../../../../../core/decorator/LogTrace';
import TexasGameRoomDataPlayer from '../../../../../data/room/texas/TexasGameRoomDataPlayer';
import userStore from '../../../../../data/user/UserStore';
import { GameType } from '../../../../../game/constant/LogicTypeConf';
import ProcedureDefine from '../../../../../game/procedure/ProcedureDefine';
import ProcedureManager from '../../../../../game/procedure/ProcedureManager';
import { i18nMgr } from '../../../../../i18n/i18nMgr';
import { HttpRoomBringOutProtocol } from '../../../../../net/https/data/room/HttpRoomBringOutProtocol';
import { HttpUserInfoProtocol } from '../../../../../net/https/data/user/HttpUserInfoProtocol';
import { WebUserInfo, WebUserRoom, WWW } from '../../../../../net/https/WebRequest';
import ProtocolAgency from '../../../../../net/websocket/ProtocolAgency';
import { Code } from '../../../../../protobuf/holdem/code_pb';
import { RoomInfo } from '../../../../../protobuf/holdem/define_pb';
import { ClientMessageSeated } from '../../../../../protobuf/holdem/req_th_seated_pb';
import viewManager from '../../../../UIViewManager';

@traceClass({ level: 'debug' })
export default class SeatEvent {
    /// <summary>
    /// 坐下
    /// </summary>
    /// <param name="clientSeatId"></param>
    public async Sitdown(seatData: TexasGameRoomDataPlayer): Promise<void> {
        // if (this.mainPlayer.seatID != -1) {
        //     console.warn(
        //         LN,
        //         `Sitdown 你已在其他位置 seatID ${this.mainPlayer.seatID}, clientSeatId ${this.GetSeatByLocalSeatID(this.mainPlayer.seatID).ClientSeatId}`
        //     );
        //     return;
        // }
        // if (null != mSeat.Player) {
        //     if (mSeat.Player.userID == this.mainPlayer.userID) {
        //         this.tracelog.warn(`Sitdown 你已在该位置 clientSeatId:${clientSeatId}`);
        //         return;
        //     }
        //     this.tracelog.warn(`Sitdown 该位置有其他玩家 clientSeatId:${clientSeatId}`);
        //     return;
        // }
        const roomID = seatData.roomData.roomID;
        const matchID = seatData.roomData.matchID;
        const userInfo = await WWW.Instance.CommonAPI<HttpUserInfoProtocol.ResponseData>({
            web_class: WebUserInfo
        });
        // @TODO更新用户信息
        //GC.data.user.info  Update
        //被冻结
        if (userInfo.data.user.forbid == 0) {
            viewManager.openDialog('ConfirmOrNotice', {
                content: i18nMgr.Get('UIForbidBringInTips')
            });
            return;
        }
        // 视频房间：坐下前先请求浏览器摄像头权限（不依赖 Agora 频道状态）
        if (seatData.needVideoPermision) {
            try {
                console.log('[Sitdown] 请求浏览器摄像头权限...');
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                // 权限通过，立即释放 stream（Agora 的 enableCamera 会自己创建 track）
                console.log('[Sitdown] 摄像头权限通过，释放 stream');
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
                seatId: seatData.seatNo,
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
            userStore.setFullWalletInfo(response.data.wallet);
            // 联盟币
            if (seatData.roomData.basicInfo.bringInType == 1) {
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
                        // 没有藏钱直接坐下
                        if (seatData.roomData.basicInfo.retainType == RoomInfo.RetainType.RT_DISABLE) {
                            ProtocolAgency.Send({
                                code: Code.MSG_D_SEATED,
                                roomID: seatData.roomData.roomID,
                                matchID: seatData.roomData.matchID,
                                body: seatedData
                            });
                        }
                        // 如果有藏钱的逻辑(还要保留最小上桌)
                        if (
                            seatData.roomData.basicInfo.retainType > 0 &&
                            bringToTable >= seatData.roomData.basicInfo.retainMinRate * seatData.roomData.basicInfo.sbante.sb * 2
                        ) {
                            if (seatData.roomData.basicInfo.retainType == RoomInfo.RetainType.RT_MANUAL) {
                                //手动逻辑自己管理Store
                                seatedData.store = bringToTable - seatData.roomData.basicInfo.retainMinRate * seatData.roomData.basicInfo.sbante.sb * 2;
                            }
                            ProtocolAgency.Send({
                                code: Code.MSG_D_SEATED,
                                roomID: seatData.roomData.roomID,
                                matchID: seatData.roomData.matchID,
                                body: seatedData
                            });
                        }
                        return;
                    }
                    // 其他都需要弹窗口输入
                    viewManager.openDialog('BringIn', {
                        OpenType: '111',
                        GameType: GameType.HOLDEM,
                        RoomPlayer: seatData
                    });
                    return;
                }
                //是否需要显示安全提示
                if (!seatData.roomData.basicInfo.shouldShowBringInSecuritySetting) {
                    // if (this.CurlimitOutChip == RoomInfo.RetainType.RT_AUTO) {
                    //     // this.ShowAutoAddChips(data.wallet);
                    // } else {
                    viewManager.openDialog('BringIn', {
                        OpenType: '111',
                        GameType: GameType.HOLDEM,
                        RoomPlayer: seatData
                    });
                    //}
                    return;
                }
                // 非首次不显示
                viewManager.openDialog('TexasTableSecurity', {
                    isFromBringIn: true,
                    bringInAct: () => {
                        viewManager.openDialog('BringIn', {
                            OpenType: '111',
                            GameType: GameType.HOLDEM,
                            RoomPlayer: seatData
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
                    OpenType: '111',
                    GameType: GameType.HOLDEM,
                    RoomPlayer: seatData
                });
                return;
            }
            // 不提示安全提示直接带入
            viewManager.openDialog('BringIn', {
                OpenType: '111',
                GameType: GameType.HOLDEM,
                RoomPlayer: seatData
            });
        } catch (e) {
            this.tracelog.error('sit down', e);
        }
    }
}
