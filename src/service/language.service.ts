//Augular
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
//lib
import { host, storageMode } from 'lib/config';
import { getURLParamet } from "lib/functions";

@Injectable()

export class LanguageService {
    constructor(private http: Http) { this.determine(); }
    /**系統語系 for Pipes*/
    languageChart: string;
    /**系統語系 for Component */
    nowLang: string;

    /**
     * 預先判定作業
     */
    private determine() {
        let lang;
        //判斷儲存作業使用 Storage 或 URL
        if(storageMode) { lang = sessionStorage.getItem('lang'); }
        else            { lang = getURLParamet('lang');          }

        //沒有儲存語系，就使用系統預設
        if(!lang) {
            this.nowLang = host.lang;
            this.getlanguageChart(this.nowLang);
        }else {
            this.nowLang = lang;
            this.getlanguageChart(this.nowLang);
        }
    }

    /**
     * 取得語系文件
     * @param lang 語系
     */
    private getlanguageChart(lang) {
        switch (lang) {
            case 'zh-tw':
                this.http.get('./file/zh-tw.json')
                .map(item => item.json()).subscribe((res) => {
                    this.languageChart = res;
                })
                break;
            case 'zh-cn':
                this.http.get('./file/zh-cn.json')
                .map(item => item.json()).subscribe((res) => {
                    this.languageChart = res;
                })
                break;
            case 'en-us':
                this.http.get('./file/en-us.json')
                .map(item => item.json()).subscribe((res) => {
                    this.languageChart = res;
                })
                break;
            case 'th':
                this.http.get('./file/th.json')
                .map(item => item.json()).subscribe((res) => {
                    this.languageChart = res;
                })
                break;
            default:
                break;
        }
    }


}