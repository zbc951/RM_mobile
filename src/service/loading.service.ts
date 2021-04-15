import { Injectable } from '@angular/core';
// import { BehaviorSubject } from "rxjs";
@Injectable()
export class LoadingService {
    constructor() { }
    /**loading 畫面狀態 外接*/
    loaderStatus: boolean = false;
    /**
     * loading 畫面設定 外接
     * @param value 狀態
     */
    displayLoader(value: boolean) {
        this.loaderStatus = value;
    }
}