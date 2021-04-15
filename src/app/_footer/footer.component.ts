//Angular
import { Component, OnInit, Input , ChangeDetectorRef ,HostListener ,Inject} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
//Service
import { LanguageService, MemberService ,footerService} from 'service';
import { DOCUMENT } from '@angular/platform-browser';
@Component({
    selector: 'footer-toolbar',
    templateUrl: 'footer.component.html',
    animations: [
      trigger('active', [
        state('true' , style({ transform: 'translateY(0%)'})),
        state('false', style({ transform: 'translateY(100%)'})),
        transition('true <=>false', animate('300ms ease-in-out'))
      ])
    ]
})
export class FooterComponent implements OnInit{
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public lang: LanguageService,
        public member: MemberService,
        public footer: footerService,
        private cdRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private document: Document,
    ) {}



    /**自 MarketComponent 的動畫狀態 ts html*/
    @Input() status: boolean;
    activeCSS: string;

    footer_out = true; 
    /**
     * 路由位子
     */
    router_seat: string = this.router.url.substr(1);
    scrollTop =0;
    timeout : any;
    @HostListener('window:scroll', [])
    onWindowScroll() {


        this.footer_out = false;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.footer_out = true;
        }, 300);
        // let offset  =   this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
        // if(offset <0 ){offset =0; }
        // if(offset > this.scrollTop){
        //     this.footer_out = false;
        //     }else{
        //     this.footer_out = true;
        // }
        // this.scrollTop = offset;
     }
    ngOnInit() {
        //正在開啟的 component 顯示 active
        switch (this.activatedRoute['component']['name']) {
            case 'HomepageComponent':
                this.activeCSS = 'HomepageComponent';
                break;
            case 'FeedbackComponent':
                this.activeCSS = 'FeebackComponent';
                break;
            case 'MarketComponent':
                this.activeCSS = 'MarketComponent';
                break;
            case 'DetailComponent':
                this.activeCSS = 'DetailComponent';
                break;
            case 'HistoryComponent':
                this.activeCSS = 'HistoryComponent';
                break;
            default:
                this.activeCSS = 'OptionsComponent';
                break;
                
        }
    }

    /**
     * 跳轉頁面
     * @param 要跳轉的頁面
     */
    changePage(pageName: string[]) {
        this.router.navigate(pageName);
    }

    /**
     * 開啟及時比分網
     */
    openWebPage() {
        let select = confirm(this.lang.languageChart['瀏覽器將從新頁面開啟即時比分網']);
        if(select) {
            window.open(
                'http://m.7m.com.cn/live/',
                '_blank', 'location = yes, fullscreen = yes, status = yes'
            );
        }
    }
    Zoom(){
        this.footer_out = !this.footer_out
        this.cdRef.markForCheck();
    }

}
