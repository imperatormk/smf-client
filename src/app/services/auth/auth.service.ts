import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { SocketService } from '../../services/socket/socket.service';

import { AuthUser } from '../../models/auth-user';
import { AppSettings } from '../../constants';

@Injectable()
export class AuthService {
	private user = new ReplaySubject<AuthUser>(1);
	user$: Observable<AuthUser> = this.user.asObservable();

	constructor(private socket: SocketService) { }

	userChanged(res) {
    	if (res) {
        	this.user.next(res);
        } else {
        	this.user.next(this.getGuestUser());
        }
    }

	getGuestUser(): AuthUser {
    	return new AuthUser();
    }

	authRegular(authObj) {
    	this.socket.emit('login', authObj)
       	.subscribe((err) => {
        	if (err) {
            	console.log(err);
            }
        });
    }

	logout() {
        this.socket.emit('logout', null)
    	.subscribe((err) => {
			if (err) {
            	console.log(err);
            }
        });
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const err = error || '';
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
