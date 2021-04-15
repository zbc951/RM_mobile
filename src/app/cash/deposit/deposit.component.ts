//Angular
import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
//Service
import { ApiService, LanguageService, MemberService, LoadingService } from 'service';
import { CashPageService } from '../cash-page.service';
//RxJS
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: '<cash-deposit>',
  templateUrl: 'deposit.component.html',
  styleUrls: ['deposit.component.scss'],
  animations: [
    trigger('subMain', [
      state('*', style({ transform: 'translateX(0)' })),
      state('void', style({ transform: 'translateX(100%)' })),
      transition('* => *', animate('350ms ease-in-out'))
    ]),
  ],
})

export class DepositComponent implements OnInit {
  constructor(
    private api: ApiService,
    public lang: LanguageService,
    public cashPage: CashPageService,
    private member: MemberService,
    private loader: LoadingService,
  ) { }
  /**會員資料 訂閱*/
  private profileSubs: Subscription;
  /**使用者憑證 uid ts*/
  private uid: string = this.member.uid;
  /**會員資料 ts html*/
  profile: any = {};
  /**取得會員可用網路平台第三方支付
   * wechat : 微信支付        
    qq : QQ支付                
    alipay : 支付寶                
    bankcard : 銀行卡支付
    webbank : 网银支付        
    kjbankcard : 快捷支付        
    html5 : H5支付                
    unionpay : 云闪支付        
    smpay : 掃碼支付        
    gtpay : 京東支付        
    webgatepay : 卡转卡网关
   */

  payobj: any = {
    wechat: {},
    qq: {},
    alipay: {},
    bankcard: {},
    webbank: {},
    kjbankcard: {},
    html5: {},
    unionpay: {},
    smpay: {},
    gtpay: {},
    webgatepay: {},

  };
  /**付款方式 */
  pay;
  /**付款分流 */
  paylist;
  /**付款金額 */
  amount=0;
  /**快速付款 */
  FastPayment;

  /** 第三方支付連結 */
  @Input() memFullPayUrl;

  /**銀行資料 */
  seleBank;
/**銀行卡號 */
addcardnum;
/**通道按鈕 */
aisleB = undefined;

posting: boolean = false;
//585-575
gateway:number = 585;
  ngOnInit() {
    //console.log(this.pay);
    //取得並監聽會員資料
    this.profileSubs = this.member.profile$.subscribe((res) => { this.profile = res; });
    // console.log(this.profile);
  }

  onlinePay(payType: string) {
    let select = confirm(this.lang.languageChart['瀏覽器將從新頁面啟動在線支付']);
    if (select) {
      window.open(
        this.memFullPayUrl + '&paytype=' + payType,
        '_blank', 'location = yes, fullscreen = yes, status = yes'
      );
    }
  }
  getpay(_pay) {
    this.pay = _pay;
    this.aisleB = undefined;
    this.paylist= undefined;
    //console.log(_pay);
    let req = { 'uid': this.uid, 'paytype': _pay };
    this.api.postServer(576, req)
      .filter(apiRes => apiRes.err == true)
      .subscribe((apiRes) => {
        this.payobj[_pay] = apiRes.ret;
        //console.log(apiRes.ret);
      })
      //console.log(this.payobj);
  }
  /**
   * 快速付款按鈕
   * @param _mode 模式
   * @param _m 錢
   */
  FastPaymentButton(_mode,_m){
    if(!this.pay){
      alert(this.lang.languageChart['請先選擇支付方式']);
      return;
    }
    if(!this.paylist){
      alert(this.lang.languageChart['請先選擇通道線路']);
      return;
    }
    this.FastPayment = _mode;
    this.amount = _m;
  };

  /**
   * 充值
   */
  Recharge(){
    if(!this.pay){
      alert(this.lang.languageChart['請先選擇支付方式']);
      return;
    }
    if(!this.paylist){
      alert(this.lang.languageChart['請先選擇通道線路']);
      return;
    }
    if(!this.amount){
      alert(this.lang.languageChart['請先選擇']);
      return;
    }
    if(this.payobj[this.pay].list[this.paylist].bank.length != 0){
      if(!this.seleBank){
        alert(this.lang.languageChart['請先選擇銀行卡']);
        return;
      }
      if(!this.addcardnum){
        alert(this.lang.languageChart['請先填寫銀行帳號']);
        return;
      }
    }
    this.loader.displayLoader(true);
    let req = { 'uid': this.uid , 
    'gold':this.amount,
    'pay':this.pay,
    'paytype':this.paylist,
    'bank':(this.payobj[this.pay].list[this.paylist].bank.length != 0)?this.seleBank:'',
    'cardnum':(this.payobj[this.pay].list[this.paylist].bank.length != 0)?this.addcardnum:'',
    'type':this.payobj[this.pay].paymentType};
    this.api.postServer(this.gateway, req)
      .filter(apiRes =>{
        this.loader.displayLoader(false);
        return apiRes.err == true
      } )
      .subscribe((apiRes) => {
        console.log(apiRes);
        if(apiRes.ret.open && apiRes.ret.open == 1){
          console.log('open');
          location.href =  apiRes.ret.codeImgUrl;
          // window.open(
          //   apiRes.ret.codeImgUrl
          // );
        }
        if(apiRes.ret.setfrom && apiRes.ret.setfrom == 1 && this.gateway == 585){
          const form = document.createElement('form');
          form.target = "_blank";
          form.method = "post";
          form.action = apiRes.ret.codeImgUrl;
          let input;
            input = document.createElement('input');
            input.name ="EncryptText";
            input.type = "hidden";
            input.value = apiRes.ret.value;
            form.appendChild(input);
          
          document.body.appendChild(form);
            form.submit();
            
          // let form = document.createElement("form");
          // form.setAttribute("method","post");
          // form.setAttribute("action",apiRes.ret.codeImgUrl);
          // form.setAttribute("target","_blank");                                        
          // let hiddenField = document.createElement("input");
          // hiddenField.setAttribute("type", "hidden");
          // hiddenField.setAttribute("name", "EncryptText");
          // hiddenField.setAttribute("value",apiRes.ret.value);
          // form.appendChild(hiddenField);
          // document.body.appendChild(form);
          // form.submit();  
         
        }
        if(this.gateway == 575){
          const form = document.createElement('form');
          form.target = "_blank";
          form.method = "post";
          form.action = apiRes.ret.codeImgUrl;
          let input;
            input = document.createElement('input');
            input.name ="data";
            input.type = "hidden";
            input.value = apiRes.ret.value;
            form.appendChild(input);
          
          document.body.appendChild(form);
            form.submit();
        }
      })

     
      
  }
  /**提示 */
  prompt(){
    alert(this.lang.languageChart['請先選擇支付方式']);
  }

  aisle(_pay,i){
    console.log(this.payobj[this.pay].list[_pay]);
    if(this.payobj[this.pay].list[_pay].isfp){
      this.gateway = 575;
    }else{
      this.gateway = 585;
    }
    this.paylist =_pay;
    this.aisleB = i
    this.amount = 0;
  }
}

  