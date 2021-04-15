//Angular
import { Injectable, Inject, forwardRef } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
//Service
import { MemberService } from "service";
//lib
import { storageMode } from 'lib/config';

@Injectable()

/**路由器驗證 uid 服務 */
export class AuthGuard implements CanActivate {
	private uid: string;
	constructor(
		@Inject(forwardRef(() => MemberService))
		private member: MemberService,
		private router: Router,
		) {}

	canActivate() {
		if (this.member.uid) { return true; }
		if (storageMode)     { sessionStorage.clear(); }
		this.router.navigate(['login']);
		return false;
	}
}