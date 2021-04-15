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
    templateUrl: 'HelpCenter.component.html',
    styleUrls: ['HelpCenter.component.scss']

})

export class HelpCenterComponent implements OnInit, OnDestroy {
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

    status: any='';
    ngOnInit() {
       
    }
    ngOnDestroy() {
        this.loader.displayLoader(false);
    }


}