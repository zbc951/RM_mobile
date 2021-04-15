import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

const pageInfos = {
  root: {
    page: 'root',
    title: '充值提領'
  },
  deposit: {
    page: 'deposit',
    title: '充值',
    sub: {
      serial: {
        page: 'serial',
        title: '流水號匯款'
      },
      unionpay:{
        page:'unionpay',
        title:'雲閃付'
      }
    }
  },
  withdraw: {
    page: 'withdraw',
    title: '提領'
  },
  card: {
    page: 'card',
    title: '銀行卡'
  },
  record: {
    page: 'record',
    title: '存提紀錄'
  },
  betrecord: {
    page: 'betrecord',
    title: '流水紀錄'
  }
};

interface IPageInfo {
  page: string;
  title: string;
}

@Injectable()
export class CashPageService {

  title: string = pageInfos['root'].title;
  page: string = pageInfos['root'].page;
  subPage: string = null;
  //**下注需要資料 */
  tomarketItem: any = undefined;

    /**交易紀錄 for RecordComponent 預先抓，使畫面流暢*/
    record: any = { 'list': [] };
  constructor(
    public location: Location
  ) { }

  go(page) {
    const pageInfo = pageInfos[page]

    this.title = pageInfo.title;
    this.page = pageInfo.page;
    this.subPage = null;
  }
  getRecord780(_record){
    this.record = _record;
  }
  gomarket(_data){
    this.tomarketItem = _data;
  }
  goSub(subPage) {
    const subPageInfo = pageInfos[this.page].sub[subPage];

    this.title = subPageInfo.title;
    this.subPage = subPageInfo.page;
  }


  back() {
    const page = this.subPage || this.page;

    switch (page) {
      case 'root':
        this.location.back();
        break;
      case 'deposit': case 'withdraw':
      case 'card': case 'record':case 'betrecord':
        this.go('root');
        break;
      default:
        this.go(this.page);
        break;
    }
  }

}
