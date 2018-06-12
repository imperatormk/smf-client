import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../../services/auth/auth.service';
import { UserSummary } from '../../models/user-summary';

@Component({
  selector: 'nav-header',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  auth: AuthService;
  user: UserSummary = new UserSummary();
  showLogin: boolean = false;

  username: string = "";
  password: string = "";

  constructor(authService: AuthService) { this.auth = authService }

  ngOnInit() {
    this.auth.user$.subscribe((res) => {
        this.user = res.summary || new UserSummary();
    	if (res.summary) this.showLogin = false;
    });
  }

  toggleLoginModal() {
	if (this.user.username === "") {
    	this.showLogin = !this.showLogin;
    } else {
    	this.showLogin = false;
    }
  }

  authRegular() {
  	if (this.username && this.password) {
    	var authObj = {
        	username: this.username,
        	password: this.password
        }
        this.auth.authRegular(authObj);
    }
  }

  logout() {
  	this.auth.logout();
  }
}
