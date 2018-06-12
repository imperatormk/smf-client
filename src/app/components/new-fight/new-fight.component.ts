import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { ISubscription } from "rxjs/Subscription";
import { SocketService } from '../../services/socket/socket.service'
import { CategoryService } from '../../services/category/category.service'

import { UserSummary } from '../../models/user-summary';
import { Category } from '../../models/category';
import { Fight } from '../../models/fight';
import { Party } from '../../models/party';

import { AuthService } from '../../services/auth/auth.service'

@Component({
  selector: 'new-fight',
  templateUrl: './new-fight.component.html',
  styleUrls: ['./new-fight.component.scss']
})
export class NewFightComponent implements OnInit {
  categories: Array<Category> = [];
  user: UserSummary = new UserSummary();;
  userSubscription: ISubscription;
  showNewFight: boolean = false;
  captchaSolved: boolean = false;

someRange2config: any = {
    behaviour: 'drag',
    connect: true,
    margin: 24 * 60 * 60 * 1000, //must be divisible by step
    limit:  365 * 24 * 60 * 60 * 1000, //must be divisible by step
    range: {
      min: (new Date()).getTime(),
      max: (new Date('2019')).getTime()
    },
    pips: {
      mode: 'count', //there were too much pips to see anything
      values: 3,
      density: 3
    },
    step: 24 * 60 * 60 * 1000
  };
someRange: number|number[] =  [new Date('2017').getTime(), new Date('2018').getTime()];

  items = ['Pizza', 'Pasta', 'Parmesan'];

  steps: Array<string> = [];
  curFormStep: number = -1;

  newFight: Fight = new Fight('');

  constructor(private permissionsService: NgxPermissionsService,
              private auth: AuthService,
              private socket: SocketService,
              private categoryService: CategoryService) {
  
  	this.newFight.parties.push(new Party());
  	this.newFight.parties.push(new Party());
  }

  toggleNewFight() {
  	if (this.user.username) {
    	this.showNewFight = !this.showNewFight;
    } else {
    	this.showNewFight = false;
    }
  }

  addParty() {
  	if (this.newFight.parties.length < 4) {
  		this.newFight.parties.push(new Party());
    } else {
    	console.log('No more than 4 options allowed!'); // TODO: error msg
    }
  }

  ngOnInit() {
    this.userSubscription = this.auth.user$.subscribe((res) => {
        this.user = res.summary || new UserSummary();
    });
 
	this.categoryService.categoryList$.subscribe((cats) => {
    	this.categories.push.apply(this.categories, cats);
    	this.categories = this.categories.splice(1);
    });
  
    this.initFormSteps();
  }

  initFormSteps() {
  	this.steps.push('edit');
  	this.steps.push('list-ol');
  	this.steps.push('calendar');
  	this.steps.push('camera');
  	this.steps.push('desktop');
  	this.curFormStep = 0;
  }

  setCurStep(i) {
  	if (i >= 0 && i < this.steps.length) {
  		this.curFormStep = i;
    }
  }

  handleCorrectCaptcha(e) {
  	this.captchaSolved = true;
  }

  postFight() {
  	this.showNewFight = false; // this should be executed when the fight is posted, and show a loading icon before
  	this.socket.emit('postFight', this.newFight).subscribe(); // acknowledge message?
  }

  ngOnDestroy() {
  	this.userSubscription.unsubscribe();
  }
}
