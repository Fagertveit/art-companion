import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import * as Nedb from 'nedb';

import { Sketch } from '../model';

@Injectable()
export class SketchService {
  private db: any;
  private options: Nedb.DataStoreOptions = {
    filename: './db/sketch.db'
  };

  constructor() {
    this.db = new Nedb(this.options);
    this.db.loadDatabase();
  }

  public list(): Observable<Sketch[]> {
    return Observable.create(obs => {
      this.db.find({}, (err, sketch) => {
        if (err) {
          obs.complete(err);
        } else {
          obs.next(sketch);
          obs.complete();
        }
      });
    });
  }

  public filter(filter: any): Observable<Sketch[]> {
    return Observable.create(obs => {
      this.db.find(filter, (err, sketch) => {
        if (err) {
          obs.complete(err);
        } else {
          obs.next(sketch);
          obs.complete();
        }
      });
    });
  }

  public get(id: string): Observable<Sketch> {
    return Observable.create(obs => {
      this.db.findOne({ _id: id}, (err: Error, sketch: Sketch) => {
        if (err) {
          obs.complete(err);
        } else {
          obs.next(sketch);
          obs.complete();
        }
      });
    });
  }

  public create(sketch: Sketch): Observable<Sketch> {
    return Observable.create(obs => {
      this.db.findOne({ _id: sketch._id }, (err, result) => {
        if (result == null) {
          this.db.insert(sketch, (err: Error, newSketch: Sketch) => {
            if (err) {
              console.error('Failed to create sketch.', err);
              obs.complete(err);
            } else {
              console.log('Created sketch!', newSketch);
              obs.next(newSketch);
              obs.complete();
            }
          });
        } else {
          this.db.update({ _id: sketch._id }, sketch, (err, newSketch) => {
            if (err) {
              console.error('Failed to update sketch.', err);
              obs.complete(err);
            } else {
              console.log('Updated sketch!', newSketch);
              obs.next(newSketch);
              obs.complete();
            }
          });
        }
      });
    });
  }

  public update(sketch: Sketch): Observable<Sketch> {
    return Observable.create(obs => {
      this.db.update({ _id: sketch._id }, sketch, (err, updated) => {
        if (err) {
          console.error('Failed to update sketch.', err);
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
          console.log('Removed sketch ' + id, numRemoved);
          obs.next(numRemoved);
          obs.complete();
        }
      });
    });
  }
}
