import { WebResponseDataBase } from '../other/WebResponseDataBase';

export namespace HttpChatMessageReport {
    export const API = '/api/chat/message/report';
    export class RequestData {
        public room_id: number = 0;
        public msg_user_rid: number = 0;
        public report_type: string = '';
        public other: string = '';
        public messages?: ChatMessage[];
    }
    export class ResponseData extends WebResponseDataBase {}
    export class ChatMessage {
        public msg_user_rid: number = 0;
        public content: string = '';
        public msg_time: number = 0;
    }
}
