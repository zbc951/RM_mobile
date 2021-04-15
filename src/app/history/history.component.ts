//Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
//Service
import { ApiService, LanguageService, LoadingService, MemberService } from 'service';
//Conponent
import { HistoryDetailComponent } from './h-detail/h-detail.component';
//Others
import { getWeek, formatDate } from 'lib/functions';
import { host } from 'lib/config';

@Component({
    templateUrl: 'history.component.html',
    styleUrls: ['history.component.scss'],
    animations: [
        trigger('goleft', [
            state('void', style({ transform: 'translateX(110%)' })),
            state('*', style({ transform: 'translateX(0)' })),
            transition('* => *', animate('300ms ease-in-out'))
        ])
    ]
})
export class HistoryComponent implements OnInit, OnDestroy {
    constructor(
        private api   : ApiService,
        private member: MemberService,
        private loader: LoadingService,
        public lang   : LanguageService,
        
    public router: Router,
    ) {}
    //-----------------------------------------------//
    /**使用者憑證 uid ts*/
    private uid: string = this.member.uid;
    /**語系 ts*/
    private nowLang: string = this.lang.nowLang;
    /**球種 ts*/
    private gtype: string = host['ballType'];
    //-----------------------------------------------//
    /**本週上週日期 ts*/
    week: any = getWeek();
    /**input date 開始日期 html*/
    sdate: string = this.week['lestweekStart'];
    /**input date 結束日期 html*/
    edate: string = this.week['thisweekEnd'];
    //-----------------------------------------------//
    /**現在帳務範圍 ts html*/
    nowAccount: string;
    //-----------------------------------------------//
    /**本週帳務 ts html*/
    thisWeekAcc: any;
    /**上週帳務 ts html*/
    lestsWeekAcc: any;
    /**自訂日期帳務 ts html */
    customWeekAcc: any;
    /**傳送給 HistoryDetailComponent 元件的 被選歷史帳務  ts html*/
    selectionAcc: any;
    //-----------------------------------------------//
    /**分類視窗狀態 ts html*/
    dialogStatus: boolean = false;

    ngOnInit() {
        this.switchHistory('biweekly');
    }
    ngOnDestroy() {
        this.loader.displayLoader(false);
    }

    /**
     * 切換歷史帳務
     * @param nowAccount 被選到的歷史帳務
     */
    switchHistory(nowAccount) {
        switch (nowAccount) {
            case 'biweekly':
                this.nowAccount = '近兩週';
                this.getHistory(this.week['thisweekStart'], this.week['thisweekEnd'], 1);
                this.getHistory(this.week['lestweekStart'], this.week['lestweekEndDate'], 2);
                break;
            case 'tmonth':
                //取得本月開始及結尾日期
                let date = new Date(), year = date.getFullYear(), month = date.getMonth();
                let firstDay = new Date(year, month, 1);
                let lastDay = new Date(year, month + 1, 0);
                this.nowAccount = '本月';
                this.getHistory(formatDate(firstDay), formatDate(lastDay));
                break;
            case 'lmonth':
                //取得上一個月的開始及結尾日期
                let ldate = new Date(), lyear = ldate.getFullYear(), lmonth = ldate.getMonth()-1;
                let lfirstDay = new Date(lyear, lmonth, 1);
                let llastDay = new Date(lyear, lmonth + 1, 0);
                this.nowAccount = '上一個月';
                this.getHistory(formatDate(lfirstDay), formatDate(llastDay));
                break;
            case 'lyear':
                this.nowAccount = '年';
                this.getHistory_year();
                break;
            default:
                this.nowAccount = '自訂日期';
                this.getHistory(this.sdate, this.edate)
                break;
        }
    }


