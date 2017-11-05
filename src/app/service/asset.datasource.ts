import { DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';

import { Asset, asset } from '../model';
import { AssetService } from './';

export class AssetDataSource extends DataSource<asset> {
  public dataChange: BehaviorSubject<asset[]> = new BehaviorSubject<asset[]>([]);
  get data(): asset[] { return this.dataChange.value; }

  constructor(private assetService: AssetService) {
    super();
    this.list();
  }

  connect(): Observable<asset[]> {
    return this.dataChange;
  }

  remove(id: string) {
    this.assetService.remove(id).subscribe(numRemoved => {
      this.list();
    });
  }

  create(asset: Asset) {
    this.assetService.create(asset).subscribe(asset => {
      this.list();
    });
  }

  list() {
    this.assetService.list().subscribe(assets => {
      let tmpData = this.data.slice();

      tmpData = [...assets];
      this.dataChange.next(tmpData);
    })
  }

  disconnect() { }
}
