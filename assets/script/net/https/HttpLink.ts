// /*
//  * @Author: xfj
//  * @Date: 2022-09-30 11:31:00
//  * @description:
//  * @LastEditors: Please set LastEditors
//  * @LastEditTime: 2022-11-22 19:30:58
//  * @FilePath: /pokerqueen/assets/script/net/https/HttpLink.ts
//  */
// import { TSendInfo } from '../../config/TTypeConfig';
// import HttpRequest from './HttpRequest';
// export class HttpLink {
//     private static _instance: HttpLink | null = null;
//     public static get instance() {
//         if (!HttpLink._instance) {
//             HttpLink._instance = new HttpLink();
//         }
//         return HttpLink._instance;
//     }
//     private _sendQueue: Array<TSendInfo> = [];
//     constructor() {
//         setInterval(this.checkQueue);
//     }
//     checkQueue = () => {
//         if (this._sendQueue.length) {
//             const sendInfo = this._sendQueue.shift();
//             if (!sendInfo) {
//                 return;
//             }
//             console.log('sendInfo ==>', sendInfo);
//             HttpRequest.Send({
//                 api: sendInfo.api,
//                 request: sendInfo.request,
//                 body: sendInfo.body || {},
//                 cuscomHost: sendInfo.cuscomHost,
//                 onSuccess: sendInfo.onSuccess,
//                 onFailure: sendInfo.onFailure,
//                 headers: sendInfo.headers,
//                 isJson: sendInfo.isJson == undefined ? true : sendInfo.isJson,
//                 isGet: sendInfo.isGet == undefined ? false : sendInfo.isGet
//             });
//         }
//     };
//     reqServe(sendInfo: TSendInfo) {
//         this._sendQueue.push(sendInfo);
//     }
// }
