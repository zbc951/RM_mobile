//Angular
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
//Service
import { MemberService, LanguageService } from 'service';
//RxJS
import { Subscription } from "rxjs/Subscription";


@Component({
    templateUrl: 'promote.component.html',
    styleUrls: ['promote.component.scss']
})
export class PromoteComponent implements OnInit {
    constructor(
        private member: MemberService,
        public location: Location,
        public lang: LanguageService
    ) {}
    //-----------------------------------------------//
    /**會員資料 訂閱*/
    private profileSubs: Subscription;
    //-----------------------------------------------//
    /**推廣連結(來自960 會員資料) */
    memberLink: any = '';

    ngOnInit() {
        this.member.getProfileAll();
        this.profileSubs = this.member.profile$.subscribe((res) => {
            this.memberLink = res['info']['plink'];
        });
    }
    ngOnDestroy() {
        this.profileSubs.unsubscribe();
    }
}