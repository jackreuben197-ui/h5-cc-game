/**
 * webapi响应数据基类
 */

export class WebResponseDataBase {
    /** 状态码：0为正常，其他为异常 */
    public code: number = 0;
    /** 服务器定义的错误描述 */
    public message: string = '';
}
