//Angular
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
//Service
import { ApiService, LanguageService, LoadingService } from 'service';


@Component({
    templateUrl: 'addhome.component.html',
    styleUrls: ['addhome.component.scss']
})

export class AddhomeComponent implements OnInit {

    constructor(
        public lang: LanguageService,
        public location: Location,
        private loader: LoadingService
    ) {}
    nowLang: string = this.lang.nowLang;
    subPage: string = 'ios';
    ngOnInit() {
    
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////


@Component({ selector: 'addhome-i', templateUrl: 'addhome-i.component.html', styleUrls: ['addhome-sub.component.scss'] })
export class AddhomeIComponent  {
    constructor(
        public lang: LanguageService,
        public location: Location,
        private loader: LoadingService
    ) {}
}
@Component({ selector: 'addhome-a', templateUrl: 'addhome-a.component.html', styleUrls: ['addhome-sub.component.scss'] })
export class AddhomeAomponent  {
    constructor(
        public lang: LanguageService,
        public location: Location,
        private loader: LoadingService
    ) {}
}