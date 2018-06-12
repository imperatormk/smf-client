import { UserSummary } from './user-summary';

export class VoteSummary {
	fightId: Number = -1;
	voterUser: UserSummary;
	text: String;

	constructor(obj) {
    	this.fightId = obj.fightId;
    	this.voterUser = obj.voter;
    	this.text = '<a href="/user/' + this.voterUser.id + '">' + this.voterUser.username + '</a>' + ' voted on a <a href="/fight/' + this.fightId + '">fight</a>';
    }
}