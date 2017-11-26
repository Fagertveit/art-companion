import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
  public editMode: boolean = false;

  constructor(
    private collectionService: CollectionService,
    private router: Router
  ) { }

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

  public updateCollection(collection: Collection): void {
    this.collectionService.update(this.collection).subscribe(result => {
      this.collection.title = '';
      this.collection.assets = [];

      delete this.collection._id;

      this.getCollections();
    });
  }

  public deleteCollection(collection: Collection): void {
    this.collectionService.remove(collection._id).subscribe(result => {
      this.getCollections();
    });
  }

  public editCollection(collection: Collection): void {
    this.collection = collection;
    this.editMode = true;
  }

  public cancelEdit(): void {
    this.collection.title = '';
    this.collection.assets = [];

    delete this.collection._id;

    this.editMode = false;
  }

  public gotoCollection(collection: Collection): void {
    this.router.navigate(['/collection', collection._id]);
  }
}
