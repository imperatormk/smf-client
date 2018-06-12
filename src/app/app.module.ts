import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { TagInputModule } from 'ngx-chips';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';

/* SERVICES */
import { AuthService } from './services/auth/auth.service';
import { RestService } from './services/rest/rest.service';
import { SocketService } from './services/socket/socket.service';
import { CategoryService } from './services/category/category.service';

/* COMPONENTS */
import { AppComponent } from './app.component';
import { PostFeedComponent } from './components/post-feed/post-feed.component';
import { FightComponent } from './components/fight/fight.component';
import { NavComponent } from './components/nav/nav.component';
import { NewFightComponent } from './components/new-fight/new-fight.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { RecentActivityComponent } from './components/recent-activity/recent-activity.component';

import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';

import { TabsModule } from 'ngx-tabset';
import { RecaptchaModule } from 'ng-recaptcha';
import * as moment from 'moment';

import { MomentModule } from 'ngx-moment';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'user/:id', component: ProfileComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PostFeedComponent,
    FightComponent,
    NavComponent,
    NewFightComponent,
    CategoryListComponent,
  	RecentActivityComponent,
  	HomeComponent,
  	ProfileComponent
  ],
  imports: [
    BrowserModule,
  	FormsModule,
    NgbModule.forRoot(),
  	NgxPermissionsModule.forRoot(),
  	HttpClientModule,
  	TabsModule.forRoot(),
  	BrowserAnimationsModule,
  	RecaptchaModule.forRoot(),
  	TagInputModule,
  	MomentModule,
  	RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [
  	SocketService,
  	AuthService,
    RestService,
  	CategoryService,
  	{ provide: 'moment', useFactory: (): any => moment }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
