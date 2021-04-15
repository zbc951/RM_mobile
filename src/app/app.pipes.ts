import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/toArray';
import { CommentStmt } from '@angular/compiler';
import { containsTree } from '@angular/router/src/url_tree';

@Pipe({ name: 'langChart' })
export class langChartPipe implements PipeTransform {
    /**
     * 語系轉換
     * @param value      待被轉換的字
     * @param langChart  語言包
     */
    transform(value: string, langChart: string) {
        if (!langChart || !langChart[value]) { return value; }
        return langChart[value];
    }
}

@Pipe({ name: 'formatNumber' })
export class formatNumberPipe implements PipeTransform {
    /**
     * 數字轉換: 四捨五入小數兩位、三位一撇
     * @param value  待被轉換的值
     */
    transform(value: any): string | number {
        //若為 0 或不存在，不做執行
        if (!value) { return 0; }
        //若為小數，執行 四捨五入小數兩位、三位一撇
        if (value.toString().indexOf('.') > -1) {
            return Number(value).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        }
        //非則只執行三位一撇
        else {
            return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
        }
    }
}


@Pipe({ name: 'sortMarketList' })
export class sortMarketListPipe implements PipeTransform {
    /**
     * 市場列表賽事分類、比賽結果聯盟分類
     * @param value 待被轉換的 所有賽事
     * @param key   比對的屬性名稱
     * @param vol   比對的根據值
     */
    transform(value: any, key: string, vol: string): any {
        if (!vol) { return value; }
        if(vol == "-1" ){return value; }
        let res = value.filter((item) => {
            return item[key] == vol;
        });
        return res;
    }
}

@Pipe({ name: 'sortDetailList' })
export class sortDetailListPipe implements PipeTransform {
    /**
     * 交易明細日期分類
     * @param value 待被轉換的 所有賽事
     * @param key   比對的屬性名稱
     * @param vol   比對的根據值
     */
    transform(value: any, key: string, vol: string, getlength?: string): any {

        //全部賽事不分類的狀況
        if ((!vol || vol == '') && getlength) {
            return value.length;
        } else if (!vol || vol == '') {
            return value;
        }

        let res = value.filter((item) => {
            return item[key].slice(0, 10) == vol;
        });

        if (getlength) { return res['length']; }

        return res;
    }
}

@Pipe({ name: 'calcDetailTot' })
export class calcDetailTotPipe implements PipeTransform {
    /**
     * 交易明細總計計算
     * @param value 交易明細
     * @param date  要過濾的日期
     * @param vol   要計算的欄位
     */
    transform(value: any, date: string, vol: string): any {
        let tot: number = 0;
        Observable.from(value)
            .filter(item => {
                if (!date || date == '') { return true; }
                return item['btime'].slice(0, 10) == date;
            })
            .subscribe({
                next: (item) => {
                    tot += item[vol];
                }
            })
        return tot;
    }
}


@Pipe({ name: 'sortHandicap' })
export class sortHandicapPipe implements PipeTransform {
    /**
     * 賽事盤口選項排序、字串處理
     * @param value 待被轉換的賽事盤口陣列
     */
    transform(value: any[], ptype) {
        let newArr;
        const compareFn = (a, b) => {
            if (a.option < b.option) return -1;
            if (a.option > b.option) return 1;
            return 0;
        };
        if (ptype == 'PDHR') {
            Observable.from(value)
                //過濾不需要的選項
                .filter(item => {
                    let pass: boolean = true;
                    switch (item['option']) {
                        case 'H0C3': pass = false; break;
                        case 'H1C3': pass = false; break;
                        case 'H2C3': pass = false; break;
                        case 'H3C0': item['option'] = '其他'; break;
                        case 'H3C1': pass = false; break;
                        case 'H3C2': pass = false; break;
                        case 'H3C3': pass = false; break;
                        case 'OVH': pass = false; break;
                        case 'OVC': pass = false; break;
                        default:
                            break;
                    }
                    return pass;
                })
                .toArray()
                //排序陣列
                .map(arr => arr.sort(compareFn))
                .subscribe({
                    next: (arr) => { newArr = arr; },
                });
        } else {
            Observable.from(value)
                //「選項」字串解成數字 (以供後續排序)
                .map(item => {
                    let option = item['option'];
                    switch (option) {
                        case 'OVH': item['option'] = '990'; break;
                        case 'OVC': item['option'] = '991'; break;
                        default: item['option'] = option.replace(/H|C/g, ''); break;
                    }
                    return item;
                })
                .toArray()
                //排序陣列
                .map(arr => arr.sort(compareFn))
                .flatMap(item => item)
                //字串處理
                .map(item => {
                    //組織「選項」字串
                    let option = item['option'];
                    switch (option) {
                        case '990': item['option'] = 'OVH'; break;
                        case '991': item['option'] = 'OVC'; break;
                        default: item['option'] = 'H' + option.charAt(0) + 'C' + option.charAt(1); break;
                    }
                    return item
                })
                .toArray()
                .subscribe({
                    next: (arr) => { newArr = arr; },
                });
        }
        return newArr;
    }
}

