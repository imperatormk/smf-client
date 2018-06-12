import { Component, OnInit, OnDestroy } from '@angular/core';
import { Fight } from '../../models/fight';
import { FilterConfig } from '../../models/filter-config';
import { Tag } from '../../models/tag';

import { ISubscription } from 'rxjs/Subscription'
import { SocketService } from '../../services/socket/socket.service'
import { CategoryService } from '../../services/category/category.service'

@Component({
  selector: 'post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.scss']
})
export class PostFeedComponent implements OnInit, OnDestroy {
  private socketSubscription: ISubscription;
  private catFilterSubscription: ISubscription;
  filterType: number = 0;

  fights: Array<Fight> = [];
  endReached: boolean = true;
  fightsLoading: boolean = false;
  filterConfig: FilterConfig = new FilterConfig();
  tagConfig: any = {};

  constructor(
	private socket: SocketService,
	private categoryService: CategoryService) {
  }

  reinitFeed() {
  	console.log('New filter config', this.filterConfig);
  	this.filterConfig.lastId = -1;
  	this.getFights();
  }

  getFights() {
  	this.fightsLoading = true;  
  	this.socket.emit('reqFights', this.filterConfig).subscribe();
  }

  getMoreFights() {
  	this.getFights();
  }

  filterNewFight(fight) {
  	var config = this.filterConfig;
  	var matchesArr = [];
  
 	var containsCatFn = function(catA) {
    	return function(catB) {
        	return catA._id === catB._id;
    	}
	}
    
    var containsTagFn = function(tagA) {
    	return function(tagB) {
        	return tagA.tagText === tagB.tagText;
    	}
	}
  
  	if (config.categories.length > 0) {
    	var containsObj = { contains: false };
    	fight.categories.every((cat, index) => {
        	var containsCat = config.categories.some(containsCatFn(cat));
        	if (containsCat) containsObj.contains = true;
        	return true;
        });
    	matchesArr.push(containsObj);
    }
  
    if (config.tags.length > 0) {
    	var containsObj = { contains: false };
    	fight.tags.every((tag, index) => {
        	var containsTag = config.tags.some(containsTagFn(tag));
        	if (containsTag) containsObj.contains = true;
        	return true;
        });
    	matchesArr.push(containsObj);
    }
  
  	return matchesArr.filter(e => e.contains === false).length == 0;
  }

  ngOnInit() {
  	this.socketSubscription = this.socket.subscribe('postFeed')
    .subscribe((data) => {
    	if (data.type === 'newFight') {
        	var fight = data.content;
        	if (this.filterNewFight(fight)) {
            	this.fights.unshift(data.content);
            }
        }
    });
  
    this.socket.on('getFights')
    .subscribe((fightsArr) => {
    	if (this.filterConfig.lastId == -1) this.fights = [];
    
    	this.fights.push.apply(this.fights, fightsArr);
    	var lastFight = this.fights[this.fights.length-1];
    	this.filterConfig.lastId = lastFight ? lastFight._id : -1;
    	this.endReached = (fightsArr.length < this.filterConfig.loadQty);
    	this.fightsLoading = false;
    });
  
  	this.catFilterSubscription = this.categoryService.categoryFilter$.subscribe((cats) => {
    	if (cats) this.filterConfig.categories = cats;
    	this.reinitFeed(); // maybe not the best idea to put it here
    })
  
  	this.tagConfig.isActive = false;
  }

  searchByTag() {
  	var tag = new Tag();
  	tag.tagText = this.tagConfig.tagText.trim();
  	this.filterConfig.tags = tag.tagText != '' ? [tag] : [];
  	this.reinitFeed();
  }

  ngOnDestroy() {
    this.socketSubscription.unsubscribe();
  	this.catFilterSubscription.unsubscribe();
  }
}
