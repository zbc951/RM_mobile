//Angular
import { Component, Output, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';
//Service
import { ApiService, MemberService, LanguageService, LoadingService } from 'service';
//RxJS
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Router } from '@angular/router';
@Component({
    selector: 'bet',
    templateUrl: 'bet.component.html',
    styleUrls: ['bet.component.scss']
})

export class BetComponent implements OnInit, OnDestroy {
    constructor(
        private api: ApiService,
        private member: MemberService,
        private loader: LoadingService,
        public lang: LanguageService,
        public router: Router,
    ) { }
    /**帳戶餘額 MarketComponent → HandicapComponent → BetComponent  ts html*/
    @Input() profileSurplus;
    /**自 HandicapComponent 的下單資訊 */
    @Input() betInfo;
    /**日期 */

    @Input() date;
    /**時間 */

    @Input() time;
    //-----------------------------------------------//
    /**動畫狀態 ts html*/
    state: string = 'out';
    //-----------------------------------------------//
    /**通知 HandicapComponent */
    @Output() callHandicap = new EventEmitter();
    //-----------------------------------------------//
    /**使用者憑證 uid ts*/
    private uid: string = this.member.uid;
    //-----------------------------------------------//
    /**點擊視窗黑色部分 訂閱 global*/
    private dialogDOMSubs = new Subscription();
    //-----------------------------------------------//
    /**下單成功資訊( lid / ht / ct / ptype / option / bid / gold / win / estWin ) ts html*/
    betSucc: any = false;
    //-----------------------------------------------//
    /**input下注金額 ts html*/
    inputGold: number;
    /**確認下注按鈕文字 ts html*/
    betBtnText: string = this.lang.languageChart['確認投資'];
    /**下注相關按鈕等候中 ts html*/
    betBtnWaiting: boolean = false;
    //-----------------------------------------------//

    /**由 Input 控制 ngIf 開啟本元件觸發 ngOnInit */
    ngOnInit() {
        this.DialogDOM();
        //待元件完整開啟，動畫打開下注dialog
        setTimeout(() => { this.state = 'stay'; }, 10);
    }
    ngOnDestroy() {
        this.dialogDOMSubs.unsubscribe();
        this.loader.displayLoader(false);
    }

    /**確定下注 */
    bet(inputGold) {
        if( this.betBtnWaiting ){ return; }
        if (inputGold > this.profileSurplus) { return; }
        if (inputGold == this.profileSurplus) {
            const c = confirm(this.lang.languageChart['確定餘額全投']+' ?');
            if (!c) { return; }
        }
        this.loader.displayLoader(true);
        //下注當中，關閉 點擊黑色半透明區塊操作
        this.dialogDOMSubs.unsubscribe();
        //下注當中，停用 各項下注按鈕
        this.betBtnWaiting = true;
        this.betBtnText = this.lang.languageChart['交易中請稍後']+'...';

        let req = {
            'uid': this.uid,
            'gtype': this.betInfo['gtype'],
            'gid': this.betInfo['gid'],
            'gold': inputGold,
            'ptype': this.betInfo['ptype'],
            //波膽上半其他選項，傳送值 H3C0 給後端
            'option': this.betInfo['option'] === '其他' ? 'H3C0' : this.betInfo['option'],
            'win': this.betInfo['win'] / 100
        }
        //下單資訊
        const betInfoData = {
            'lid': this.betInfo['lid'],
            'ht': this.betInfo['ht'],
            'ct': this.betInfo['ct'],
            'ptype': this.betInfo['ptype'],
            'option': this.betInfo['option'],
            'gold': inputGold,
            'win': this.betInfo['win'],
            'estWin': this.winCalc(inputGold, this.betInfo['win'])
        }

        this.api.postServer(310, req).subscribe((apiRes) => {
            this.loader.displayLoader(false);
            //下注請求成功
            if (apiRes.err) { 
                let ret = apiRes.ret;
                //解除下注中
                this.betBtnWaiting = false;
                //更新會員資料
                this.member.getProfile();
                //更新賽事盤口
                this.callHandicap.emit('update');
                // //寫入 下單成功資訊
                betInfoData['bid'] = ret['bid'];
                this.betSucc = betInfoData;


                //下注請求失敗
            } else {
                //下注失敗，打開 點擊黑色半透明區塊操作
                this.DialogDOM();
                //下注失敗，啟用 各項下注按鈕
                this.betBtnWaiting = false;
                this.betBtnText = this.lang.languageChart['確認投資'];
                //清空下注金額 input
                this.inputGold = undefined;
                //除了賽事關閉 其他走下注更新
                if(apiRes.err_msg == '31004'){
                    alert(this.lang.languageChart['賽事已關閉']);
                    this.closeDialog();
                    this.callHandicap.emit('reload');
                }else{
                    this.callHandicap.emit('update');
                    alert(apiRes.err_msg);
                }
                //錯誤處理
                // switch (apiRes.err_msg) {
                //     //賽事已關閉 31004
                //     case 31004:
                //         //關閉下注視窗
                //         alert('赛事已关闭');
                //         this.closeDialog();
                //         //回到市場列表重抓 ( BetComponent → HandicapComponent → MarketComponent )
                //        // this.callHandicap.emit('reload');
                //         break;
                //     //下注金額超過該場限額 31002、賽事已停押 31005、賽事獲利改變 31006、賠率錯誤 31008
                //     case 31002: case 31005: case 31006: case 31008:
                //         //更新賽事盤口
                //         this.callHandicap.emit('update');
                //         //關閉下注視窗
                //        this.closeDialog();
                //         break;
                //     default:
                //         this.callHandicap.emit('update');
                //         break;
                // }
            }
        });
    }

    /**下注金額全押按鈕 */
    allInBouns() {
        if (typeof this.inputGold === 'undefined') { this.inputGold = 0; }
        if (this.betInfo['trade'] > this.profileSurplus) { this.inputGold = this.profileSurplus; }
        else { this.inputGold = this.betInfo['trade']; }
    }

    /**
     * 下注金額累加按鈕
     * @param gold 累加金額
    */
    inputBonus(gold) {
        if (typeof this.inputGold === 'undefined') { this.inputGold = 0; }
        this.inputGold += gold;
    }

    /**
     * 預計獲利計算
     * @param gold 下注金額
     * @param win  獲利%
     */
    winCalc(gold, win) {
        if (typeof gold == 'undefined') { return '0.00'; }
        return ((gold * win / 100) - (gold * win / 100) * 0.05).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }

    /**點擊黑色半透明區塊，關閉本元件*/
    private DialogDOM() {
        const dialogDOM = document.getElementsByClassName('mbet_dialog');
        const touchEnd = Observable.fromEvent(dialogDOM, 'touchend');
        this.dialogDOMSubs = touchEnd.filter(event => event['target']['className'] === 'mbet_dialog')
            .subscribe((a) => {
                this.callHandicap.emit('closeDialog');
            });
    }

    /**
     * 關閉下注Dialog
     */
    closeDialog() {
        if( this.betBtnWaiting ){ return; }
        this.callHandicap.emit('closeDialog');
    }
}