//Angular
import { Component, OnInit, OnDestroy, AfterViewInit ,HostListener} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
//Service
import { ApiService, LanguageService, LoadingService, MemberService ,MarketService} from 'service';
//Libriary
import { Observable } from "rxjs/Observable";
//RxJS
import { Subscription } from "rxjs/Subscription";
//Other
import { host, slidesArr } from 'lib/config';
import { CashPageService } from '../cash/cash-page.service';
import Swiper from 'swiper/dist/js/swiper.js';
import { String } from 'core-js';
import { storageMode } from 'lib/config';
import * as $ from 'jquery';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
// import   Swiper  from 'swiper';
@Component({
  templateUrl: 'homepage.component.html',
  styleUrls: ['homepage.component.scss'],
  animations: [
    trigger('active', [
      state('void', style({ transform: 'translateX(0%)' })),
      state('*', style({ transform: 'translateX(-100%)' })),
      transition('* => *', animate('300ms ease-in-out'))
    ])
  ]
})

export class HomepageComponent implements OnInit, OnDestroy, AfterViewInit {
  url: SafeResourceUrl;
  constructor(
    private api: ApiService,
    private member: MemberService,
    private loader: LoadingService,
    public lang: LanguageService,
    public router: Router,
    public cashPage: CashPageService,
    public Market: MarketService,
    public sanitizer: DomSanitizer
    
  ) {
    let token_url =  sessionStorage.getItem('token_m');
    this.url = sanitizer.bypassSecurityTrustResourceUrl(token_url);
   }
  // Addtohome :Boolean = false;
  // deferredPrompt: any;
  // @HostListener('window:beforeinstallprompt', ['$event'])


  mySwiper: Swiper;
  /**
   * 輪動圖片位子
   */
  slides = slidesArr;
  /**公告視窗 */
  openWindows = (Number(sessionStorage.getItem('open')) > 1)?false:true;
  /**公告熱門賽事 */
  openHot = false;
/**預設 下次登入不用提醒我的勾 */
  reminds = false;
  remind =localStorage.getItem('remind');
  billboardState: string = sessionStorage.getItem('billboardState');

  /**跑馬燈資料 ts html*/
  billboard: string = '';
  /**跑馬燈樣式  ts html*/
  marqueeStyle: string = '';
  /**跑馬燈部分 公告*/
  billboardSection: any=[{key:0,content:'欢迎光临',dtime:''}];
  billboardKey = 0;

  //-----------------------------------------------//
  /**語系對照表(聯盟) ts*/
  private leagueChart: object;
  /**語系對照表(球種) ts*/
  private teamChart: object;
  //-----------------------------------------------//


  //-----------------------------------------------//
  /**使用者憑證 uid ts*/
  private uid: string = this.member.uid;
  /**球種 ts*/
  private gtype: string = host.ballType;
  /**語系 ts*/
  private nowLang: string = this.lang.nowLang;
  //-----------------------------------------------//
  /**會員資料 訂閱 ts*/
  private profileSubs: Subscription;
  /**會員資料 ts html*/
  profile: any = {};
  /**市場列表 ts html*/
  marketList: Array<any>= this.Market.marketList;
   /**市場列表熱門 ts html*/
   marketListHoT: Array<any>= this.Market.marketListHoT;
  
