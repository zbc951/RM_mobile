//Angular
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
//Service
import { ApiService, MemberService, LanguageService } from 'service';
import { CashPageService } from './cash-page.service';
//RxJS
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Component({
  templateUrl: 'cash.component.html',
  styleUrls: ['cash.component.scss'],
  animations: [
    trigger('subMain', [
      state('*', style({ transform: 'translateX(0)' })),
      state('void', style({ transform: 'translateX(100%)' })),
      transition('* => *', animate('350ms ease-in-out'))
    ]),
  ]
})
export class CashComponent implements OnInit, OnDestroy {
  constructor(
    private api: ApiService,
    private member: MemberService,
    public lang: LanguageService,
    public cashPage: CashPageService
  ) { }


  /**使用者憑證 uid ts*/
  private uid: string = this.member.uid;

  /**會員資料 訂閱*/
  private profileSubs: Subscription;
  /**會員資料 ts html*/
  profile: any = {};
  /**交易紀錄 for RecordComponent 預先抓，使畫面流暢*/
  record: any = { 'list': [] };
  /**交易狀態對照 ts*/
  private type = { '0': '櫃員機轉帳', '1': '網銀轉帳', '2': '手機銀行轉帳', '3': '現金櫃台轉帳' };


  ngOnInit() {
    this.member.getProfileAll();
    //取得並監聽會員資料
    this.profileSubs = this.member.profile$.subscribe((res) => { this.profile = res; });
    //預先取得交易紀錄
    this.getRecord(1);
  }
  ngOnDestroy() {
    this.profileSubs.unsubscribe();
  }

  getRecord(page: number) {
    let req = { 'uid': this.uid, 'page': page };
    this.api.postServer(780, req).subscribe(apiRes => {
      if (!apiRes.err) { return; }
      this.record = apiRes.ret;
      //交易狀態名稱對照
      if (this.record.list) {
        Observable.from(this.record.list)
          .map(i => { i['type'] = this.type[i['type']] })
          .subscribe();
      }

    })
  }
  checkingWithdraw(){

    if( this.profile.info.membanklist.length == 0){
      this.cashPage.go('card');
    }else{
      this.cashPage.go('withdraw');
    }
  }
  /**活動 */
  activity(){
    alert(this.lang.languageChart['敬啟期待']);
  }
}
