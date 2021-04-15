//Angular
import { Component, OnInit, OnDestroy, ViewChild ,HostListener} from "@angular/core";
import { Router } from "@angular/router";
import {
  ApiService,
  MemberService,
  LanguageService,
  LoadingService,
  footerService,
  MarketService
} from "service";
//Component
import { HandicapComponent } from "./handicap/handicap.component";
import { MarketSortComponent } from "./m-sort/m-sort.component";
import  { FooterComponent } from '../_footer/footer.component';
//RxJS
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import "rxjs/add/observable/from";
import "rxjs/add/operator/mergeMap";

import { CashPageService } from "../cash/cash-page.service";
//Others
import { host } from "lib/config";
import * as $ from 'jquery';
@Component({
  templateUrl: "market.component.html",
  styleUrls: ["market.component.scss"]
})
export class MarketComponent implements OnInit, OnDestroy {
  constructor(
    private api: ApiService,
    private member: MemberService,
    public lang: LanguageService,
    public router: Router,
    private loader: LoadingService,
    public cashPage: CashPageService,
    public footer: footerService,
    public Market: MarketService
    
  ) { }
  /**Child Component */
  @ViewChild(MarketSortComponent) MarketSortComponent: MarketSortComponent;
  @ViewChild(HandicapComponent) HandicapComponent: HandicapComponent;
    /** Foot 傳遞直*/
  @ViewChild(FooterComponent) FooterComponent: FooterComponent;

  //@HostListener('window:scroll', ['$event']) // for window scroll events
  @HostListener('scroll', ['$event']) private onScroll($event:Event):void {
    console.log($event.srcElement, $event.srcElement);
  };
  //-----------------------------------------------//
  /**動畫狀態 ts html*/
  status: boolean = true;
  billboardState: string = sessionStorage.getItem("billboardState");
  //-----------------------------------------------//
  /**使用者憑證 uid ts*/
  private uid: string = this.member.uid;
  /**球種 ts*/
  private gtype: string = host.ballType;
  /**語系 ts*/
  private nowLang: string = this.lang.nowLang;
  //-----------------------------------------------//
  /**語系對照表(聯盟) ts*/
  private leagueChart: object;
  /**語系對照表(球種) ts*/
  private teamChart: object;
  //-----------------------------------------------//
  /**會員資料 訂閱 ts*/
  private profileSubs: Subscription;
  /**會員資料 ts html*/
  profile: any = {};
  //-----------------------------------------------//
  /**全部賽事 分類比對根據 html*/
  sortAllDis: boolean = false;
  /**日期賽事 分類比對根據 html*/
  sortDateDis: any = "-1";
  /**聯盟賽事 分類比對根據 html*/
  sortLeagueDis: boolean = false;
  //-----------------------------------------------//
  /**市場列表 ts html*/
  marketList: Array<any> = this.Market.marketList;
     /**市場列表熱門 ts html*/
    marketListHoT: Array<any> = this.Market.marketListHoT;
  /**傳送給 HandicapComponent 元件的市場物件  ts html */
  marketItem: any = this.cashPage.tomarketItem
    ? this.cashPage.tomarketItem
    : undefined;
  /**賽事倒數 ts html*/
  watchGameTime: any;
  /**跑馬燈資料 ts html*/
  billboard: string = "";
  /**跑馬燈樣式  ts html*/
  marqueeStyle: string = "";
  ALLmarketList: any;

  /**設置菜單 */
  openmenu: boolean = false;
  QuickV: any = undefined;

  /**公告熱門賽事 */
  openHot = false;
  /**熱門賽事觸發亂數 */
  hotCumulative = 0;
  /**熱門模式 */
  Hotmode = false;
  /**交換排序 預設 聯盟 */
  timemode = true;
  /**收尋的字串 */
  search = '';
/**第一次加仔的判斷 */
  first = true;

  timeout : any;
  scrollTop =0;

  Changecss =true;

