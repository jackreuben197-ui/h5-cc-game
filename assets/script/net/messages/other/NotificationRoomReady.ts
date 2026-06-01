import { ServerMessageNotificationRoomReady } from '../../../protobuf/holdem/recv_g_notification_room_ready_pb';

// NotificationRoomReady 101
export function NotificationRoomReady(data: ServerMessageNotificationRoomReady.AsObject, roomID: number, matchID: number) {}
