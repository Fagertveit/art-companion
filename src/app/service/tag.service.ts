import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import * as Nedb from 'nedb';

import { Tag } from '../model';

@Injectable()
export class TagService {
  private db: any;
  private options: Nedb.DataStoreOptions = {
    filename: './db/tags.db'
  };

  constructor() {
    this.db = new Nedb(this.options);
    this.db.loadDatabase();
  }

  public list(): Observable<Tag[]> {
    return Observable.create(obs => {
      this.db.find({}, (err, tags) => {
        if (err) {
          obs.complete(err);
        } else {
          obs.next(tags);
          obs.complete();
        }
      });
    });
  }

  public filter(filter: any): Observable<Tag[]> {
    return Observable.create(obs => {
      this.db.find(filter, (err, tags) => {
        if (err) {
          obs.complete(err);
        } else {
          obs.next(tags);
          obs.complete();
        }
      });
    });
  }

  public create(tag: Tag): Observable<Tag> {
    return Observable.create(obs => {
      this.db.insert(tag, (err: Error, newTag: Tag) => {
        if (err) {
          console.error('Failed to create tag.', err);
          obs.complete(err);
        } else {
          console.log('Created tag!', newTag);
          obs.next(newTag);
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
          console.log('Removed tag ' + id, numRemoved);
          obs.next(numRemoved);
          obs.complete();
        }
      });
    });
  }
}
