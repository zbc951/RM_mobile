/**API 回傳 interface */
export interface APIResponse {
    /**回傳狀態 */
    err: boolean|string;
    /**回傳訊息 */
    err_msg: number|string;
    /**回傳資料 */
    ret: any;
}
/**使用者資料 interface */
export interface Profile {
    /**使用者暱稱 */
    username: string;
    /**帳戶餘額 */
    surplus: number|string;
    /**今日交易金額 */
    today_credit: number|string;
    /**今日交易比數 */
    today_count: number|string;
    /**其他資訊 */
    info: {
        /**快速下注 */
        goldset: number|string;
        /**信箱 */
        email: string;
        /**電話 */
        phone: number|string;
        /**QQ帳號 */
        QQ: string;
        /**微信帳號 */
        WeChat: string;
        /**推廣連結 */
        plink: string;
        /**會員銀行卡 */
        membanklist: Array<string>;
        /**會員儲值銀行 */
        depositbankinfo: Array<string>;
    }
}