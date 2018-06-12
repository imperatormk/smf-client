import { FightSummary } from './fight-summary';
import { CommentSummary } from './comment-summary';
import { VoteSummary } from './vote-summary';

export class Activity {
	actObj: FightSummary | CommentSummary | VoteSummary;
	actType: String;
	actDate: Date;
	
	constructor(actCont) {
    	this.actType = actCont.actType;
    
    	// some of the following logic goes to backend one day
    	
    	switch (this.actType) {
        	case 'fight':
        		this.actDate = actCont.actObj.datePosted;
        		delete actCont.actObj.datePosted;
        		this.actObj = new FightSummary(actCont.actObj);
        		break;
        	case 'comment':
        		this.actDate = actCont.actObj.datePosted;
        		delete actCont.actObj.datePosted;
        		this.actObj = new CommentSummary(actCont.actObj);
        		break;
        	case 'vote':
        		this.actDate = actCont.actObj.dateVoted;
        		delete actCont.actObj.dateVoted;
        		this.actObj = new VoteSummary(actCont.actObj);
        		break;
        }
    }
}