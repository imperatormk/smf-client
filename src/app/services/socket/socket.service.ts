import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { map, catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';

import * as socketCluster from 'socketcluster-client-edge';

@Injectable()
export class SocketService {
    private socket;

	constructor() {}

    public initSocket(): void {
    	var options = {
  			port: 3000,
        	autoReconnect: true
		};
    
    	this.socket = socketCluster.connect(options);
		this.socket.on('connect', function () {
        	console.log('Connected to SC server');
		});
    }

	public getAuthToken() {
    	return this.socket.authToken;
    }

    public subscribe(channel): Observable<any>  {
    	var sub = this.socket.subscribe(channel);
    
    	return new Observable<any>(observer => {
            sub.watch((data: any) => observer.next(data));
        });
    }

    public emit(event, message): Observable<any> {
    	return new Observable<any>(observer => {
        	this.socket.emit(event, message, (data: any) => observer.next(data));
        }) // .take(1);
    }

    public on(event): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on(event, (data: any) => observer.next(data));
        });
    }
}