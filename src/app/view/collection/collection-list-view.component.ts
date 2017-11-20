import { Component } from '@angular/core';

import { Collection } from '../../model';
import { CollectionService } from '../../service';

@Component({
  selector: 'collection-list',
  templateUrl: './collection-list.html'
})
export class CollectionListViewComponent {
  public collections: Collection[] = [];
  public collection: Collection = {
    title: '',
    assets: []
  };

  constructor(private collectionService: CollectionService) { }

  ngOnInit() {
    this.getCollections();
  }

  public getCollections(): void {
    this.collectionService.list().subscribe(result => {
      this.collections = result;
    });
  }

  public createCollection(): void {
    this.collectionService.create(this.collection).subscribe(result => {
      this.collection.title = '';
      this.getCollections();
    });
  }

  public gotoCollection(collection: Collection): void {
    console.log('Goto collection: ', collection);
  }
}
