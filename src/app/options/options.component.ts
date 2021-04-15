//Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
//Service
import { ApiService, MemberService, LanguageService } from 'service';
//RxJS
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
//Others
import { getURLParamet } from "lib/functions";
import { storageMode } from 'lib/config';

import { CashPageService } from '../cash/cash-page.service';
import { timeout } from 'rxjs/operator/timeout';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
@Component({
    templateUrl: 'options.component.html',
    styleUrls: ['options.component.scss']
})
export class OptionsComponent implements OnInit, OnDestroy {
    url: SafeResourceUrl;
    constructor(
        private router: Router,
        private api: ApiService,
        public member: MemberService,
        public lang: LanguageService,
        public cashPage: CashPageService,
        public sanitizer: DomSanitizer
    ) {
        let token_url =  sessionStorage.getItem('token');
        this.url = sanitizer.bypassSecurityTrustResourceUrl(token_url);
     }
   
    //-----------------------------------------------//
    /**使用者憑證 uid ts*/
    private uid: string = this.member.uid;
    /**語系 ts*/
    private nowLang: string = this.lang.nowLang;
    //-----------------------------------------------//
    /**會員資料 訂閱*/
    private profileSubs: Subscription;
    /**會員資料 ts html*/
    profile: any = {};
    //-----------------------------------------------//
    /**設定按鈕開關 html*/
    settingBtn: boolean = false;
    //-----------------------------------------------//
    /**點擊視窗黑色部分 訂閱 global*/
    private dialogDOMSubs = new Subscription();
    /**交易紀錄 for RecordComponent 預先抓，使畫面流暢*/
    //-----------------------------------------------//
    /**判斷單一錢包token是否存在 來決定要顯示什麼選項*/
    chkSwToken:boolean = (sessionStorage.getItem('token')!='notoken') ?  true  : false;
   
    record: any = { 'list': [] };
    detail = 0;
     /** token 切換 */
    token = false;
    ngOnInit() {
        this.member.getProfile();
        //取得並監聽會員資料
        this.profileSubs = this.member.profile$.subscribe((res) => { this.profile = res; });
        this.DialogDOM();
        this.getDetail();
        console.log( sessionStorage.getItem('token'));
        console.log(this.chkSwToken);
    }
    ngOnDestroy() {
        this.profileSubs.unsubscribe();
        this.dialogDOMSubs.unsubscribe();
    }

    /**
     * 跳轉頁面
     * @param 要跳轉的頁面
     */
    changePage(pageName: string[]) {
        this.router.navigate(pageName);
    }

    /**登出 */
    logout() {
        let req = { 'uid': this.uid };
        this.api.postServer(990, req).subscribe(() => {
            if (storageMode) {
                sessionStorage.clear();
                location.reload();
            } else {
                location.href = '?lang=' + this.lang.nowLang;
            }
        });
    }

    /**
     * 變更語系
     * @param lang 語系名稱
     */
    changeLanguage(lang) {
        //判斷儲存作業使用 Storage 或 URL
        if (storageMode) {
            sessionStorage.setItem("lang", lang);
            //使 LanguageService 重新載入，能夠依 sessionStorage 載到新的語言包
            location.reload();
        } else {
            //設定 Url 並 重新載入
            location.href = '?lang=' + lang + '&p=' + this.member.uid;
        }
    }

    /**點擊黑色半透明區塊，關閉本元件*/
    DialogDOM() {
        const dialogDOM = document.getElementsByClassName('modal');
        const touchEnd = Observable.fromEvent(dialogDOM, 'touchend');
        this.dialogDOMSubs = touchEnd.filter(event => event['target']['className'] === 'modal')
            .subscribe((a) => {
                this.settingBtn = false;
            });
    }
    //**快速導向存款 */
    go_Stored_value(_value) {
        let req = { 'uid': this.uid, 'page': 1 };
        this.api.postServer(780, req).subscribe(apiRes => {
          if (!apiRes.err) { return; }
          this.record = apiRes.ret;
          this.cashPage.getRecord780(this.record );
          this.cashPage.go(_value);
          this.router.navigate(['cash']);

        })



    }
            /**
     * 開啟及時比分網
     */
    openWebPage() {
        let select = confirm(this.lang.languageChart['瀏覽器將從新頁面開啟即時比分網']);
        if(select) {
            window.open(
                'http://m.7m.com.cn/live/',
                '_blank', 'location = yes, fullscreen = yes, status = yes'
            );
        }
    }
                /**
     * 開啟代理
     */
    openagPage() {
        let select = confirm(this.lang.languageChart['開啟網頁,疑問請洽客服']);
        if(select) {
            window.open(
                'https://ag.168801.net/'
            );
        }
    }
   /**
    * 開啟iframe
    */
    GOtoken(){
        this.token = !this.token
    }
   /**取得下注明細 */
   private getDetail() {
    let req = { 'uid': this.uid, 'lang': this.nowLang };
    this.api.postServer(650, req).subscribe(apiRes => {
        if (!apiRes.err) { return; }
            apiRes.ret.forEach(element => {
                this.detail = this.detail+element.gold;
            });
        });
    }
}