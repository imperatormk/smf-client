import { UserSummary } from './user-summary';

export class CommentSummary {
	fightId: Number = -1;
	posterUser: UserSummary;
	text: String;

	constructor(obj) {
    	this.fightId = obj.fightId;
    	this.posterUser = obj.posterUser;
    	this.text = '<a href="/user/' + this.posterUser.id + '">' + this.posterUser.username + '</a>' + ' commented on a <a href="/fight/' + this.fightId + '">fight</a>';
    }
}