import { UserSummary } from './user-summary';
import { FightVote } from './fight-vote';

export class Party {
	_id: number = -1;
	name: string = "";
	votes: Array<FightVote>;

	isWinner: boolean;
	
	constructor() {
    	delete this._id;
    }
}