@Pipe({ name: 'last4' })
export class last4Pipe implements PipeTransform {

    transform(value: any): any {
        return value.toString().substr(2);
    }
}
@Pipe({ name: 'Donut' })
export class DonutPipe implements PipeTransform {

    transform(value: any,demand:any): any {
        let closing = value;
        let css:any = 2;
        let k:any = 150;
        if(closing >9500000){
            css = 96;
           
            var num =String(Math.round(value));
            console.log(num.substring(0,(num.length-3)));
            k = num.substring(0,(num.length-3));
        }else if(closing < 150000){
            css = 2;
            k = 150;
        }else if(closing < 9500000 && closing > 150000){
            if(closing <1000000){
                k =  closing.toString().substr(0,3);
                css = k.toString().substr(0,1)
            }else{
                k =  closing.toString().substr(0,4);
                css = k.toString().substr(0,2)
            }
            
           
        }
        if(demand == 'css'){
            return css;
        }else{
            return k;
        }
        
    }
}

@Pipe({ name: 'DateFilter' })
export class DateFilteripe implements PipeTransform {

    transform(value: any, data: any): any {
        if(data == -1){
            return value;
        }
        let conditionData = GetDateStr(data);
        let arr = [];
        if(value){
            value.forEach(element => {
                if (element.date == conditionData) {
                    arr.push(element);
                }
            });
        }

        return arr;
    }
}



@Pipe({name: 'KeysPipe',
// pure: false
})
export class KeysPipe implements PipeTransform {
  transform(value, args:any =false) : any {
    let keys = [];
    for (let key in value) {
        if(!args){
            keys.push({key: key, value: value[key]});
        }else if(args == key){
            keys.push({key: key, value: value[key]});
        }
     
    }

    return keys;
  }
}
/**亂數隊伍 */
@Pipe({name: 'RandomTeam',
// pure: false
})
export class RandomTeamPipe implements PipeTransform {
  transform(value, args:any ) : any {
    let keys = [];
    var Random = [];
    if(value.length <= 3){
        return value;
    }
    for(let i=1;i<=3;i++){
        let r_v= getRandom(1,value.length)-1;
        if(Random.indexOf(r_v) == -1){
            Random.push(r_v);
        }else{
            i--;
        }
       

    };
    for (let key in value) {
        if(Random.indexOf(Number(key))>=0){
            keys.push(value[Number(key)]);
        }
    }
    return keys;
  }
}




@Pipe({ name: 'timetos' })
export class timetosPipe implements PipeTransform {

    transform(value: any): any {
        return (Date.now() - Date.parse((value).replace(/-/g, '/'))) <300000;
    }
}






@Pipe({ name: 'title' })
export class titlePipe implements PipeTransform {
    transform(value: any): any {
        value.forEach((element,key) => {
            element['key'] = key;
        });
        return value;
    }
}
















/**
 * 獲的日期 YYYY-MM-DD
 * @param AddDayCount  0= 今天 -1 = 昨天 1 = 明天
 */
function GetDateStr(AddDayCount) {

    let dd = new Date();

    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期

    let y = dd.getFullYear();

    let m: any = dd.getMonth() + 1;//获取当前月份的日期
   
    if (m.toString().length <= 1) {
        m = '0' + m.toString();
      }
  
      let d: any = dd.getDate();
      if (d.toString().length <= 1) {
        d = '0' + d.toString();
      }
    return y + "-" + m + "-" + d;

}
function getRandom(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
};