  /**賽事倒數 ts html*/
  watchGameTime: any;
  /**傳送給 HandicapComponent 元件的市場物件  ts html */
  marketItem: any = undefined;
  /**熱門賽事 */
  Popular_events = true;
  /**列表時間 */
  ListDate = -1;
    /**熱門賽事觸發亂數 */
  hotCumulative = 0;
  /**今天數 */
  
Today=0;
/**明天數 */
Tomorrow=0;
/**動畫狀態 */
state = false;
/**優惠 */
Discount=false;
  /** token 切換 */
token = false;

/**語系對照表 */
lang_name={
  'zh-tw':'c',
  'zh-cn':'g',
  'en-us':'e',
  'ja-jp':'j',
  'th':'g',
}
  ngAfterViewInit() {

    this.mySwiper = new Swiper('.swiper-container', {
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,

      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      //播放速度
      loop: true,

      // 自动播放时间
      autoplay: 10000,

      // 播放的速度
      speed: 3000,

    });
  }
  ngOnInit() {
    //熱門賽事
    // this.getMarketHoT();
    //一班賽事
    this.getMarket();
    //取得並監聽會員資料
    this.member.getProfile();
    this.member.getProfileAll();
    this.profileSubs = this.member.profile$.subscribe((res) => { this.profile = res; });
    //取得跑馬燈資料
    this.getBillboard();
  /**取得公告資料 */
  //  this.getAnnouncement();
  }
  /**取得跑馬燈資料 */
  private getBillboard() {
    let req = { 'uid': this.uid, 'lang': this.nowLang };
    this.api.postServer(810, req)
      .filter(apiRes => apiRes.err == true)
      .flatMap(apiRes => {
        if(this.openWindows){
          $("#body").css("overflow-y","hidden");
        }
        this.billboardSection=apiRes.ret;
        return apiRes.ret;
      })

      .subscribe({
        
        next: (msg) => {
          //串接跑馬燈字串
          this.billboard += msg['content'] + '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;';

        },
        complete: () => {
          
          //設定跑馬燈動畫
          let time = (this.billboard.length / 6).toFixed(0);
          if (Number(time) < 10) { time = '10'; }
          // if (Number(time) > 40) { time = '10'; }
          this.marqueeStyle = 'marquee ' + time + 's linear 0s infinite';
        }
      });
  }
    /**取得公告資料 */
    private getAnnouncement() {
      let req = { 'uid': this.uid, 'lang': this.nowLang };
      this.api.postServer(810, req)
        .filter(apiRes => apiRes.err == true)
        .subscribe((apiRes810) => {
          if(this.openWindows){
            $("#body").css("overflow-y","hidden");
          }
        this.billboardSection=apiRes810.ret;
      });
    }
   /**
    * 開啟iframe
    */
   GOtoken(){
    this.token = !this.token
  }
  //**快速導向下注 */
  tocheckHandicap(item, gtype) {
    this.cashPage.gomarket({ 'item': item, 'gtype': gtype });
    this.router.navigate(['market']);
  }
  //**快速導向存款 */
  go_Stored_value() {
    /**如果有token 則引導至BD系統會員中心 */
    if(sessionStorage.getItem('token_m')!='notoken'){
      this.GOtoken();
       return;
    }
    this.cashPage.go('deposit')
    this.router.navigate(['cash']);

  }
  //**快速導向取款 */
  go_Withdraw() {
    /**如果有token 則引導至BD系統會員中心 */
    if(sessionStorage.getItem('token_m')!='notoken'){
      this.GOtoken();
      return;
    }
    //console.log(this.profile.info.membanklist);
    if( this.profile.info.membanklist.length == 0){
      this.cashPage.go('card');
    }else{
      this.cashPage.go('withdraw');
    }
   
    this.router.navigate(['cash']);
  }