    /**
     * 帳戶歷史(大綱)搜尋
     * @param sdate 開始日期
     * @param edate 結束日期
     */
    getHistory(sdate: any, edate: any, status?: number) {
        //日期輸入錯誤處理
        if( this.dateDifference(sdate, edate) > 30 ) {
            //alert('日期间隔请小于 30 天');
            //return;
        }else if(sdate > edate) {
            alert(this.lang.languageChart['開始日期請在結束日期之前']);
            return;
        }
        this.loader.displayLoader(true);
        //初始值歸 0
        this.thisWeekAcc   = { 'totCount':0, 'totGold':0, 'totWin':0, 'list':[] };
        this.lestsWeekAcc  = { 'totCount':0, 'totGold':0, 'totWin':0, 'list':[] };
        this.customWeekAcc = { 'totCount':0, 'totGold':0, 'totWin':0, 'list':[] };

        let req = { 'uid': this.uid, 'sdate': sdate, 'edate': edate, 'gtype': this.gtype, 'lang': this.nowLang };

        let APIRequest = this.api.postServer(619, req)
            .filter(apiRes => apiRes.err == true)
            .flatMap(apiRes => {
                let ret = apiRes.ret;
                switch (status) {
                    case 1:
                        this.edate = this.week['thisweekEnd'];
                        this.thisWeekAcc['list'] = ret;
                        break;
                    case 2:
                        this.sdate = this.week['lestweekStart'];
                        this.lestsWeekAcc['list'] = ret;
                        break;
                    default:
                        this.sdate = sdate;
                        this.edate = edate;
                        this.customWeekAcc['list'] = ret;
                        break;
                }
                return ret;
            }).subscribe({
                next: (item) => {
                    this.loader.displayLoader(false);
                    switch (status) {
                        case 1:
                            this.thisWeekAcc['totGold'] += item['gold'];
                            this.thisWeekAcc['totWin']  += item['win'];
                            break;
                        case 2:
                            this.lestsWeekAcc['totGold'] += item['gold'];
                            this.lestsWeekAcc['totWin']  += item['win'];
                            break;
                        default:
                            this.customWeekAcc['totGold'] += item['gold'];
                            this.customWeekAcc['totWin']  += item['win'];
                            break;
                    }
                },
                complete: () => { APIRequest.unsubscribe(); }
            });

    }



    /**
     * 帳戶歷史(大綱)搜尋
     * @param sdate 開始日期
     * @param edate 結束日期
     */
    getHistory_year() {

      this.loader.displayLoader(true);
      //初始值歸 0
      this.thisWeekAcc   = { 'totCount':0, 'totGold':0, 'totWin':0, 'list':[] };
      this.lestsWeekAcc  = { 'totCount':0, 'totGold':0, 'totWin':0, 'list':[] };
      this.customWeekAcc = { 'totCount':0, 'totGold':0, 'totWin':0, 'list':[] };

      let req = { 'uid': this.uid, 'gtype': this.gtype};

      let APIRequest = this.api.postServer(623, req)
          .filter(apiRes => apiRes.err == true)
          .flatMap(apiRes => {
              let ret = apiRes.ret;
              this.edate = this.week['thisweekEnd'];
              this.customWeekAcc['list'] = ret;
              return ret;
          }).subscribe({
              next: (item) => {
                  this.loader.displayLoader(false);
                  this.customWeekAcc['totGold'] += item['gold'];
                  this.customWeekAcc['totWin']  += item['win'];
              },
              complete: () => { APIRequest.unsubscribe(); }
          });

  }
    /**
     * 被選到的帳務
     * @param count 被選帳務細單數量
     * @param date  被選帳務日期
     */
    selectAcc(count, date, gold, win) {
        if(this.nowAccount == '年'){ return;}
        //帳務細單數量為 0 不給按
        if(count == 0 ) { return; }
        this.loader.displayLoader(true);
        //Input 給 HistoryDetailComponent selectionAcc，進而開啟 HistoryDetailComponent
        this.selectionAcc = {
            'gtype': this.gtype,
            'count': count,
            'date' : date,
            'gold' : gold,
            'win'  : win
        };
    }

    /**
     * 來自 HistoryDetailComponent 的通知
     * @param msg 通知訊息
     */
    hDetailListener() {
       //待動畫結束再關閉 HistoryDetailComponent
        setTimeout(() => { this.selectionAcc = undefined; }, 350);
    }

    /**
     * 計算日期之間天數差
     * @param sdate 開始日期
     * @param edate 結束日期
     */
    private dateDifference(sdate, edate) {
        let startDate: any = new Date(sdate);
        let endDate: any   = new Date(edate);

        // 天數，86400000是24*60*60*1000，除以86400000就是有幾天
        return (endDate - startDate) / 86400000 ;
    }
      /**
   * 跳轉頁面
   * @param 要跳轉的頁面
   */
  changePage(pageName: string[]) {
    this.router.navigate(pageName);
  }


}
