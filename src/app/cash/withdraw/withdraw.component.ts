//Angular
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//Service
import { ApiService, MemberService, LanguageService } from 'service';

@Component({
    selector: 'cash-withdraw',
    templateUrl: 'withdraw.component.html',
    styleUrls: ['withdraw.component.scss']
})
export class WithdrawComponent implements OnInit {
    constructor(
        private router: Router,
        private member: MemberService,
        private api: ApiService,
        public lang: LanguageService
    ) { }
    //-----------------------------------------------//
    /**使用者憑證 uid ts*/
    private uid: string = this.member.uid;
    //-----------------------------------------------//
    /**會員銀行資料 ts html*/
    memberBankList: Array<string>;
    /**會員帳戶餘額 ts*/
    private profileSurplus: number | string;
    //-----------------------------------------------//
    /**注意事項說明文字 ts html */
    descriptionTxt: string;
    /**被選擇到的銀行 ts html*/
    selectedBank: any = { 'mbank': '', 'mbaccount': '', 'mbname': '' };
    /**提領金額 input */
    gold: number;
           /**安全馬 */
           safety : string;

    ngOnInit() {
        const profile = this.member.profile;

        //取得會員資料
        this.memberBankList = Object.values(profile['info']['membanklist']);
        this.profileSurplus = profile['surplus'];
        if (this.memberBankList[0]) { this.selectedBank = this.memberBankList[0]; }
        console.log(this.member.profile);
    }

    /**
     * 確認提領
     * @param gold 金額
     * @param selectedBank 選擇的銀行
     */
    Withdraw(gold, selectedBank) {
        if (gold > this.profileSurplus) { alert(this.lang.languageChart['提領金額超過帳戶餘額']+'!'); this.gold = undefined; return; }
        let req = { 'uid': this.uid, 'gold': gold, 'bankac': selectedBank.mbaccount, 'bankname': selectedBank.mbank, 'remark': '' ,'wsecurity':this.safety}
        this.api.postServer(762, req).subscribe(apiRes => {
            if (apiRes.err) {
                this.member.getProfile();
                this.gold = undefined;
                let ret = apiRes.ret
                alert(this.lang.languageChart['申請成功']+'!\n' + this.lang.languageChart['單號']+': ' + ret.withdrawalNo + '\n');
            }
        });
    }

}