  /**語系對照表 */
  lang_name={
    'zh-tw':'c',
    'zh-cn':'g',
    'en-us':'e',
    'ja-jp':'j',
    'th':'g',
  }
  ngOnInit() {

    if(this.marketList){
      //轉為聯盟排列
      this.ALLmarketList = this.AllianceRow(this.marketList);
    }
               
    this.getMarket();
    //取得並監聽會員資料
    this.member.getProfile();
    this.profileSubs = this.member.profile$.subscribe(res => {
      this.profile = res;
    });
    //取得跑馬燈資料
    this.getBillboard();
    //熱門賽事
  //  this.getMarketHoT();

    if(this.marketItem){
      setTimeout(() => {
        this.ChangeLayout(false);
      }, 1000);
    }

    // this.ChangeLayout();
  }
  ngOnDestroy() {
    clearInterval(this.watchGameTime);
    this.footer.getopen('closed');
    this.loader.displayLoader(false);
    //關閉改變的css
    this.ChangeLayout(true);
  }

  /**
   * 取得市場列表
   * Hotmode 預設false ; true的話就是熱門賠率模式
   * 120是原版 121 是熱門賽事'
   */
  getMarket() {
    if(!this.marketList || !this.first){
      this.loader.displayLoader(true);
      this.first =false;
    }
    

    let req120 = { uid: this.uid, gtype: this.gtype, lang: this.nowLang };


        let APIRequest120 = this.api
          .postServer(120, req120)
          .filter(apiRes120 => apiRes120.err == true)
          .map((apiRes120)=>{
            let arr=[];
            apiRes120.ret.forEach(element => {
              if(!element['ctname']|| !element['htname'] || !element['lname']||
                !element['lname'] ||  
                !element['htname'] ||
                !element['ctname']){
    
                console.log(element);
              }else{
                if(this.Hotmode){
                  if(element.hot == 'Y'){
                    arr.push(element);
                  }
                }else{
                  arr.push(element);
                }
               
              }
            });
            apiRes120.ret = arr;
            return apiRes120;
          })
          .subscribe(apiRes120 => {
            this.marketList = apiRes120.ret;
            
            //不斷監聽賽事時間，顯示倒數
            clearInterval(this.watchGameTime);
            this.watchGameTime = setInterval(() => {
              this.dateDifference();
            }, 1000);
            //市場列表 日期、聯盟(分類用)
            let dateSortList = [];
            let leagueSortList = [];
            let hot =[];
            Observable.from(this.marketList).subscribe({
              next: item => {
                //格式化資料時間戳，新增 date 、 time 欄位
                let gdate: any = new Date(item["time"]);
                let _year = gdate.getFullYear();
                let _month = ("0" + (gdate.getMonth() + 1)).slice(-2);
                let _date = ("0" + gdate.getDate()).slice(-2);
                let _hours = ("0" + gdate.getHours()).slice(-2);
                let _minutes = ("0" + gdate.getMinutes()).slice(-2);
                item["date"] = _year + "-" + _month + "-" + _date;
                item["mtime"] = _hours + ":" + _minutes;
                //聯盟、主隊、客隊語系對照
                let lc = item['lname'];
                let hc = item['htname'];
                let cc = item['ctname'];
                if (lc) {
                  item["lid"] = lc;
                }
                if (hc) {
                  item["ht"] = hc;
                }
                if (cc) {
                  item["ct"] = cc;
                }
                if(item.hot == 'Y'){
                  hot.push(item);
                }
                //市場列表 日期、聯盟(分類用) 置入
                dateSortList.push(item["date"]);
                leagueSortList.push(item["lid"]);
              },
              complete: () => {
                //市場列表 日期、聯盟(分類用) 給 MarketSortComponent 整理
                this.MarketSortComponent.dateSortList = this.MarketSortComponent.countList(
                  dateSortList
                );
                this.MarketSortComponent.leagueSortList = this.MarketSortComponent.countList(
                  leagueSortList
                );
                APIRequest120.unsubscribe();
              }
            });
            this.marketListHoT = hot;
            this.Market.receive(2,this.marketListHoT);
            if(!this.Hotmode){
              this.Market.receive(1,this.marketList);
            }
            //收尋隊伍功能
            if (this.search) {
              let arr = [];
              this.marketList.forEach(element => {
                if (element.ht.match(this.search) != null || element.ct.match(this.search) != null) {
                  arr.push(element);
                }
              });
              this.marketList = arr;
            }
            //轉為聯盟排列
            this.ALLmarketList = this.AllianceRow(this.marketList);
            this.loader.displayLoader(false);
          });
  }
    /**熱門取得市場列表 */
    getMarketHoT() {
      if(!this.marketListHoT || !this.first){
        this.loader.displayLoader(true);
        this.first =false;
      }
      let req180 = { 'uid': this.uid, 'gtype': this.gtype, 'lang': this.nowLang };
      let req121 = { 'uid': this.uid, 'gtype': this.gtype };
  
      let APIRequest180 = this.api.postServer(180, req180).filter(apiRes180 => apiRes180.err == true).subscribe((apiRes180) => {
        let ret = apiRes180.ret;
        this.leagueChart = ret['league'];
        this.teamChart = ret['team'];
      
        let APIRequest121 = this.api.postServer(121, req121).filter(apiRes121 => apiRes121.err == true)
        .map((apiRes121)=>{
          let arr=[];
          apiRes121.ret.forEach(element => {
                if(!this.teamChart[element["ht"]] ||  !this.teamChart[element["ct"]]){
                console.log(this.teamChart[element["ht"]],this.teamChart[element["ct"]]);
                console.log(element["ht"],element["ct"]);
              }else{
                arr.push(element);
              }
          });
          apiRes121.ret = arr;
          return apiRes121;
        }).subscribe((apiRes121) => {
          this.marketListHoT = apiRes121.ret;
          
          //不斷監聽賽事時間，顯示倒數
          //市場列表 日期、聯盟(分類用)
          let dateSortList = [];
          let leagueSortList = [];
          Observable.from(this.marketListHoT).subscribe({
            next: (item) => {
              //格式化資料時間戳，新增 date 、 time 欄位
              let gdate: any = new Date(item['time']);
              let _year = gdate.getFullYear();
              let _month = ("0" + (gdate.getMonth() + 1)).slice(-2);
              let _date = ("0" + gdate.getDate()).slice(-2);
              let _hours = ("0" + gdate.getHours()).slice(-2);
              let _minutes = ("0" + gdate.getMinutes()).slice(-2);
              item['date'] = _year + '-' + _month + '-' + _date;
              item['mtime'] = _hours + ':' + _minutes;
              //聯盟、主隊、客隊語系對照
              let lc = this.leagueChart[item['lid']];
              let hc = this.teamChart[item['ht']];
              let cc = this.teamChart[item['ct']];
              if (lc) { item['lid'] = lc }
              if (hc) { item['ht'] = hc }
              if (cc) { item['ct'] = cc }
              //市場列表 日期、聯盟(分類用) 置入
              dateSortList.push(item['date']);
              leagueSortList.push(item['lid']);
  
            }
          });
          this.Market.receive(2,this.marketListHoT);
          this.loader.displayLoader(false);
        });
      });
    }
  /**更新列表 */
  upgetProfile() {
    //取得並監聽會員資料
    this.member.getProfile();
  }
  /**
   * 聯盟排列
   * @param _d 原始資料
   */
  AllianceRow(_d) {
    let obj = {};
    let leycss=0;
    _d.forEach((element, key) => {
      if (key == 0) {
        obj[element.lid] = [element];
      } else {
        if (obj[element.lid]) {
          obj[element.lid].push(element);
        } else {
          obj[element.lid] = [element];
        }
      }
    });
    for(let k in obj){
      obj[k].forEach(element => {
        element.css = leycss;
        leycss++;
      });
    }

    return obj;
  }
  /**投注賽是 切換賽事 熱門 全部*/
  SwitchEvents() {
    this.Hotmode = !this.Hotmode;
    //清除收尋條件
    if (this.search != '') {
      this.search = '';
    }
    //120是原版 121 是熱門賽事'
    //交換120跟121 跑一次更新
    this.getMarket();
    this.loader.displayLoader(true);
  }
  /**切換排序 */
  ToggleSort() {
    this.timemode = !this.timemode;
    //清除收尋條件
    if (this.search != '') {
      this.search = '';
      this.getMarket();
    }
    if (this.timemode) {
      this.sortDisplay(["date", "-1"]);
    } else {
      this.sortDisplay(["all"]);
    }

  }
  /**取得跑馬燈資料 */
  private getBillboard() {
    let req = { uid: this.uid, lang: this.nowLang };
    this.api
      .postServer(810, req)
      .filter(apiRes => apiRes.err == true)
      .flatMap(apiRes => apiRes.ret)
      .subscribe({
        next: msg => {
          //串接跑馬燈字串
          this.billboard += msg["content"] + "    ";
        },
        complete: () => {
          //設定跑馬燈動畫
          let time = (this.billboard.length / 6).toFixed(0);
          if (Number(time) < 10) {
            time = "10";
          }
          this.marqueeStyle = "marquee " + time + "s linear 0s infinite";
        }
      });
  }

