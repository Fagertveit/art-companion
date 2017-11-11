import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import * as Nedb from 'nedb';

import { Category } from '../model';

@Injectable()
export class CategoryService {
  private db: any;
  private options: Nedb.DataStoreOptions = {
    filename: './db/categories.db'
  };

  constructor() {
    this.db = new Nedb(this.options);
    this.db.loadDatabase();
  }

  public list(): Observable<Category[]> {
    return Observable.create(obs => {
      this.db.find({}, (err, categories) => {
        if (err) {
          obs.complete(err);
        } else {
          obs.next(categories);
          obs.complete();
        }
      });
    });
  }

  public create(category: Category): Observable<Category> {
    return Observable.create(obs => {
      this.db.insert(category, (err: Error, newCategory: Category) => {
        if (err) {
          console.error('Failed to create category.', err);
          obs.complete(err);
        } else {
          console.log('Created category!', newCategory);
          obs.next(newCategory);
          obs.complete();
        }
      });
    });
  }

  public remove(id: string): Observable<number> {
    return Observable.create(obs => {
      this.db.remove({ _id: id }, {}, (err, numRemoved) => {
        if (err) {
          console.error('Failed to remove ' + id, err);
          obs.complete(err);
        } else {
          console.log('Removed category ' + id, numRemoved);
          obs.next(numRemoved);
          obs.complete();
        }
      });
    });
  }
}
