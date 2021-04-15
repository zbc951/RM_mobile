//Angular
import { Component, Output, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';
//Service
import { ApiService, LanguageService, MemberService, LoadingService } from 'service';
//Component
import { BetComponent } from './bet/bet.component';
//RxJS
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { CashPageService } from '../../cash/cash-page.service';

@Component({
    selector: 'handicap',
    templateUrl: 'handicap.component.html',
    styleUrls: ['handicap.component.scss']
})

export class HandicapComponent implements OnInit, OnDestroy{
    constructor(
        private api: ApiService,
        public lang: LanguageService,
        private member: MemberService,
        private loader: LoadingService,
        public cashPage: CashPageService,
    ){}

    /**帳戶餘額 MarketComponent → HandicapComponent  ts html*/
    @Input() profileSurplus;
    /**自 MarketComponent 的市場物件 ts html*/
    @Input() marketItem: any;

    
    @Input() QuickV: any;
    //-----------------------------------------------//
    /**動畫狀態 ts html*/
    state: string = 'out';
    //-----------------------------------------------//
    /**通知 MarketComponent */
    @Output() callMarket = new EventEmitter();
    //-----------------------------------------------//
    private uid: string = this.member.uid;
    private nowLang: string = this.lang.nowLang;
    //-----------------------------------------------//
    /**更新倒數控制器 ts*/
    private timeOutControl: any;
    /**設定更新倒數秒數 ts*/
    private setUpdateTime: number = 60;
    /**現在更新倒數秒數 ts html*/
    updateTime: number;
    /**更新提示文字 */
    msg: boolean = false;
    //-----------------------------------------------//
    /**傳送給 BetComponent 元件的下注資料  ts html*/
    betInfo: object;
    //-----------------------------------------------//
    /**賽事盤口 ts html*/
    handicap: Array<any> = [];
    /**對戰紀錄資料 ts html*/
    recordFile: Array<object>;

    /**選擇 PD || HRPD */
    selectPtype = '';
    /**下注選擇的資料 紀錄 */
    selectItem = {};

    /**由 Input 控制 ngIf 開啟本元件觸發 ngOnInit */
    ngOnInit() {
        //取得賽事盤口、並開啟更新功能
        this.getHandicap(true);
        this.updateHandicap();
        this.cashPage.gomarket(undefined);
        if(this.QuickV){
            this.betRegister('PD',this.QuickV);
            this.QuickV = undefined;
        }
    }

    ngOnDestroy() {
        clearTimeout(this.timeOutControl);
        this.loader.displayLoader(false);
    }

    /**
     * 取得賽事盤口
     * @param fromMarket 是否由 MarketComponent 觸發
     * @param callbackBetRegister 回呼 betRegister()
     */
    getHandicap(fromMarket?: boolean, callbackBetRegister?) {
        let req = { 'uid': this.uid, 'gtype': this.marketItem.gtype, 'gid': this.marketItem.item.gid };
        //RXJS 舊寫法
        let APIRequest = this.api.postServer(130, req).subscribe((apiRes) => {
            //賽事關盤處理
            if(apiRes['_err_msg'] == '10003') {
                this.checkMarket();
                this.callMarket.emit('update');
                return;
            }
            //玩法列表增加 ptype 欄位
            let ret = apiRes['ret']['ptype'];
            Observable.from(Object.keys(ret)).map(item => {
                ret[item]['ptype'] = item;
            }).subscribe({
                complete: () => {
                    //如果呼叫此 getHandicap 來自 市場列表
                    if(fromMarket) {
                        //動畫: 關閉市場列表
                        this.callMarket.emit('out');
                        //動畫: 打開賽事盤口
                        this.state = 'stay';
                    }
                    //賽事盤口予值
                    this.handicap = Object.values(ret);
                    this.loader.displayLoader(false);
                    //回呼betRegister
                    if(callbackBetRegister) { callbackBetRegister(); }
                    APIRequest.unsubscribe();
                }
            });
        });
    }


    /**
     * 更新賽事盤口計時器
     * @param msg 備註訊息
     */
    updateHandicap(msg?) {
        //如果非自然倒數結束的更新
        if( msg === 'proactive' ) {
            //更新訊息提示
            this.msg = true;
            setTimeout(() => { this.msg = false; }, 800);

            clearTimeout(this.timeOutControl);
            this.getHandicap();
        }
        this.updateTime = this.setUpdateTime;
        this.timeOutControl = setInterval(() => {
            this.updateTime--;
            if(this.updateTime === 0) {
                this.getHandicap();
                clearTimeout(this.timeOutControl);
                this.updateHandicap();
            }
        }, 1000);
    }

    /**
     * 下單準備 MarketBetComponent
     * @param ptype 被選擇到的玩法
     * @param item  被選擇到的選項
     */
    betRegister(ptype, item) {
        //作為更新賠率用 紀錄點選的資料 因每次下注都會點一次 無清除
        this.selectPtype = ptype;
        this.selectItem = item;
        //若無顯示獲利、可交易量為0，就無法點擊下住
        if( !item['win'] || item['trade'] == '0' ) { return; }

        //取得最新盤口資訊後，再打開下注視窗
        this.getHandicap(false, ()=>{
            //Input 給 BetComponent betInfo，進而開啟 BetComponent
            this.betInfo = {
                'gtype'  : this.marketItem['gtype'],
                'ptype'  : ptype,
                'lid'    : this.marketItem.item['lid'],
                'gid'    : this.marketItem.item['gid'],
                'ht'     : this.marketItem.item['ht'],
                'ct'     : this.marketItem.item['ct'],
                'time'   : this.marketItem.item['mtime'],
                'date'   : this.marketItem.item['date'],
                'option' : item['option'],
                'win'    : item['win'],
                'trade'  : item['trade']
            };
        });
    }


    /**取得對戰紀錄 */
    getRecord() {
        this.loader.displayLoader(true);
        let req = { 'uid': this.uid, 'lang': this.nowLang, 'gtype': this.marketItem['gtype'], 'gid': this.marketItem.item['gid'] };
        this.api.postServer(681, req)
            .filter(apiRes => apiRes.err == true).subscribe(apiRes => {
                this.loader.displayLoader(false);
                this.recordFile = apiRes.ret;
                this.recordFile['gid'] = this.marketItem.item['gid'];
            });
    }
    getNewRecord() {
        this.loader.displayLoader(true);
        let req = { 'uid': this.uid, 'lang': this.nowLang, 'gtype': this.marketItem['gtype'], 'gid': this.marketItem.item['gid'] };
        this.api.postServer(770, req)
            .filter(apiRes => apiRes.err == true).subscribe(apiRes => {
                this.loader.displayLoader(false);
                if(apiRes.ret.length == 0){
                    alert(this.lang.languageChart['目前無對戰紀錄']);
                    return
                }
                console.log(apiRes);
                this.recordFile = apiRes.ret;
                this.recordFile['gid'] = this.marketItem.item['gid'];
            });
    }
    /**
     * 接聽來自 BetComponent 的訊息
     * @param msg 訊息
     */
    betListener(msg) {
        switch (msg) {
            //更新賽事盤口、更新賽事盤口計時器
            case 'update':      
               //賠率改變 更新賠率
            this.getHandicap(false, ()=>{
                let item,items;
                this.handicap.forEach(element => {
                   if( element.ptype == this.selectPtype){
                    item = element.table;
                   }
                });
                item.forEach(element => {
                    if(element.option == this.selectItem ['option']){
                        items = element;
                    }
                });
                //Input 給 BetComponent betInfo，進而開啟 BetComponent
                this.betInfo = {
                    'gtype'  : this.marketItem['gtype'],
                    'ptype'  : this.selectPtype,
                    'lid'    : this.marketItem.item['lid'],
                    'gid'    : this.marketItem.item['gid'],
                    'ht'     : this.marketItem.item['ht'],
                    'ct'     : this.marketItem.item['ct'],
                    'time'   : this.marketItem.item['mtime'],
                    'date'   : this.marketItem.item['date'],
                    'option' : this.selectItem ['option'],
                    'win'    : items['win'],
                    'trade'  : items['trade']
                };
            });
            
            this.updateHandicap('proactive'); 
            
            
            break;
            //通知 市場列表 更新、頁面跳轉至 市場列表
            case 'reload': this.callMarket.emit('update'); this.checkMarket();  break;
            //關閉下注視窗元件(清空Input)
            case 'closeDialog': this.betInfo = undefined;  this.recordFile = undefined; break;
            default:  break;
        }
    }

    /**頁面跳轉至 MarketComponent */
    checkMarket() {
        //清除更新倒數控制器
        clearTimeout(this.timeOutControl);
        //動畫: 關閉玩法列表
        this.state = 'out';
        //動畫: 打開市場列表
        this.callMarket.emit('stay');
    }
    /**直播 */
    live(){
        alert('');
    }
}