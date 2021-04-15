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
import { ActivatedRoute ,Router} from '@angular/router';
@Component({
    templateUrl: 'BattleRecord.component.html',
    styleUrls: ['BattleRecord.component.scss']

})

export class HistoricalBattleRecordComponent implements OnInit, OnDestroy {
    constructor(
        private api    : ApiService,
        private member : MemberService,
        private loader : LoadingService,
        public lang    : LanguageService,
        public location: Location,
        public route:ActivatedRoute,
        public router: Router,
    ) {}
    //-----------------------------------------------//
    /**使用者憑證 uid ts*/
    private uid: string = this.member.uid;
    /**語系 ts*/
    private nowLang: string = this.lang.nowLang;
    /**球種 ts*/
    private gtype: string = host.ballType;
    //-----------------------------------------------//
       /**對戰紀錄資料 ts html*/
       recordFile: Array<object>;

        id:any=0;
    ngOnInit() {
       console.log(this.route.snapshot.paramMap.get('id'));
      
       if(!this.route.snapshot.paramMap.get('id')){
            alert(this.lang.languageChart['錯誤路由進入']);
            this.router.navigate(['homepage']);
       }
       this.id=this.route.snapshot.paramMap.get('id');
       this.getNewRecord(this.route.snapshot.paramMap.get('id'));
    }
    getNewRecord(_id) {
        this.loader.displayLoader(true);
        let req = { 'uid': this.uid, 'lang': this.nowLang,  'gid': _id };
        this.api.postServer(770, req)
            .filter(apiRes => apiRes.err == true).subscribe(apiRes => {
                this.loader.displayLoader(false);
                if(apiRes.ret.length == 0){
                    alert(this.lang.languageChart['目前無對戰紀錄']);
                    this.router.navigate(['homepage']);
                    return
                }
                this.recordFile = apiRes.ret;
               console.log(apiRes);
            });
    }
    ngOnDestroy() {
        this.loader.displayLoader(false);
    }


}