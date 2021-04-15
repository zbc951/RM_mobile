//Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
//Service
import { ApiService, MemberService, LanguageService } from 'service';
//RxJS
import { Subscription } from "rxjs/Subscription";


@Component({
    templateUrl: 'modify.component.html',
    styleUrls: ['modify.component.scss']
})
export class ModifyComponent implements OnInit, OnDestroy {
    constructor(
        private api: ApiService,
        private member: MemberService,
        public location: Location,
        public lang: LanguageService
    ) { }
    //-----------------------------------------------//
    /**使用者憑證 uid ts*/
    private uid: string = this.member.uid;
    //-----------------------------------------------//
    /**會員資料 訂閱*/
    private profileSubs: Subscription;
    /**input 會員資料 ts html*/
    profile: any = { 'email': '', 'phone': '', 'QQ': '', 'WeChat': '' };
    /**手機驗證訊息 */
    phoneVerificationMsg: string;
    //-----------------------------------------------//
    /**input 舊密碼 ts html*/
    oldPwd: string;
    /**input 新密碼 ts html*/
    newPwd: string;
    /**input 確認密碼 ts html*/
    confirmPwd: string;

    username:string ='';
    ngOnInit() {
        //取得會員資料(其他資訊)
        this.member.getProfileAll();
        this.profileSubs = this.member.profile$.subscribe((res) => {
            console.log(res);
            this.username = res['username'];
            if (res['info'] != undefined) { this.profile = res['info']; }

            switch (this.profile.phoneVerification) {
                case '0': case '2':
                    this.phoneVerificationMsg = '验证手机';
                    break;
                case '1':
                    this.phoneVerificationMsg = '已验证';
                    break;
                default:
                    break;
            }
        });
    }

    ngOnDestroy() {
        this.profileSubs.unsubscribe();
    }

    /**更改會員資訊 */
    infoModify() {
        let req = {
            'uid': this.uid,
            'email': this.profile['email'],
            'phone': this.profile['phone'],
            'QQ': this.profile['QQ'],
            'WeChat': this.profile['WeChat']
        };
        this.api.postServer(925, req).subscribe(apiRes => {
            if (apiRes.err === true) { alert(this.lang.languageChart['聯絡方式更改成功']); }
        });
    }

    /**更改密碼 */
    infoPassword(oldPwd, newPwd, confirmPwd) {
        if (newPwd !== confirmPwd) { alert(this.lang.languageChart['確認密碼與新密碼不符']); return; }
        let req = { 'uid': this.uid, 'opw': oldPwd, 'npw': newPwd };
        this.api.postServer(920, req).subscribe(apiRes => {
            if (apiRes.err === true) {
                alert(this.lang.languageChart['密碼更改成功，請重新登入']);
                sessionStorage.clear();
                location.reload();
            }
        });
    }
    /**手機驗證 */
    // verifyPhone() {
    //     const req = { 'uid': this.uid, 'phone': this.profile['phone'] };
    //     this.api.postServer(915, req).map(apiRes => apiRes.ret).subscribe(res => {
    //         if (res === 'SUCCESS') {
    //             alert('贵宾您好，系统已将验证码讯息传送至您的手机，请贵宾收到验证码后，发送至<YUN-FU官方微信号>，将有专员为您服务。');
    //             this.member.getProfileAll();
    //         }
    //     });
    // }
}