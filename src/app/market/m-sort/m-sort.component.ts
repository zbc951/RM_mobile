//Angular
import { Component, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
//Service
import { LanguageService } from 'service';
//RxJS
import { Observable } from "rxjs/Observable";


@Component({
    selector: 'm-sort',
    templateUrl: 'm-sort.component.html',
    animations: [
        trigger('dialog', [
            state('out', style({ transform: 'translateX(110%)' })),
            state('stay', style({ transform: 'translateX(0)' })),
            transition('out <=> stay', animate('300ms ease-in-out'))
        ])
    ]
})
export class MarketSortComponent {
    constructor(public lang: LanguageService) {}
    @Output() sortEmitter = new EventEmitter();
/**送收尋字串 */
    @Output() sendSearch = new EventEmitter();
    //-----------------------------------------------//
    /**動畫狀態 ts html*/
    state: string = 'out';
    //-----------------------------------------------//
    /**市場列表日期(分類用) */
    dateSortList: Array<string>;
    /**市場列表聯盟(分類用) */
    leagueSortList: Array<string>;
    //-----------------------------------------------//
    sortSelect: string = 'all';
    addTeam: string = '';

    /**
     * 通知 MarketComponent 執行分類
     * @param basis 分類根據
     */
    sortMarket(basis) {
        //通知 MarketComponent 執行 sortDisplay()
        this.sortEmitter.emit(basis);
        //隱藏 MarketSortComponent
        this.state = 'out';
    }
    /**發送條件 */
    DeliveryConditions(){
        if(this.addTeam ){
            this.sendSearch.emit(this.addTeam );
        }
        this.addTeam ='';  
        this.state = 'out';
    }
    
    /**
     * 計算陣列元素的重複次數，並編輯格式
     * @param arr 陣列
     */
    countList(arr: Array<any>) {
        let obj = {};
        let newArr = [];

        //計算陣列元素的重複次數
        Observable.from(arr)
            .subscribe({
                next: (item) => {
                    if(typeof obj[item] === 'undefined') {
                        //對 obj 加入值，並給數量
                        obj[item] = 1;
                    }else {
                        obj[item]++;
                    }
                },
                complete: () => {
                    //編譯成需要的陣列格式 [{ 'item': 聯盟, 'count': 次數 }]
                    let item  = Observable.from(Object.keys(obj));
                    let count = Observable.from(Object.values(obj));
                    item.zip(count, (x,y) => {
                        newArr.push( {'item': x, 'count': y} );
                    }).subscribe();
                }
            });
        return newArr;
    }

}