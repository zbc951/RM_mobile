//Angular
import { Component } from '@angular/core';
import { Http } from '@angular/http';
//Service
import { ApiService, MemberService, LanguageService } from 'service';
//RxJS
import { Subscription } from "rxjs/Subscription";
import 'rxjs/add/operator/map';


@Component({
    selector: 'cash-bankcard',
    templateUrl: 'bankcard.component.html',
    styleUrls: ['bankcard.component.scss']
})
export class BankCardComponent  {
    constructor(
        private api   : ApiService,
        private member: MemberService,
        private http  : Http,
        public lang   : LanguageService,
    ){}
    //-----------------------------------------------//
    /**使用者憑證 uid ts*/
    private uid: string = this.member.uid;
    //-----------------------------------------------//
    /**會員資料 訂閱*/
    private profileSubs: Subscription;
    //-----------------------------------------------//
    /**會員銀行卡 ts html*/
    memberBankList: Array<string> = [];
    //-----------------------------------------------//
    /**新增銀行卡 開戶銀行清單  ts html*/
    addBankList: Array<string> = [];
    /**新增銀行卡 分行名稱 ts html*/
    addBankBranch: string;
    /**新增銀行卡 戶名 ts html*/
    addName: string;
    /**新增銀行卡 帳號 ts html*/
    addAccount: string;
    /**新增銀行卡 確認帳號 ts html*/
    addAccountCon: string;
    /**新增銀行按鈕 ts html*/
    addBtn: boolean = true;
    //-----------------------------------------------//
    /**新增銀行卡 開戶所在 省份/城市 清單 ts html*/
    chinaArea: any = {};
    /**新增銀行卡 開戶所在 城市 清單 ts html*/
    chinaAreaKeys: Array<string> = [];
    /**被選開戶銀行 ts html*/
    seleBank: string = "titleKey";
    /**被選省份 ts html*/
    seleProvince: string = "titleKey";
    /**被選省份城市 ts html*/
    seleCity: string = "titleKey";

        /**新增電話 確認帳號 ts html*/
        addPhone: number;
        /**新增QQ 確認帳號 ts html*/
        addQQ: string;
        /**新增wechat  確認帳號 ts html*/
        addWechat : string;
        /**安全馬 */
        safety : string;
    ngOnInit() {
        //馬上更新銀行卡資訊，需要使用串流
        this.profileSubs = this.member.profile$.subscribe(res => {
            this.memberBankList = Object.values(res['info'].membanklist);
            if(this.memberBankList.length == 0) {
                this.getChinaArea();
                this.getBankList();
            }
        })

    }

    ngOnDestroy() {
        this.profileSubs.unsubscribe();
    }

    addBankCard() {
        if( this.addAccount != this.addAccountCon ) { alert(this.lang.languageChart['確認帳號不一致']+'!'); this.addAccountCon = undefined;  return; }
        let req = { 'uid': this.uid, 'act': 'add', 'back': this.seleBank, 'backac': this.addName,
                    'account': this.addAccount, 'reaccount': this.addAccountCon, 'province': this.seleProvince,
                    'city': this.seleCity, 'bankbranch': this.addBankBranch,
                    'phone':this.addPhone, 
                    'QQ':this.addQQ ,
                    'WeChat':this.addWechat ,
                    'wsecurity':this.safety};
        this.addBtn = false;
        this.api.postServer(912, req).subscribe({
            next: (apiRes) => {
                //新增銀行卡成功，清除 input 欄位
                if(apiRes.err == true) {
                    this.addBankBranch = undefined;
                    this.addName = undefined;
                    this.addAccount = undefined;
                    this.addAccountCon = undefined;
                    this.seleBank = "titleKey";
                    this.seleProvince = "titleKey";
                    this.seleCity = "titleKey";
                }
            },
            complete: () => {
                this.addBtn = true;
                //更新銀行卡清單
                this.member.getProfileAll();
            }
        });
    }

    /**取得開戶銀行清單 */
    private getBankList() {
        let req = { 'uid': this.uid };
        this.api.postServer(909, req).subscribe(apiRes => {
            if(apiRes.err = true) { this.addBankList = apiRes.ret; }
        });
    }

    /**取得中國地區資料 */
    private getChinaArea() {
        this.http.get('./file/china_area.json')
            .map(res => res.json())
			.subscribe(data => {
                this.chinaArea = data;
                this.chinaAreaKeys = Object.keys(this.chinaArea);
            });
    }

}