import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import * as Nedb from 'nedb';

import { Asset, ImportedData } from '../model';

@Injectable()
export class AssetService {
  private db: any;
  private options: Nedb.DataStoreOptions = {
    filename: './db/assets.db'
  };
  private tempImport: ImportedData;

  constructor() {
    this.db = new Nedb(this.options);
    this.db.loadDatabase();
  }

  public setImportedData(data: ImportedData): void {
    this.tempImport = data;
  }

  public getImportedData(): ImportedData {
    return this.tempImport;
  }

  public clearImportedData(): void {
    this.tempImport = null;
  }

  public haveImport(): boolean {
    return this.tempImport != null;
  }

  public list(): Observable<Asset[]> {
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

  public listPage(page: number, limit: number): Observable<Asset[]> {
    return Observable.create(obs => {
      this.db.find({}).skip(page * limit).limit(limit).exec((err, assets) => {
        if (err) {
          obs.complete(err);
        } else {
          obs.next(assets);
          obs.complete();
        }
      })
    })
  }

  public filter(filter: any): Observable<Asset[]> {
    return Observable.create(obs => {
      this.db.find(filter, (err, assets) => {
        if (err) {
          obs.complete(err);
        } else {
          obs.next(assets);
          obs.complete();
        }
      });
    });
  }

  public filterPage(filter: any, page: number, limit: number): Observable<Asset[]> {
    return Observable.create(obs => {
      this.db.find(filter).skip(page * limit).limit(limit).exec((err, assets) => {
        if (err) {
          obs.complete(err);
        } else {
          obs.next(assets);
          obs.complete();
        }
      })
    });
  }

  public get(id: string): Observable<Asset> {
    return Observable.create(obs => {
      this.db.findOne({ _id: id}, (err: Error, asset: Asset) => {
        if (err) {
          obs.complete(err);
        } else {
          obs.next(asset);
          obs.complete();
        }
      });
    });
  }

  public create(asset: Asset): Observable<Asset> {
    return Observable.create(obs => {
      this.db.findOne({ _id: asset._id }, (err, result) => {
        if (result == null) {
          this.db.insert(asset, (err: Error, newAsset: Asset) => {
            if (err) {
              console.error('Failed to create asset.', err);
              obs.complete(err);
            } else {
              obs.next(newAsset);
              obs.complete();
            }
          });
        } else {
          this.db.update({ _id: asset._id }, asset, (err, newAsset) => {
            if (err) {
              console.error('Failed to update asset.', err);
              obs.complete(err);
            } else {
              obs.next(newAsset);
              obs.complete();
            }
          });
        }
      });
    });
  }

  public update(asset: Asset): Observable<Asset> {
    return Observable.create(obs => {
      this.db.update({ _id: asset._id }, asset, (err, updated) => {
        if (err) {
          console.error('Failed to update asset.', err);
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
          obs.next(numRemoved);
          obs.complete();
        }
      });
    });
  }
}
