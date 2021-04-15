import { Component, OnInit, Input } from '@angular/core';
import { ApiService, LanguageService, MemberService, LoadingService } from 'service'
@Component({
  selector: 'deposit-unionpay',
  templateUrl: './unionpay.component.html',
  styleUrls: ['./unionpay.component.scss']
})

export class UnionpayComponent implements OnInit {

  private uid: string = this.member.uid;

  /**流水號 input ts html*/
  serial: number;
  /**流水號充值金額 input ts html*/
  serialGold: number;

  qrcodeflag:boolean;
  qrcodebackDate:any = {};
  @Input() depositNo;
  /**銀行充值資料 ts html*/
  depositBank: any = { 'bankbankname': '', 'bankaccount': '', 'bankname': '', 'email': '' };
  

  constructor(
    private api: ApiService,
    private member: MemberService,
    public lang: LanguageService,
  ) { }

  ngOnInit() {
    //取得流水號充值資料
    this.depositBank = this.member['profile']['info']['depositbankinfo'][0];
    this.qrcodeflag = false;
  }


  /**
     * 流水號充值
     * @param gold   充值金額
     * @param serial 交易流水號
     */
  serialDeposit(gold, serial) {

    this.serial = undefined;
    this.serialGold = undefined;

    let req = {
      uid: this.uid,
      gold: gold,
      sn: serial,
      backcode: this.depositBank['code']
    };

    

    this.api.postServer(764, req).subscribe((apiRes) => {
      if (apiRes.err) {
        let ret = apiRes.ret
        // alert('申请成功!\n\n' + '申请单号: ' + ret.depositNo + '\n' +'汇款银行: ' + ret.bankname + '\n' + '管理端银行帐号: ' + ret.bankaccount);       
        let json = '{"payname":"'+ret.payname+'","qrcode":"'+ret.qrcode+'","depositNo":"'+ret.depositNo+'","realamount":"'+ret.realamount+'"}'
        this.qrcodebackDate= ret;
        setInterval(()=>this.depositNo=ret.depositNo);
     
        this.qrcodeflag = true;
          /*window.open(
            '../qrcodepage.php?json='+json,
            '_blank', 'location = yes, fullscreen = yes, status = yes'
          );*/
      }
    })
  }


}
