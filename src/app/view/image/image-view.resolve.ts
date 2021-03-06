import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { CategoryService, TagService, AssetService, CollectionService }  from '../../service';
import { Asset, Category, Tag, Collection } from '../../model';

@Injectable()
export class ImageViewResolve implements Resolve<any> {
  constructor(
    private categoryService: CategoryService,
    private tagService: TagService,
    private assetService: AssetService,
    private collectionService: CollectionService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return new Promise((resolve) => {
      let data = {
        asset: null,
        category: null,
        tags: null,
        collections: null
      };

      let id = route.params['id'];

      this.assetService.get(id).subscribe(asset => {
        data.asset = asset;

        Observable.forkJoin([
          this.categoryService.get(asset.category),
          this.tagService.list(),
          this.collectionService.list()
        ]).subscribe(results => {
          data.category = results[0];
          data.tags = results[1];
          data.collections = results[2];

          resolve(data);
        });
      });
    });
  }
}
