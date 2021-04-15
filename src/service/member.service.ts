//Angular
import { Injectable } from '@angular/core';
//Service
import { ApiService } from 'service';
//RxJS
import { BehaviorSubject } from "rxjs/BehaviorSubject";
//Others
import { storageMode } from 'lib/config';
import { Profile } from 'lib/IResponse';
import { getURLParamet } from "lib/functions";


@Injectable()
/**會員資料管理服務 */
export class MemberService {
    /**使用者憑證 自用 外接*/
    uid: string;
    constructor(private api: ApiService) {
        if (storageMode) {
            this.uid = sessionStorage.getItem('uid');
        } else {
            this.uid = getURLParamet('p');
        }
    }

    /**會員資料 Subject ts*/
    private profileSubj = new BehaviorSubject({});
    /**會員資料 Observable 外接監聽*/
    profile$ = this.profileSubj.asObservable();
    /**會員資料 外接*/
    profile: any = {
        'username': '',
        'surplus': '',
        'today_credit': '',
        'today_count': '',
        'info': {
            'goldset': '',
            'email': '',
            'phone': '',
            'QQ': '',
            'WeChat': '',
            'plink': '',
            'membanklist': [],
            'depositbankinfo': []
        }
    };


    /**更新會員資料(所有) 960*/
    getProfileAll() {
        let req = { 'uid': this.uid };
        this.api.postServer(960, req)
           // .filter(apiRes => apiRes.err == true)
            .subscribe(apiRes => {
                console.log(apiRes);
                if(!apiRes.err){
                    setTimeout(() => {
                        this.getProfileAll();
                      }, 200);
                      return;
                }
                if(apiRes.ret.surplus < 0){
                    setTimeout(() => {
                        this.getProfileAll();
                      }, 200);
                      return;
                }
                this.profile = apiRes.ret;
                this.profileSubj.next(this.profile);
            });
    }

    /**更新會員資料(金額) 965*/
    getProfile() {
        let req = { 'uid': this.uid };
        this.api.postServer(965, req)
            .filter(apiRes => apiRes.err == true)
            .subscribe((apiRes) => {
                let ret = apiRes.ret;
                this.profile['username'] = ret['username'];
                this.profile['surplus'] = ret['surplus'];
                //未讀訊息
                this.profile['helpcount'] = ret['helpcount'];
                this.profile['credit'] = ret['credit'];
                this.profile['count'] = ret['count'];
                this.profileSubj.next(this.profile);
            });
    }
}



@Injectable()
/**會員資料管理服務 */
export class footerService {
    /**使用者憑證 自用 外接*/

    constructor(private api: ApiService) {

    }

    /**會員資料 Subject ts*/
    private profileSubj = new BehaviorSubject({});
    /**會員資料 Observable 外接監聽*/
    
    menu$ = this.profileSubj.asObservable();
 
    menu: any = {
        open:false,
    };
    getopen(_v = ''){
        if(_v == 'closed'){
            this.menu.open =false;
            return;
        }
        this.menu.open = !this.menu.open ;
    }
}