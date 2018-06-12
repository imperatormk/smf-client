import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { RestService } from '../../services/rest/rest.service';

import { Category } from '../../models/category';

@Injectable()
export class CategoryService {
	private categoryList = new ReplaySubject<Array<Category>>(1);
	categoryList$: Observable<Array<Category>> = this.categoryList.asObservable();

	constructor(private rest: RestService) { }

	getCategories() {
    	this.rest.getCategories().subscribe((cats) => {
        	if (cats) this.categoryList.next(cats);
        });
    }

	private categoryFilter = new ReplaySubject<Array<Category>>(1);
	categoryFilter$: Observable<Array<Category>> = this.categoryFilter.asObservable();

	filterByCategories(cats: Array<Category>) {
    	this.categoryFilter.next(cats);
    }
}