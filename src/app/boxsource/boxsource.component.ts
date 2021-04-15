//Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
//Service
import { ApiService, LanguageService, LoadingService, MemberService } from 'service';
//RxJS
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/zip';
//Others
import { host } from 'lib/config';
import { getToday } from 'lib/functions';

@Component({
    templateUrl: 'boxsource.component.html',
    styleUrls: ['boxsource.component.scss'],
    animations: [
        trigger('goleft', [
            state('void', style({ transform: 'translateX(110%)' })),
            state('*', style({ transform: 'translateX(0)' })),
            transition('* => *', animate('300ms ease-in-out'))
        ])
    ]
})

export class BoxSourceComponent implements OnInit, OnDestroy {
    constructor(
        private api    : ApiService,
        private member : MemberService,
        private loader : LoadingService,
        public lang    : LanguageService,
        public location: Location
    ) {}
    //-----------------------------------------------//
    /**使用者憑證 uid ts*/
    private uid: string = this.member.uid;
    /**語系 ts*/
    private nowLang: string = this.lang.nowLang;
    /**球種 ts*/
    private gtype: string = host.ballType;
    //-----------------------------------------------//
    /**input 查詢日期(預設今天) ts html*/
    date: string = getToday();
    /**賽事結果 ts html*/
    boxSource: Array<any>;
    /**是否有賽事結果 ts html*/
    boxSourceLength: number;
    //-----------------------------------------------//
    /**被選擇到的賽事 開關(預設第一筆打開) html*/
    selectBtn: number = 0;
    //-----------------------------------------------//
    /**分類視窗狀態 ts html*/
    dialogStatus: boolean = false;
    /**聯盟分類清單 ts html*/
    leagueList: Array<object>;
    /**聯盟分類根據 */
    leagueSortDis: any;

    ngOnInit() {
        this.getBoxSource(this.date);
    }
    ngOnDestroy() {
        this.loader.displayLoader(false);
    }

    getBoxSource(date) {
        this.loader.displayLoader(true);
        let leagueList = [];
        let req = { 'uid': this.uid, 'date': date, 'gtype': this.gtype, 'lang': this.nowLang };
        this.api.postServer(680, req)
            .filter(apiRes => {
                this.loader.displayLoader(false);
                return apiRes.err == true;
            })
            .flatMap(apiRes => {
                this.boxSource = apiRes.ret;
                this.boxSourceLength = this.boxSource.length;
                return this.boxSource;
            })
            .filter(item => item['lname'] != '')
            .subscribe({
                next: (item) => {
                    leagueList.push(item['lname']);
                    if(item['PD'] == '-1--1' || item['PDHR']== '-1--1'  ) {
                        item['am']=  this.lang.languageChart['賽事取消'];
                        item['PD'] =  this.lang.languageChart['賽事取消'];
                        item['PDHR'] =  this.lang.languageChart['賽事取消'];
                    }
                    if(item['PD'] == '-2--2' || item['PDHR']== '-2--2'  ) {
                        item['am']= this.lang.languageChart['待定'];
                        item['PD'] = this.lang.languageChart['待定'];
                        item['PDHR'] = this.lang.languageChart['待定'];
                    }
                },
                complete: () => {
                    this.leagueList = this.countList(leagueList);
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
                    if(typeof obj[item] === 'undefined') {
                        //對 obj 加入值，並給數量
                        obj[item] = 1;
                    }else {
                        obj[item]++;
                    }
                },
                complete: () => {
                    //編譯成需要的陣列格式 [{ 'item': 聯盟, 'count': 次數 }]
                    let item  = Observable.from(Object.keys(obj));
                    let count = Observable.from(Object.values(obj));
                    item.zip(count, (x,y) => {
                        newArr.push( {'item': x, 'count': y} );
                    }).subscribe();
                }
            });
        return newArr;
    }

}