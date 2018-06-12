import { UserSummary } from './user-summary';
import { Category } from './category';
import { Tag } from './tag';

export class FilterConfig {
	categories: Array<Category> = new Array();
    friendsOnly: true|false;
    tags: Array<Tag> = new Array();
    lastId: number = -1;
    loadQty: number = 3;

	constructor() {
    }
}