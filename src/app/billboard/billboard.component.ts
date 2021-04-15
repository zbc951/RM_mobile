//Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
//Service
import { ApiService, LanguageService, LoadingService, MemberService } from 'service';
//Others
import { host } from 'lib/config';

@Component({
    templateUrl: 'billboard.component.html',
	styleUrls: ['billboard.component.scss']
})
export class BillboardComponent implements OnInit, OnDestroy {
    constructor(
        private api    : ApiService,
        private loader : LoadingService,
        private member : MemberService,
        public lang    : LanguageService,
        public location: Location
    ) {}
    //-----------------------------------------------//
    /**使用者憑證 uid ts*/
    private uid: string = this.member.uid;
    /**語系 ts*/
    private nowLang: string = this.lang.nowLang;
    //-----------------------------------------------//
    /**公告內容 ts html*/
    billboard: Array<any>;

    Expand:string = '';

    ngOnInit() {
        this.loader.displayLoader(true);
        let req = { 'uid': this.uid, 'lang': this.nowLang };
        this.api.postServer(810, req).subscribe((apiRes) => {
            this.billboard = apiRes.ret;
            this.loader.displayLoader(false);
        });
    }
    ngOnDestroy() {
        this.loader.displayLoader(false);
    }
    openbillboard(_category){
        this.Expand = _category;
        if(_category != 'board'){
            alert(this.lang.languageChart['近期開放']);
        }
    }
}