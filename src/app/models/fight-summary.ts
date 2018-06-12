import { UserSummary } from './user-summary';

export class FightSummary {
	_id: Number = -1;
	posterUser: UserSummary;
	title: String;
	text: String;

	constructor(obj) {
    	this._id = obj._id;
    	this.posterUser = obj.posterUser;
    	this.title = obj.title;
    	this.text = '<a href="/user/' + this.posterUser.id + '">' + this.posterUser.username + '</a>' + ' posted a <a href="/fight/' + this._id + '">fight</a>';
    }
}