  /**
   * 由 MarketSortComponent 通知執行分類
   * @param basis 分類根據
   */
  sortDisplay(basis) {
    //清除收尋條件
    if (this.search != '') {
      this.search = '';
      this.getMarket();
    }
    switch (basis[0]) {
      case "all":
        this.sortAllDis = true;
        this.sortDateDis = false;
        this.sortLeagueDis = false;
        break;
      case "date":
        this.timemode = true;
        this.sortAllDis = false;
        this.sortDateDis = basis[1];
        this.sortLeagueDis = false;
        break;
      case "league":
        this.timemode = false;
        this.sortAllDis = false;
        this.sortDateDis = false;
        this.sortLeagueDis = basis[1];
        break;
      default:
        break;
    }

  }
  /**
   * 接收條件
   * @param _s 
   */
  ReceptionConditions(_Team) {
    this.search = _Team;
    this.getMarket();
  }
  /**
   * 接聽來自 HandicapComponent 的訊息
   * @param msg 訊息
   */
  handicapListener(msg) {
    if(msg == 'stay'){
      setTimeout(() => {
        this.ChangeLayout(true);
      }, 1000);
    }
    switch (msg) {
      //顯示市場列表動畫，並關閉 HandicapComponent 元件
      case "stay":
        this.status = true;
        //待動畫結束再關閉 HandicapComponent
        setTimeout(() => {
          this.marketItem = undefined;
        }, 400);
        break;
      //顯示市場列表動畫
      case "out":
        this.status = false;
        break;
      //更新市場列表
      case "update":
        this.getMarket();
        break;
      default:
        break;
    }
  }

