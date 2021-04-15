//Angular
import { Component, Input } from '@angular/core';
//Service
import { ApiService, LanguageService, LoadingService, MemberService } from "service";
//RxJS
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import { CashPageService } from '../cash-page.service';
@Component({
    selector: 'cash-record',
    templateUrl: 'record.component.html',
    styleUrls: ['record.component.scss']
})
export class RecordComponent  {
    constructor(
        private api: ApiService,
        private member: MemberService,
        private loader: LoadingService,
        public lang: LanguageService,
        public cashPage: CashPageService
    ) {}
    //-----------------------------------------------//
    /**使用者憑證 uid ts*/
    private uid: string = this.member.uid;
    //-----------------------------------------------//
    /**交易紀錄總頁數 ts html*/
    pages: Array<any> = [];
    /**交易紀錄現在頁數 ts html*/
    nowPage: number;
    /**交易紀錄 ts html*/
    @Input() record;
    /**交易紀錄長度 ts html*/
    recordLength: number;
    /**交易狀態對照 ts*/
    private type = { '0': '櫃員機轉帳', '1': '網銀轉帳', '2': '手機銀行轉帳', '3': '現金櫃台轉帳' };

    ngOnInit() {
        if(this.record.list && this.record.list.length == 0){
            this.record =this.cashPage.record;
        }
    
        this.getRecord(1, 'init');
        
    }
    ngOnDestroy() {
        this.loader.displayLoader(false);
    }
    /**
     * 取得交易紀錄
     * @param page  頁次
     * @param state 狀態(判別是否為第一次執行)
     */
    getRecord(page: number, state?: string) {
        this.nowPage = page;

        //第一次執行
        if(state == 'init') {
            this.recordLength = this.record.page;
            //製作交易頁數
            Observable.interval(0).take(this.recordLength)
                    .subscribe({ next: (v) => { this.pages.push(++v); } });
            return;
        }

        //切換頁
        this.loader.displayLoader(true);
        let req = { 'uid': this.uid, 'page': page };
        this.api.postServer(780, req).subscribe(apiRes => {
            this.loader.displayLoader(false);
            if(!apiRes.err) { return; }
            this.record = apiRes.ret;
            this.recordLength = this.record.page;
            //交易狀態名稱對照
            if(this.record.list) {
                Observable.from(this.record.list)
                    .map(i => { i['type'] = this.type[i['type']] })
                    .subscribe();
            }
        })

    }
}