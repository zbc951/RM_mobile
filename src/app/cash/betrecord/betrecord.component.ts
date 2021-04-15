//Angular
import { Component, Input } from '@angular/core';
//Service
import { ApiService, LanguageService, LoadingService, MemberService } from "service";
//RxJS
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import { CashPageService } from '../cash-page.service';
@Component({
    selector: 'betrecord',
    templateUrl: 'betrecord.component.html',
    styleUrls: ['betrecord.component.scss']
})
export class betRecordComponent  {
    constructor(
        private api: ApiService,
        private member: MemberService,
        private loader: LoadingService,
        public lang: LanguageService,
        public cashPage: CashPageService
    ) {}
    //-----------------------------------------------//
    /**使用者憑證 uid ts*/
    private uid: string = this.member.uid;
    //-----------------------------------------------//

    record: any ;


    ngOnInit() {
        this.getRecord();
        
    }
    getRecord() {
        let req = { 'uid': this.uid ,'web': 'y'};
        this.api.postServer(961, req).subscribe(apiRes => {
          if (!apiRes.err) { return; }
          this.record = apiRes.ret;
    
        })
      }
    ngOnDestroy() {
        this.loader.displayLoader(false);
    }


}