//Angular
import { Component, ViewEncapsulation } from '@angular/core';
//Service
import { LanguageService, LoadingService } from 'service';
//RxJS
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
//Others
import { clickEvent } from 'lib/config';


@Component({
	selector: 'my-app',
	templateUrl: 'app.component.html',
	styleUrls: ['app.variables.scss', 'app.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent {
	constructor(public lang: LanguageService, public loader: LoadingService) {}

	/**fastClick事件 訂閱 ts*/
	private clickSubs: Subscription;

	ngOnInit() {
		//fastClick
		this.clickSubs = Observable.fromEvent(document, 'DOMContentLoaded').subscribe( e => {
			if('ontouchstart' in window) { clickEvent.attach(document.body); }
		});
	}
	ngOnDestroy() {
		this.clickSubs.unsubscribe();
	}

}