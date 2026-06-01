/**
 * http错误码
 */
type HttpErrorItem = { key: string; des: string };

const HttpErrorMap: Record<string, HttpErrorItem> = {
    '-1': { key: 'request timeout', des: '连接超时' },
    '-2': { key: 'request error', des: '连接失败' },
    '90010': { key: 'token miss', des: 'token无效' }
};

export var HttpErrorCode = {
    GetKey(code: string): string {
        return HttpErrorMap[code]?.key || `code:${code} is undefined`;
    },
    Timeout: '-1',
    Error: '-2',
    ...HttpErrorMap
};
