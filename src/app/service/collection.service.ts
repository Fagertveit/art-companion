import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import * as Nedb from 'nedb';

import { Collection } from '../model';

@Injectable()
export class CollectionService {
  private db: any;
  private options: Nedb.DataStoreOptions = {
    filename: './collection.db',
    timestampData: true
  };

  constructor() {
    this.db = new Nedb(this.options);
    this.db.loadDatabase();
  }

  public list(): Observable<Collection[]> {
    return Observable.create(obs => {
      this.db.find({}, (err, collection) => {
        if (err) {
          obs.complete(err);
        } else {
          obs.next(collection);
          obs.complete();
        }
      });
    });
  }

  public filter(filter: any): Observable<Collection[]> {
    return Observable.create(obs => {
      this.db.find(filter, (err, collection) => {
        if (err) {
          obs.complete(err);
        } else {
          obs.next(collection);
          obs.complete();
        }
      });
    });
  }

  public get(id: string): Observable<Collection> {
    return Observable.create(obs => {
      this.db.findOne({ _id: id}, (err: Error, collection: Collection) => {
        if (err) {
          obs.complete(err);
        } else {
          obs.next(collection);
          obs.complete();
        }
      });
    });
  }

  public create(collection: Collection): Observable<Collection> {
    return Observable.create(obs => {
      this.db.findOne({ _id: collection._id }, (err, result) => {
        if (result == null) {
          this.db.insert(collection, (err: Error, newCollection: Collection) => {
            if (err) {
              console.error('Failed to create collection.', err);
              obs.complete(err);
            } else {
              console.log('Created collection!', newCollection);
              obs.next(newCollection);
              obs.complete();
            }
          });
        } else {
          this.db.update({ _id: collection._id }, collection, (err, newCollection) => {
            if (err) {
              console.error('Failed to update collection.', err);
              obs.complete(err);
            } else {
              console.log('Updated collection!', newCollection);
              obs.next(newCollection);
              obs.complete();
            }
          });
        }
      });
    });
  }

  public update(collection: Collection): Observable<Collection> {
    return Observable.create(obs => {
      this.db.update({ _id: collection._id }, collection, (err, updated) => {
        if (err) {
          console.error('Failed to update collection.', err);
          obs.complete(err);
        } else {
          obs.next(updated);
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
          console.log('Removed collection ' + id, numRemoved);
          obs.next(numRemoved);
          obs.complete();
        }
      });
    });
  }
}
