import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { ISubscription } from 'rxjs/Subscription';

import { SocketService } from '../../services/socket/socket.service'

import { UserSummary } from '../../models/user-summary';
import { Fight } from '../../models/fight';
import { FightVote } from '../../models/fight-vote';
import { Comment } from '../../models/comment';
import { CommentVote } from '../../models/comment-vote';

import { AuthService } from '../../services/auth/auth.service';
import { RestService } from '../../services/rest/rest.service';

@Component({
  selector: 'fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.scss']
})
export class FightComponent implements OnInit {
  @Input('fight') fight: Fight;
  // add fightMeta?

  user: UserSummary;
  newComment: Comment = new Comment();

  userSubscription: ISubscription;
  socketSubscription: ISubscription;

  constructor(private permissionsService: NgxPermissionsService,
              private auth: AuthService,
              private rest: RestService,
              private socket: SocketService) {
  }

  ngOnInit() {
  	this.userSubscription = this.auth.user$.subscribe((user) => {
    	this.user = user.summary;
    });
  	this.checkWinners();
  	this.initSocketSub();
  }

  initSocketSub() {
  	this.socketSubscription = 
        this.socket.subscribe('fight-' + this.fight._id)
    	.subscribe((data) => {
    		if (data.type === 'bodyChange') {
            	this.fight.title = data.content.title;
            } else if (data.type === 'newComment') {
            	this.fight.comments.unshift(data.content);
            } else if (data.type === 'fightVote') {
            	var partyId = data.content.partyId;
            	var vote = data.content.vote;
            	var partyIndex = this.fight.parties.findIndex(x => x._id == partyId);
				this.fight.parties[partyIndex].votes.push(vote);
            } else if (data.type === 'fightEnded') {
            	console.log('Ended!');
            	this.fight.status = data.content.status;
            	this.fight.winnerParties = data.content.winnerParties;
            	this.checkWinners();
            }
    	});
  }

  checkWinners() {
  	this.fight.winnerParties.forEach((winner) => {
  		var partyIndex = this.fight.parties.findIndex(x => x._id == winner);
		this.fight.parties[partyIndex].isWinner = true;
    });
  }

  updateFight(data) {
  	this.fight.title = data.title;
  }

  postComment(e) {
	if (this.user && this.newComment.content) {
		this.newComment.posterUser = this.user;
    	this.newComment.fightId = this.fight._id;
    
    	this.socket.emit('postComment', this.newComment).subscribe();
    	this.newComment = new Comment();
    }
  }

  voteOnComment(comment, type) {
  	if (this.user) {
    	var commVote = new CommentVote();
    	var val = 0;
    	commVote.voterUser = this.user;
    
    	if (type === 'up' && (!comment.userVote || comment.userVote <= 0)) val = 1;
    	if (type === 'down' && (!comment.userVote || comment.userVote >= 0)) val = -1;
    
    	commVote.value = val;
    	this.rest.voteOnComment(comment, commVote)
    	.subscribe((res) => {
        	if (res.status === 'success') {
            	comment.totalPoints = res.totalPoints;
            	comment.userVote = res.userVote;
            }
        });
    }
  }

  getVotedParty() {
  	if (!this.user) return false;
  	var fightVote = this.fight.parties.find((party) => {
    	return party.votes.some((vote) => {
    		return vote.voter.id === this.user.id;
    	});
    });
  
  	if (!fightVote) return false;
  	return fightVote._id; // maybe change to index or name to save space
  }

  voteOnFight(party) {
  	if (this.user && !this.getVotedParty()) {
    	var vote = new FightVote();
    	vote.voter = this.user;
    	var voteObj = {
        	fightId: this.fight._id,
        	partyId: party._id,
        	content: vote
        }
    	this.socket.emit('fightVote', voteObj).subscribe();
    }
  }

  ngOnDestroy() {
  	console.log('Destroying fight ID: ' + this.fight._id);
  	this.userSubscription.unsubscribe();
  	this.socketSubscription.unsubscribe();
  }
}
