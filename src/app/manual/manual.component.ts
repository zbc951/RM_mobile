//Angular
import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
//Service
import { LanguageService } from "service";


@Component({
    templateUrl: 'manual.component.html',
    styleUrls: ['manual.component.scss']
})
export class ManualComponent  {
    constructor(
        public lang: LanguageService,
        public location: Location
    ) {}
    nowLang: string = this.lang.nowLang;
    subPage: string = 'rules';
}

/////////////////////////////////////////////////////////////////////////////////////////////

@Component({ selector: 'manual-tw', templateUrl: 'manual-tw.component.html', styleUrls: ['manual-sub.component.scss'] })
export class ManualTWComponent  {
    @Input() page: string;
}
//----------------//

@Component({ selector: 'manual-cn', templateUrl: 'manual-cn.component.html', styleUrls: ['manual-sub.component.scss'] })
export class ManualCNComponent  {
    @Input() page: string;
}
//----------------//
@Component({ selector: 'manual-en', templateUrl: 'manual-en.component.html', styleUrls: ['manual-sub.component.scss'] })
export class ManualENComponent  {
    @Input() page: string;
}
