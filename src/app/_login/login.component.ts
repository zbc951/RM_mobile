//Augular
import { Component, OnInit ,ViewChild ,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
//Service
import { ApiService, LanguageService, LoadingService } from 'service';
//lib
import { host, storageMode, p_id ,c_url} from 'lib/config';
import { containsTree } from '@angular/router/src/url_tree';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent {
    constructor(
        private router: Router,
        private api: ApiService,
        private loader: LoadingService,
        public lang: LanguageService,
    ) { }
    @ViewChild('mainScreen') elementView: ElementRef;
    viewWidth: number;
    x: number = 0;
    startX: number = 0;
    /**input 帳號 ts html*/
    un: string = '';
    /**input 密碼 ts html*/
    pw: string = '';
    /**input 記住帳密  ts html*/
    rem: boolean = false;
    /**若為 storageMode 開啟記住密碼 */
    rememberForm: boolean = storageMode;

    loading: boolean = false;
    widthExp: number = 25;
    Lbutton: boolean = false;
    textSession:string='';
    P_ID=p_id;
    ngOnInit() {
       
        if(!sessionStorage){
            this.textSession ='(login)';
            console.log( this.textSession);
        }
        //查看是否已記住帳密，有就自動記住
        if (storageMode && localStorage.getItem('id') && localStorage.getItem('pwd')) {
            this.un = localStorage.getItem('id');
            this.pw = localStorage.getItem('pwd');
            this.rem = true;
        }
     this.clickMe();
    }

    /**
     * 登入
     */
    login() {
        if (this.un.trim() == "" || this.pw.trim() == "") { alert(this.lang.languageChart['請輸入完整的帳號密碼']);this.widthExp = 25; return; }

        this.loader.displayLoader(true);
        this.loading = true;
        this.remember();    //storageMode 才會執行

        let req = { 'un': this.un, 'pw': this.pw };
        this.api.postServer(999, req)
            .filter(apiRes => {
                if(apiRes.err == false){
                    this.loader.displayLoader(false);
                    this.loading = false;
                    this.widthExp = 25;
                }

                return apiRes.err == true

            })
            .subscribe(apiRes => {

                let ret = apiRes.ret;
                if (storageMode) {
                    if(sessionStorage){
                        sessionStorage.setItem('uid', ret['uid']);
                        sessionStorage.setItem('token', ret['token_m']);
                        location.href = '';
                    }else{
                        location.href = '?lang=' + this.lang.nowLang + '&p=' + ret['uid'];
                    }
                   
                } else {
                    location.href = '?lang=' + this.lang.nowLang + '&p=' + ret['uid'];
                }

                sessionStorage.setItem('open', '1');
            });
    }
    SwitchLogin(){

    }
    openCS(){
        window.open(c_url);
    }
    /**起始 */
    onPanStart(event: any): void {
        this.startX = event.deltaX;
        console.log(event.deltaX,'<<');
      }
    /**拖移 */
      onPan(event: any): void {
        event.preventDefault();
        if( this.loading){return;}
        let x=  event.deltaX - this.startX  
        if(x <0 ){
            this.widthExp = 25;
        }else{
            if((25+(x/(this.viewWidth/2) ) *50) >75){
                this.widthExp = 75
                this.login();
                return;
            }
            this.widthExp =  25+(x/(this.viewWidth/2) ) *50;

        }
        console.log( this.widthExp);
      }
      clickMe(){
        this.viewWidth = this.elementView.nativeElement.offsetWidth;
        console.log(this.elementView.nativeElement.offsetWidth );
      }

    /**記住帳密 */
    private remember() {
        if (this.rem) {
            localStorage.setItem('id', this.un);
            localStorage.setItem('pwd', this.pw);
        } else {
            localStorage.setItem('id', '');
            localStorage.setItem('pwd','');
          //  localStorage.clear();
        }
    }

    /**
     * 變更語系
     * @param lang 語系名稱
     */
    changeLanguage(lang) {
        //判斷儲存作業使用 Storage 或 URL
        if (storageMode) {
            sessionStorage.setItem("lang", lang);
            //使 LanguageService 重新載入，能夠依 sessionStorage 載到新的語言包
            location.reload();
        } else {
            //設定 Url 並 重新載入
            location.href = '?lang=' + lang;
        }
    }

    /**清除暫存 */
    clearTemporary() {
        localStorage.clear();
        sessionStorage.clear();
        location.reload();
    }
    /**點擊註冊按鈕 */
    register() {
        window.open(
            host.registUrl +
            '?s=k120sfaaof9487kofae86sogood',
            '_blank', 'location = yes, fullscreen = yes, status = yes'
        );
    }

    showChatlink(){
        window.open('/app2/chatlink.html');
    }
}