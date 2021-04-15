//Angular
import { Injectable} from "@angular/core";






@Injectable()
/**會員資料管理服務 */
export class MarketService {
      constructor() {
       
    }

    marketList: Array<any>;
    /**市場列表熱門 ts html*/
    marketListHoT: Array<any>;


    receive(num,data){
        if(num == 1){
            this.marketList = data;
        }
        if(num == 2){
            this.marketListHoT = data;
        }
    }





}