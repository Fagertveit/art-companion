import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { CategoryService, TagService, AssetService }  from '../../service';
import { Asset, Category, Tag } from '../../model';

@Injectable()
export class ImageViewResolve implements Resolve<any> {
  constructor(
    private categoryService: CategoryService,
    private tagService: TagService,
    private assetService: AssetService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return new Promise((resolve) => {
      let data = {
        asset: null,
        category: null,
        tags: null
      };

      let id = route.params['id'];

      this.assetService.get(id).subscribe(asset => {
        data.asset = asset;

        Observable.forkJoin([
          this.categoryService.get(asset.category),
          this.tagService.list()
        ]).subscribe(results => {
          data.category = results[0];
          data.tags = results[1];

          resolve(data);
        });
      });
    });
  }
}
