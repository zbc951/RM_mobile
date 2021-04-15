//Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
//Service
import { ApiService, LanguageService, LoadingService, MemberService } from 'service';
//Libriary
import { Observable } from "rxjs/Observable";
//Other
import { host } from 'lib/config';

@Component({
    templateUrl: 'detail.component.html',
    styleUrls: ['detail.component.scss'],
    animations: [
        trigger('goleft', [
            state('void', style({ transform: 'translateX(110%)' })),
            state('*', style({ transform: 'translateX(0)' })),
            transition('* => *', animate('300ms ease-in-out'))
        ])
    ]
})

export class DetailComponent implements OnInit, OnDestroy {
    constructor(
        private api: ApiService,
        private member: MemberService,
        private loader: LoadingService,
        public lang: LanguageService
    ) { }
    //-----------------------------------------------//
    /**使用者憑證 uid ts*/
    private uid: string = this.member.uid;
    /**語系 ts*/
    private nowLang: string = this.lang.nowLang;
    //-----------------------------------------------//
    /**下注明細 ts html*/
    detail: Array<object> = [];
    /** 下注明細長度 ts html */
    detailLength: number;
    //-----------------------------------------------//
    /**分類視窗狀態 ts html*/
    dialogStatus: boolean = false;
    /**日期分類根據 */
    dateSortDis: string;
    /**下注明細日期整理 ts html*/
    dateList: Array<object>;
    //開啟提示框
    public openMsg :Boolean =false;
    //提示資料
    public MsgData :any ={};
    TimeoutDetail :any;
    //預防 測單按鈕重複案
    CancellationIng:boolean = false;
    //撤單完成 資訊
    OpenCancellation :boolean = false;
    //策單回傳資料
    CancellationMsg: any = '';

    ngOnInit() {
        this.getDetail();
        this.TimeoutDetail= setInterval(() => {
            this.getDetail();
            }, 60000);
    }
    ngOnDestroy() {
        this.loader.displayLoader(false);
        clearTimeout(this.TimeoutDetail);
    }

    /**取得下注明細 */
    private getDetail() {
        this.loader.displayLoader(true);

        let estWinTot = 0;
        let dateList = [];

        let req = { 'uid': this.uid, 'lang': this.nowLang };
        let APIRquest = this.api.postServer(650, req)
            .filter(apiRes => apiRes.err == true)
            .flatMap(apiRes => {
                this.loader.displayLoader(false);
                this.detail = apiRes.ret;
                this.detailLength = this.detail.length;
                return this.detail;
            })
            .subscribe({
                next: (item) => {
                    if (item['lid2'] === '上半' && item['option'] === 'H3C0') {
                        item['option'] = '其他';
                    }
                    //添加:預估獲利欄位 estWin
                    item['estWin'] = this.winForecastCal(item['gold'], item['profit'], item['water']);
                    //修改:開賽時間去秒數
                    item['stime'] = item['stime'].slice(0, -3);
                    //匯集日期
                    dateList.push(item['btime'].slice(0, 10));
                },
                complete: () => {
                    APIRquest.unsubscribe();
                    this.dateList = this.countList(dateList);
                }
            });
    }

    /**
     * 計算陣列元素的重複次數，並編輯格式
     * @param arr 陣列
     */
    private countList(arr: Array<any>) {
        let obj = {};
        let newArr = [];

        //計算陣列元素的重複次數
        Observable.from(arr)
            .subscribe({
                next: (item) => {
                    if (typeof obj[item] === 'undefined') {
                        //對 obj 加入值，並給數量
                        obj[item] = 1;
                    } else {
                        obj[item]++;
                    }
                },
                complete: () => {
                    //編譯成需要的陣列格式 [{ 'item': 聯盟, 'count': 次數 }]
                    let item = Observable.from(Object.keys(obj));
                    let count = Observable.from(Object.values(obj));
                    item.zip(count, (x, y) => {
                        newArr.push({ 'date': x, 'count': y });
                    }).subscribe();
                }
            });
        return newArr;
    }

    /**
     * 預計獲利計算
     * @param gold   下注金額
     * @param profit 獲利%
     * @param water  退水
     */
    private winForecastCal(gold: number, profit: number, water: number) {
        return ((gold * profit / 100) - (gold * profit / 100) * 0.05) + water;
    }
        /**
     * 撤单
     */
    cancellation(_item){
      this.openMsg = true;
      this.MsgData = _item;


  }
  /**
   * 送出撤單
   */
  SendOutCancellation(){
     
      if(this.CancellationIng)return;
      this.CancellationIng = true;
      let parameter = { uid: this.uid, wid: this.MsgData.bid, lang: this.nowLang };
      this.api.postServer(333, parameter).subscribe(res => {
        this.CancellationIng = false;
          if(!res.err){
              this.openMsg = false;
              this.OpenCancellation =true;
              this.CancellationMsg =res.err_msg;
              // this.reload();
              return;
          }
          this.openMsg = false;
          this.OpenCancellation =true;
          this.CancellationMsg = res.ret;
          // this.reload();
      });
  }
  /**
   * 關閉訊息視窗
   */
  closedMsg(){
      this.openMsg = false;
      this.MsgData ={};
  }
  /**
   * 關閉訊息視窗
   */
  closedCancellation(){
    this.getDetail();
    this.OpenCancellation = false;
    this.CancellationMsg ='';
  }
}
