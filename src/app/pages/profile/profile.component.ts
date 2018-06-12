import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Activity } from '../../models/activity';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { SocketService } from '../../services/socket/socket.service';
import * as moment from 'moment';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  title = 'profile';
  user: User = new User(undefined);
  profileLoaded: boolean = false;
  activities: Array<Activity> = [];
  statsCount: any = {}; // make this a model?
  statsLoaded: boolean = false;

  constructor(private socket: SocketService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
  	this.socket.on('getProfile')
    .subscribe((profile) => {
    	if (profile._id) {
        	this.user = new User(profile);
        	this.profileLoaded = true;
        	this.socket.emit('reqStats', { userId: profile._id }).subscribe();
        	// console.log(this.user);
        } else {
        	// console.log('Not found...'); // get from server?
        	this.router.navigate([''])
        }
    });
  
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
    	this.statsCount = this.getActivityCount(stats);
    	this.statsLoaded = true;
    	console.log(actArr);
    });
  
  	this.route.params.subscribe(params => {
    	this.socket.emit('reqProfile', { userId: params.id, recent: true }).subscribe();
    });
  }

  getActivityCount(stats) {
  	var fightCount = stats.filter(stat => stat.actType === 'fight').length
    var commentCount = stats.filter(stat => stat.actType === 'comment').length
    var fightVoteCount = stats.filter(stat => stat.actType === 'vote').length
    
    return {
    	fights: fightCount,
    	comments: commentCount,
    	fightVotes: fightVoteCount
    }
  }
}