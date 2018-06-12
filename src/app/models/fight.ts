import { UserSummary } from './user-summary';
import { Category } from './category';
import { Party } from './party';
import { Comment } from './comment';
import { Tag } from './tag';

export class Fight {
	_id: number;
	title: string;
	description: string;
	categories: Array<Category>;
	comments: Array<Comment> = [];
	parties: Array<Party> = [];
	posterUser: UserSummary = new UserSummary();
	tags: Array<Tag> = [];
	daysLeft: number;
	winnerParties: Array<number>;
	status: number;

	constructor(title: string) {
    	this.title = title;
    }
}