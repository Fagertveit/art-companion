import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import * as Nedb from 'nedb';

import { Asset, asset } from '../model';

@Injectable()
export class AssetService {
  private db: any;
  private options: Nedb.DataStoreOptions = {
    filename: './db/assets.db'
  };
  private base64img: string;
  private imgPath: string;

  constructor() {
    this.db = new Nedb(this.options);
    this.db.loadDatabase();
  }

  public setBase64(base64img: string): void {
    this.base64img = base64img;
  }

  public getBase64(): string {
    return this.base64img;
  }

  public setImagePath(path: string): void {
    this.imgPath = path;
  }

  public getImagePath(): string {
    return this.imgPath;
  }

  public list(): Observable<asset[]> {
    return Observable.create(obs => {
      this.db.find({}, (err, assets) => {
        if (err) {
          obs.complete(err);
        } else {
          obs.next(assets);
          obs.complete();
        }
      });
    });
  }

  public create(asset: Asset): Observable<asset> {
    return Observable.create(obs => {
      this.db.insert(asset.get(), (err: Error, newAsset: asset) => {
        if (err) {
          console.error('Failed to create asset.', err);
          obs.complete(err);
        } else {
          console.log('Created asset!', newAsset);
          obs.next(newAsset);
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
          console.log('Removed asset ' + id, numRemoved);
          obs.next(numRemoved);
          obs.complete();
        }
      });
    });
  }
}
