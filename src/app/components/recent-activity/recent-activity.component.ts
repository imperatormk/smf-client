import { Component, OnInit, Input } from '@angular/core'
import { ISubscription } from 'rxjs/Subscription'
import { SocketService } from '../../services/socket/socket.service'
import { Activity } from '../../models/activity'
import * as moment from 'moment';

@Component({
  selector: 'recent-activity',
  templateUrl: './recent-activity.component.html',
  styleUrls: ['./recent-activity.component.scss']
})
export class RecentActivityComponent implements OnInit {
  constructor(private socket: SocketService) { }

  activities: Array<Activity> = [];
  socketSubscription: ISubscription = null;
  @Input() userId: number = -1;

  ngOnInit() {
  	this.socketSubscription = this.socket.subscribe('newActivity')
    .subscribe((actObj) => {    
    	var actModel = new Activity(actObj);
    	this.activities.unshift(actModel);
    });
  
  	this.socket.emit('reqStats', {
    	userId: this.userId,
    	actTypes: [],
    	recent: true
    })
  	.subscribe((err) => {});
  
	this.socket.on('getStats')
    .subscribe((stats) => {
    	var actArr = (stats.map(stat => new Activity(stat)));
    	actArr.sort(function(statA, statB) {
        	var dateA = moment(statA.actDate);
        	var dateB = moment(statB.actDate);
        
        	if (dateA.isAfter(dateB))
            	return -1;
        	if (dateA.isBefore(dateB))
            	return 1;
        	return 0;
        });
    	this.activities = actArr;
    	console.log(actArr);
    });
  }

  ngOnDestroy() {
    this.socketSubscription.unsubscribe();
  }
}