  /**熱門取得市場列表 */
  private getMarketHoT() {
    this.loader.displayLoader(true);
    let req180 = { 'uid': this.uid, 'gtype': this.gtype, 'lang': this.nowLang };
    let req121 = { 'uid': this.uid, 'gtype': this.gtype };

    let APIRequest180 = this.api.postServer(180, req180).filter(apiRes180 => apiRes180.err == true).subscribe((apiRes180) => {
      let ret = apiRes180.ret;
      this.leagueChart = ret['league'];
      this.teamChart = ret['team'];
      this.loader.displayLoader(false);
      let APIRequest121 = this.api.postServer(121, req121)
      .filter(apiRes121 => apiRes121.err == true)
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


          }
        });
        this.Market.receive(2,this.marketListHoT);
      });
    });
  }/**熱門取得市場列表 */
  private getMarket() {
    this.loader.displayLoader(true);

    let req120 = { 'uid': this.uid, 'gtype': this.gtype, 'lang': this.nowLang };



      this.loader.displayLoader(false);
      let APIRequest120 = this.api.postServer(120, req120)
      .filter(apiRes120 => apiRes120.err == true)
      .map((apiRes120)=>{
        let arr=[];
        apiRes120.ret.forEach(element => {
              if( !element['ctname']|| !element['htname'] || !element['lname']||
               !element['lname'] ||  
              !element['htname'] ||
              !element['ctname']){
   
              console.log(element);
            }else{
              arr.push(element);
            }
        });
        apiRes120.ret = arr;
        return apiRes120;
      }).subscribe((apiRes120) => {
        this.marketList = apiRes120.ret;

        let hot =[];
        Observable.from( this.marketList).subscribe({
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
            let lc = item['lname'];
            let hc = item['htname'];
            let cc = item['ctname'];
            if (lc) { item['lid'] = lc }
            if (hc) { item['ht'] = hc }
            if (cc) { item['ct'] = cc }
            if(item.hot == 'Y'){
              hot.push(item);
            }
          }
        });
        this.marketListHoT = hot;
        this.Today = this.TimeClassification(this.marketList,0);
        this.Tomorrow = this.TimeClassification(this.marketList,1);
        this.Market.receive(1,this.marketList);
        this.Market.receive(2,this.marketListHoT);
      });

  }
  /**
   * 時間分類
   */
  TimeClassification(value: any, data: any){
    let conditionData = this.GetDateStr(data);
        let arr = [];
        if(value){
            value.forEach(element => {
                if (element.date == conditionData) {
                    arr.push(element);
                }
            });
        }
        return arr.length;
  }

  /**?公告提醒是否關閉 */
  announcementRemind(_reminds){
  
      localStorage.setItem('remind', _reminds);
     // sessionStorage.setItem('remind', this.remind);
        console.log(_reminds);
      
  }
  /**優惠活動 */
  Promotions(){
    // this.Discount = !this.Discount;
  //  alert('敬启期待');
   this.router.navigate(['activity']);
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
 * 熱門 今日 明日 切換
 * @param _s true 熱門 false 日期
 * @param _d 今日:0 明日:1  全部:-1
 */
  ListStatus(_s, _d) {
    this.Popular_events = _s;
    this.ListDate = _d;
  }
  /**
   * 切換訊息視窗
   */
  SwitchMsg() {
    this.openWindows = !this.openWindows;
    if(!this.openWindows){
      $("#body").css("overflow-y","auto");
    }
    let data = sessionStorage.getItem('open');
    let Cumulative =Number(data)+1;
    sessionStorage.setItem('open', Cumulative.toString());
  }
  
  /**切換熱門賽事 */
  SwitchHot(_m){
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
   * 跳轉頁面
   * @param 要跳轉的頁面
   */
  changePage(pageName: string[]) {
    /**如果有token 則引導至BD系統會員中心 */
    if(sessionStorage.getItem('token_m')!='notoken' && pageName[0]=="cash"){
      this.state =false;
      this.GOtoken();
      return;
    }
    this.router.navigate(pageName);
  }
  /**
 * 獲的日期 YYYY-MM-DD
 * @param AddDayCount  0= 今天 -1 = 昨天 1 = 明天
 */
  GetDateStr(AddDayCount) {

    let dd = new Date();

    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期

    let y = dd.getFullYear();

    let m: any = dd.getMonth() + 1;//获取当前月份的日期

    if (m.toString().length <= 1) {
      m = '0' + m.toString();
    }

    let d: any = dd.getDate();
    if (d.toString().length <= 1) {
      d = '0' + d.toString();
    }
    return y + "-" + m + "-" + d;

  }
  // AddToHome(){
  //   if(this.Addtohome){
  //     this.deferredPrompt.prompt();
  //     // Wait for the user to respond to the prompt
  //     this.deferredPrompt.userChoice.then((choiceResult) => {
  //         if (choiceResult.outcome === 'accepted') {
  //           console.log('User accepted the A2HS prompt');
  //         } else {
  //           console.log('User dismissed the A2HS prompt');
  //         }
  //         this.deferredPrompt = null;
  //       });
  //   }
  // }
  // onbeforeinstallprompt(e) {
  //   console.log(e);
  //   // Prevent Chrome 67 and earlier from automatically showing the prompt
  //   e.preventDefault();
  //   // Stash the event so it can be triggered later.
  //   this.Addtohome = true;
  //   this.deferredPrompt = e;
  //   console.log(this.Addtohome);
  // }
  ngOnDestroy() {
    this.loader.displayLoader(false);

  }
}
