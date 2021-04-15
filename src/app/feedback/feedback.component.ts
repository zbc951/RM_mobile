//Angular
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
//Service
import { ApiService, LanguageService, MemberService } from 'service';
//RxJS
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";

import { QQid , p_id ,c_url} from 'lib/config';
// import { cservice } from '../../lib/config';

@Component({
    templateUrl: 'feedback.component.html',
    styleUrls: ['feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
    constructor(
        private api: ApiService,
        private member: MemberService,
        public location: Location,
        public lang: LanguageService
    ) { }
    /**使用者憑證 uid ts*/
    private uid: string = this.member.uid;
    //-------------------------------------------------------//
    /**客服子頁面 ts html*/
    subPage: string = 'onLine';
    /**input 聯絡方式 ts html*/
    contactT: string = '';
    /**input 內容 ts html*/
    problemT: string = '';
    feedback: Array<string> = [];
    //-------------------------------------------------------//
    qrCodeTitle: string;
    qrCodeLink: string;
    dialogDOMSubs: Subscription;
    //-------------------------------------------------------//
    P_ID=p_id;
      /**會員資料 訂閱 ts*/
    private profileSubs: Subscription;
    /**會員資料 ts html*/
    profile: any = {};
    ngOnInit() {
        this.profileSubs = this.member.profile$.subscribe((res) => { this.profile = res; });
        //dget: 取得歷史發問訊息
        this.getFeedback('dget', '', '');
        //載入線上客服外部模組
        // cservice(window, document, 'script', '_MEIQIA');
        // const BTN  = document.getElementById('MEIQIA-BTN');
        // if(BTN) {
        //     BTN.style.display = 'block';
        // }
        console.log(p_id);
    }

    ngOnDestroy() {
        // const BTN  = document.getElementById('MEIQIA-BTN');
        // BTN.style.display = 'none';

        //整理有回覆、未讀的id，頁面關閉後傳 gateway 設為已讀
        Observable.from(this.feedback)
            .filter(item => item['status'] == 1 && item['chk'] == 0)
            .subscribe({
                next: (item) => {
                    let req = { 'uid': this.uid, 'type': 'dup', 'id': item['id'] };
                    this.api.postServer(940, req).subscribe();
                },
                complete: () => {
                    //更新已讀未讀
                    this.member.getProfile();
                }
            });
    }

    private getFeedback(type: string, contact: string, problem: string) {
        let req = { 'uid': this.uid, 'type': type, 'contact': contact, 'problem': problem };
        this.api.postServer(940, req).subscribe(apiRes => {
            //送出內容(dins)後，在抓一次歷史發問(dget)來呈現
            if (type == 'dins') { this.getFeedback('dget', '', ''); return; }
            this.feedback = apiRes.ret;
        })
    }
    openCS(){
        window.open(c_url);
    }
    submitQues() {
        if (!this.problemT) { alert(this.lang.languageChart['請輸入內容']+'!'); return; }
        //dins: 送出內容
        this.getFeedback('dins', '', this.problemT);
        this.problemT = '';
    }

    /**
     * 開啟第三方 App
     * @param option 選項
     */
    openApps(option) {
        switch (option) {
            case 'online':
                window.open('http://f18.livechatvalue.com/chat/chatClient/chatbox.jsp?companyID=843537&configID=68479&jid=9921163027');
                //打開線上客服模組
                // const PANEL  = document.getElementById('MEIQIA-PANEL-HOLDER');
                // const IFRAME = document.getElementById('MEIQIA-IFRAME');
                // const BTN    = document.getElementById('MEIQIA-BTN-HOLDER');
                // IFRAME.style.display = "block";
                // PANEL.style.left = '0';
                // PANEL.style.zIndex = '2147483647';
                // PANEL.style.visibility = 'visible';
                break;
            case 'Weibo':
                window.open('https://m.weibo.cn/u/6267582467');
                break;
            default:
                break;
        }
    }

    /**
     * 開啟 QR CODE 畫面
     * @param option  選項
     */
    qrCode(option) {

        switch (option) {
            case 'QQ':
                this.qrCodeTitle = 'QQ';
                this.DialogDOM();
                break;
            case 'WeChat':
                this.qrCodeTitle = '微信';
                this.DialogDOM();
                break;
            case 'Weibo':
                this.qrCodeTitle = '微博';
                this.qrCodeLink = 'https://m.weibo.cn/u/6267582467';
                this.DialogDOM();
                break;

            default:
                break;
        }
    }
    QQalert(){
        alert(this.lang.languageChart['請加客服QQ帳號']+QQid);
    }
    /**點擊黑色半透明區塊，關閉QR CODE 頁*/
    private DialogDOM() {
        const dialogDOM = document.getElementById('qrcode_page');
        const touchEnd = Observable.fromEvent(dialogDOM, 'touchend');

        dialogDOM.style.visibility = "visible";

        this.dialogDOMSubs = touchEnd
            .filter(event => event['target']['id'] === 'qrcode_page' || event['target']['className'] === 'title' || event['target']['className'] === 'close')
            .subscribe(() => {
                dialogDOM.style.visibility = "hidden";
                this.dialogDOMSubs.unsubscribe();
            });
    }
    showChatlink(){
        window.open('/app2/chatlink.html');
    }
}