  /**
   * 頁面跳轉至 HandicapComponent 並取得玩法列表
   * @param item  被選擇到的市場物件
   * @param gtype 球種
   */
  checkHandicap(item, gtype) {
    this.loader.displayLoader(true);
    this.ChangeLayout(false);
    //Input 給 HandicapComponent marketItem，進而開啟 BetComponent
    //正常進入賽事時 清除快速下注的資料
    this.QuickV = undefined;
    this.marketItem = { item: item, gtype: gtype };
  }

  /**改變跑馬燈顯示狀態 */
  changeBillboardState() {
    if (this.billboardState == "true") {
      this.billboardState = "false";
      sessionStorage.setItem("billboardState", "false");
    } else {
      this.billboardState = "true";
      sessionStorage.setItem("billboardState", "true");
    }
  }

  /**賽事倒數判斷及顯示 */
  private dateDifference() {
    Observable.from(this.marketList).subscribe({
      next: item => {
        let gameDate: any = new Date(item["time"]);
        let nowDate: any = new Date();
        //開賽與現在時間 時間差
        let diff = (gameDate - nowDate) / 1000;
        let diffDays = Math.floor(diff / (24 * 3600));
        let diffHours = Math.floor((diff % (24 * 3600)) / 3600);
        let diffminutes = ("0" + Math.floor((diff % 3600) / 60)).slice(-2);
        let diffSeconds = ("0" + Math.floor(diff % 60)).slice(-2);
        //若日期差、小時差為 0 顯示倒數 (增加欄位)
        if (diffDays == 0 && diffHours == 0) {
          item["reciprocal"] = diffminutes + " : " + diffSeconds;
          if (Number(diffminutes) < 10) {
            item["msg"] = this.lang.languageChart['即將封盤']+"!";
            //若有封盤的賽事，重抓賽事列表
            if (Number(diffminutes) == 0 && Number(diffSeconds) == 0) {
              //如果畫面已進入盤口列表，回到市場列表頁並重抓
              if (this.marketItem != undefined) {
                alert(this.lang.languageChart['賽事已開! 請重新選擇賽事']);
                this.HandicapComponent.betListener("reload");
                return;
              }
              this.getMarket();
            }
          }
        }
        // console.log(diffDays + " days, " + diffHours + " hours, " + diffminutes + " minutes, " + diffSeconds + " seconds");
      }
    });
  }

