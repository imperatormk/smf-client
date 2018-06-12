import { UserSummary } from './user-summary';
import { CommentVote } from './comment-vote';

export class Comment {
	content: string;
	fightId: number;
	posterUser: UserSummary;
	totalPoints: number;
	votes: Array<CommentVote>;
	
	constructor(fightId?: number) {
    	this.fightId = fightId || -1;
    }
}