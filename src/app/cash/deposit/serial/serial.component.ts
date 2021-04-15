import { Component, OnInit } from '@angular/core';
import { ApiService, LanguageService, MemberService, LoadingService } from 'service'
@Component({
  selector: 'deposit-serial',
  templateUrl: './serial.component.html',
  styleUrls: ['./serial.component.scss']
})

export class SerialComponent implements OnInit {

  private uid: string = this.member.uid;

  /**流水號 input ts html*/
  serial: number;
  /**流水號充值金額 input ts html*/
  serialGold: number;

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


    this.api.postServer(760, req).subscribe((apiRes) => {
      if (apiRes.err) {
        let ret = apiRes.ret
        alert(this.lang.languageChart['申請成功']+'!\n\n' + this.lang.languageChart['申請單號']+': ' + ret.depositNo + '\n' +
        this.lang.languageChart['匯款銀行']+': ' + ret.bankname + '\n' + this.lang.languageChart['管理端銀行帳號']+': ' + ret.bankaccount);
      }
    })
  }

}
