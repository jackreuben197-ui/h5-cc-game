import { ServerMessageCbRoomClose } from '../../../protobuf/holdem/recv_cb_room_close_pb';

// CBRoomClose 2105
export function CBRoomClose(data: ServerMessageCbRoomClose.AsObject, roomID: number, matchID: number) {}
