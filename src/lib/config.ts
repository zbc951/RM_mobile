declare var url: {
    gateway: string,
    lang: string,
    ballType: string,
    registUrl: string
};
declare var FastClick;
declare var _storageMode;
// declare var _cservice;

declare var slides;
declare var QQ :string;
declare var Platform_id :number;
declare var Customer_url :string;
// /**線上客服模組 */
// export const cservice = _cservice;
/**預設設定 */
export const host = url;
/**FastClick */
export const clickEvent = FastClick;
/**Storage 是否可用 (true / false) */
export const storageMode = _storageMode;

export const slidesArr = slides;

export let QQid =QQ

export let p_id = Platform_id;

export let c_url = Customer_url;