  Quick_bet(item, gtype,hot) {
    if(!hot){
      return;
    }
    this.loader.displayLoader(true);
    this.ChangeLayout(false);
    //Input 給 HandicapComponent marketItem，進而開啟 BetComponent
    this.QuickV = hot;
    this.marketItem = { item: item, gtype: gtype };
  }
  /**切換熱門賽事 */
  SwitchHot(_m) {
    if(_m == 'open'){
      if(this.marketListHoT && this.marketListHoT.length == 0){
        alert(this.lang.languageChart['暫無賽事']);
        return;
      }
      this.openHot = true;
      return;
    }
    if('close'){
      this.openHot = false;
      return;
    }
  }
  /**滾動事件 */
  // onScroll(event) {
  //   console.log(event);

  //   if(event.srcElement.scrollTop > this.scrollTop){
  //     this.FooterComponent.footer_out = false;
  //   }else{
  //     this.FooterComponent.footer_out = true;
  //   }
  //   this.scrollTop = event.srcElement.scrollTop;
  // }
  ChangeLayout(val){
    if(this.Changecss == val){
      return;
    }
    this.Changecss = val;
    if(!val){
      $("#main").css("display","none");
    }else{
      $("#main").css("display","block");
    }
    // this.Changecss = val;
    // if(val){
    //   console.log('ChangeLayout');
    //   $("#html1").css("height","100vh");
    //   // $("#html1").css("display","flex");
    //   $("#html1").css("position","relative");
    //   $("#body").css("position","relative");
    //   $("#main").css("position","relative");
    //   $("#main").css("overflow-y","hidden");
    //   $("#main").css("height","auto");
    //   $("#header").css("position","fixed");
    //   $("#header").css("top","0px");
  
    //   $("#aside").css("position","fixed");
    //   $("#aside").css("top","6vh");
    //   $("#footer").css("position","fixed");
    // }else{
    //   console.log('not ChangeLayout');
    //   $("#html1").css("height","100%");
    //   // $("#html1").css("display","flex");
    //   $("#html1").css("position","fixed");
    //   $("#body").css("position","fixed");
    //   $("#main").css("position","fixed");
    //   $("#main").css("overflow-y","scroll");
    //   $("#main").css("height","100%");
    //   $("#header").css("position","relative");
    //   $("#header").css("top","initial");
  
    //   $("#aside").css("position","relative");
    //   $("#aside").css("top","initial");
    //   $("#footer").css("position","absolute");
    // }

    
  }
  /**
   * 切換訊息視窗
   */
  SwitchMsg() {
    this.openmenu = !this.openmenu;
  }
  /**
   * 跳轉頁面
   * @param 要跳轉的頁面
   */
  changePage(pageName: string[]) {
    this.router.navigate(pageName);
  }
}
