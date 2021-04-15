//Angular
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
//Service
import { ApiService, MemberService, LanguageService } from "service";
//RxJS
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import 'rxjs/add/operator/filter';
import { Router } from '@angular/router';
@Component({
    selector: 'b-record',
    templateUrl: 'b-record.component.html',
    styleUrls: ['b-record.component.scss']
})

export class BattleRecordComponent implements OnInit {
    constructor(
        private api   : ApiService,
        private member: MemberService,
        public lang  : LanguageService,
        public router: Router,
    ) { }
    //-----------------------------------------------//
    /**自 HandicapComponent 的對戰紀錄資料 */
    @Input() recordFile;
    /**通知 HandicapComponent */
    @Output() callHandicap = new EventEmitter();
    //-----------------------------------------------//
    private uid: string = this.member.uid;
    private nowLang: string = this.lang.nowLang;
    //-----------------------------------------------//
    private dialogDOMSubs: Subscription;

    ngOnInit() {
        this.DialogDOM();
    }

    ngOnDestroy() {
        this.dialogDOMSubs.unsubscribe();
    }


    /**點擊黑色半透明區塊，關閉本元件*/
    private DialogDOM() {
        const dialogDOM = document.getElementsByClassName('modal');
        const touchEnd = Observable.fromEvent(dialogDOM, 'touchend');
        this.dialogDOMSubs = touchEnd.filter(event =>  event['target']['className'] === 'modal' )
                                    .subscribe((a) => {
                                        this.callHandicap.emit('closeDialog');
                                    });
    }
    closeDialog() {
        this.callHandicap.emit('closeDialog');
    }
}