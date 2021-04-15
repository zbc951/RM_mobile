//Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
//RxJS
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/catch';
//Others
import { host, storageMode } from 'lib/config';
import { APIResponse } from 'lib/IResponse';
import { getURLParamet } from "lib/functions";


@Injectable()
export class ApiService {
	constructor(private router: Router, private http: Http) { this.determine(); }
	/**錯誤代碼列表 */
	private errMsg: any = {};
	/**登出次數計算 (若吃到 1 次，往後就不顯示登出 alert)*/
	private logoutCount: number = 0;
	 /**語系 ts*/
	 private nowLang: string = '';
	/**
     * 預先判定作業
     */
	private determine() {
        let lang;
        //判斷儲存使用 Storage 或 URL
        if(storageMode) { lang = sessionStorage.getItem('lang'); }
        else            { lang = getURLParamet('lang');          }

        //沒有儲存語系，就使用系統預設
        if(!lang) {
			this.getErroMsgFile(host.lang);
        }else {
            this.getErroMsgFile(lang);
        }
    }

	private getErroMsgFile(lang) {
		this.nowLang = lang;
		switch (lang) {
            case 'zh-tw':
				this.http.get('./file/errMsg-tw.json')
					.map(res => res.json()).subscribe(
						data => this.errMsg = data,
						err  => console.log('errdata-err'),
					);
                break;
            case 'zh-cn':
				this.http.get('./file/errMsg-cn.json')
					.map(res => res.json()).subscribe(
						data => this.errMsg = data,
						err  => console.log('errdata-err'),
					);
                break;
            case 'en-us':
				this.http.get('./file/errMsg-en.json')
					.map(res => res.json()).subscribe(
						data => this.errMsg = data,
						err  => console.log('errdata-err'),
					);
				break;
			case 'th':
				this.http.get('./file/errMsg-th.json')
					.map(res => res.json()).subscribe(
						data => this.errMsg = data,
						err  => console.log('errdata-err'),
					);
				break;
            default:
                break;
        }
	}

	/**
	 * API HTTP Request
	 * @param _code gateway接口
	 * @param _data request參數
	 */
	postServer(_code: number, _data: any): Observable<APIResponse> {
		if(!_data['lang']){
			_data['lang'] = this.nowLang;
		}
		let url = host.gateway + '?' + _code;
		let body = this.formatPostBody({
			cmd: JSON.stringify({
				cmd: _code,
				parame: _data //parame
			})
		});
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' });
		let options = new RequestOptions({ headers: headers });
		return this.http
			.post(url, body, options)
			.retry(2)
			.timeout(30000)
			.map((postRes) => {
				try {
				let res: APIResponse = eval('(' + postRes["_body"] + ')');
				//避開310下注的錯誤
				if (!res.err && _code !=310 && _code !=960 && _code !=333) { this.errReturn(_code, res.err_msg); }	// res.err == false 發生錯誤狀況
				return res || {};

				} catch (e) {
					console.log('error:' + _code);
					console.log(e);
				}
			})
			.catch((error) => Observable.throw(error || 'Server error'))
	}
	/**
	 * postServer回傳錯誤處裡
	 * @param _code 	gateway接口
	 * @param _err_msg	錯誤訊息代碼
	 */
	private errReturn(_code: number|string, _err_msg: number|string|any) {
		//console.log(_code,_err_msg);
		//console.log 使用
		let errPrint = {
			'gateway': _code,
			'errCode': _err_msg,
			'errMsg': this.errMsg[_err_msg]
		};
		console.log(errPrint);



		//登入狀態驗證失效
		if (_err_msg == 700 ) {

			if(this.logoutCount == 0){
				alert(this.errMsg[_err_msg]);
				this.logoutCount++;
			}

			if(storageMode) {
				sessionStorage.clear();
			}
			this.router.navigate(['login']);
			return;
		}
		if(_code == 585){
			alert(_err_msg['errormsg']+','+_err_msg['orderId']);

			return;
		}

		//發出錯誤警告
		if(this.errMsg[_err_msg] == null || this.errMsg[_err_msg] == undefined ) {
			alert(_code+':'+_err_msg);
		}else {
			alert(this.errMsg[_err_msg]);
		}

	}
	/**
	 * 序列化 postServer 請求的 body
	 * @param data 序列化值
	 */
	private formatPostBody(_data: any) {
		let formatData = '';
		let count = 0;
		for (let i in _data) {
			if (count === 0) { formatData += i + '=' + _data[i]; }
			else { formatData += '&' + i + '=' + _data[i]; }
			count++;
		}
		return formatData; 
	}


	/**
	 * Fake API Local Request (暫時用)
	 * @param _code gateway接口
	 * @param _data request參數
	 */
	// postServerFake(_code: number, _data?: any): Observable<APIResponse> {
	// 	return this.http
	// 		.get('./file/fake/' + _code + '.json')
	// 		.map(getRes => {
	// 			let res: APIResponse = { 'err': true, 'err_msg': 0, 'ret': getRes.json() };
	// 			return res || {};
	// 		})
	// 		.catch((error: any) => Observable.throw(error.json().error || 'Server error'))
	// }

}