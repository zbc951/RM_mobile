//Angular
import { Component, Input, Output, EventEmitter } from '@angular/core';
//Service
import { ApiService, LanguageService, LoadingService, MemberService } from 'service';
interface selection { 'count': number, 'date': string, 'gold': number, 'win': number };

@Component({
    selector: 'h-detail-dialog',
    templateUrl: 'h-detail.component.html',
    styleUrls: ['h-detail.component.scss']
})


export class HistoryDetailComponent {
    constructor(
        private api: ApiService,
        private member: MemberService,
        private loader: LoadingService,
        public lang: LanguageService,
    ) { }
    /**自 HistoryComponent 的被選歷史帳務 ts html*/
    @Input() selectionAcc: any;
    /**通知 MarketComponent */
    @Output() callHistory = new EventEmitter();
    //-----------------------------------------------//
    /**視窗開啟狀態 ts html*/
    dialogStatue: Boolean = false;
    //-----------------------------------------------//
    /**使用者憑證 uid ts*/
    private uid: string = this.member.uid;
    /**語系 ts*/
    private nowLang: string = this.lang.nowLang;
    //-----------------------------------------------//
    /**日期、筆數、金額、結算 ts html*/
    selection: selection;
    /**帳戶歷史明細 ts html*/
    detial: Array<any> = [];

    /**由 Input 控制 ngIf 開啟本元件觸發 ngOnInit */
    ngOnInit() {
        this.getDetail(this.selectionAcc);
    }

    /**
     * 取得歷史帳務明細
     * @param selection 被選擇到的帳務
     */
    getDetail(selection) {
        this.selection = selection;

        let req = { 'uid': this.uid, 'date': selection['date'], 'gtype': selection['gtype'], 'lang': this.nowLang };

        let APIRequest = this.api.postServer(620, req)
            .flatMap(apiRes => {
                this.dialogStatue = true;
                this.detial = apiRes.ret;
                return this.detial;
            }).subscribe({
                next: (item) => {
                    this.loader.displayLoader(false);
                    if (item['lid2'] === '上半' && item['option'] === 'H3C0') {
                        item['option'] = '其他';
                    }
                    //開賽時間去秒數
                    item['stime'] = item['stime'].slice(0, -3);
                    //新增波膽結果欄位
                    if (item['detailed_content']['hr'] >= 0 && item['detailed_content']['cr'] >= 0) {
                        item['final'] = item['detailed_content']['hr'] + '-' + item['detailed_content']['cr'];
                    } else {
                        if (item['detailed_content']['hr'] == -1 && item['detailed_content']['cr'] == -1) {
                            item['final'] = this.lang.languageChart['賽事取消'];
                            item['win'] = this.lang.languageChart['賽事取消'];
                        }
                        if (item['detailed_content']['hr'] == -2 && item['detailed_content']['cr'] == -2) {
                            item['final'] = this.lang.languageChart['待定'];
                            item['win'] = this.lang.languageChart['待定'];
                        }
                    }
                },
                complete: () => { APIRequest.unsubscribe(); }
            });

    }

    /**頁面跳轉至 HistoryComponent */
    checkHistory() {
        //動畫: 關閉單日帳務
        this.dialogStatue = false;
        //呼叫歷史帳務移除單日帳務資料
        this.callHistory.emit();
    }

}