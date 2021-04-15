//Angular
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
//Service
import { LanguageService } from "service";


@Component({
    templateUrl: 'activity.component.html',
    styleUrls: ['activity.component.scss']
})

export class ActivityComponent implements OnInit {

    constructor(
        public lang: LanguageService,
        public location: Location
    ) {}
    open: any =[false,false,false,false,false,false,false ];
    ngOnInit() {
    
    }
}

