import { Component, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';

import { SocketService } from '../../services/socket/socket.service';
import { AuthService } from '../../services/auth/auth.service';
import { CategoryService } from '../../services/category/category.service';

import { UserSummary } from '../../models/user-summary';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'home';
  user: UserSummary = new UserSummary();

  constructor(private permissionsService: NgxPermissionsService, private auth: AuthService, private socket: SocketService, private categoryService: CategoryService) {}

  ngOnInit() {
  	this.socket.initSocket();
  	const perm = []; // initial permissions
    this.permissionsService.loadPermissions(perm);
	// this.auth.getAuth();
  
	var authSub = this.socket.on('authenticate').subscribe((data) => {
    	if (data) {
    		var userRes = this.socket.getAuthToken();
    		this.auth.userChanged(userRes);
        }
    });
  
  	var deauthSub = this.socket.on('deauthenticate').subscribe((data) => {
    	this.auth.userChanged(null); // why is data null?
    });
  
  	this.auth.user$.subscribe((res) => {
    	var permissions = res.permissions || [];
        this.user = res.summary || new UserSummary();
		this.permissionsService.loadPermissions(permissions);
    });
  
  	this.categoryService.getCategories();
  }
}
