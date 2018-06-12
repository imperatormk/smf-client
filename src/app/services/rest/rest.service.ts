import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { map, catchError } from 'rxjs/operators'

import { Fight } from '../../models/fight'
import { FightVote } from '../../models/fight-vote'
import { Comment } from '../../models/comment'
import { CommentVote } from '../../models/comment-vote'
import { Category } from '../../models/category'

import { AppSettings } from '../../constants'

@Injectable()
export class RestService {
    private apiUrl = AppSettings.apiUrl

    private fightsUrl = this.apiUrl + '/fights'
	private categoriesUrl = this.apiUrl + '/categories'

	getFightsUrl() {
    	return this.fightsUrl
    }
	getCommentsUrl(fightId) {
    	return this.getFightsUrl() + '/' + fightId + '/comments'
    }
	getCommentVotesUrl(fightId, commId) {
    	return this.getCommentsUrl(fightId) + '/' + commId + '/votes'
    }
	getFightVotesUrl(fightId, partyId) {
    	return this.getFightsUrl() + '/' + fightId + '/parties/' + partyId + '/votes'
    }
	getCategoriesUrl() {
    	return this.categoriesUrl
    }

    constructor(public http: HttpClient) {}

	getCategories(): Observable<Array<Category>> {
    	return this.http.get<Array<Category>>(this.getCategoriesUrl())
    }

    getFights(): Observable <Fight[]> {
        return this.http.get<Fight[]>(this.getFightsUrl(), { withCredentials: true })
    }

	postFight(fight): Observable <Fight> {
    	return this.http.post<Fight>(this.getFightsUrl(), fight, { withCredentials: true }).pipe(
        	catchError(this.handleError)
        )
    }

    postComment(fightId, comm): Observable <Comment> {
        return this.http.post<Comment>(this.getCommentsUrl(fightId), comm, { withCredentials: true }).pipe(
            catchError(this.handleError)
        )
    }

	voteOnComment(comm, vote): Observable <any> {
    	return this.http.post<CommentVote>(this.getCommentVotesUrl(comm.fightId, comm._id), vote, { withCredentials: true }).pipe(
        	catchError(this.handleError)
        )
    }

	voteOnFight(fightId, party): Observable <any> {
    	return this.http.post<FightVote>(this.getFightVotesUrl(fightId, party._id), {}, { withCredentials: true }).pipe(
        	catchError(this.handleError)
        )
    }

    private extractData(res: Response) {
        let body = res
        return body || {}
    }

    private handleError(error: Response | any) {
        let errMsg: string
        if (error instanceof Response) {
            const err = error || ''
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`
        } else {
            errMsg = error.message ? error.message : error.toString()
        }
        console.error(errMsg)
        return Observable.throw(errMsg)
    }

}