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
        tags: []
      };

      let id = route.params['id'];

      this.assetService.get(id).subscribe(asset => {
        data.asset = asset;

        this.categoryService.get(asset.category).subscribe(category => {
          data.category = category;

          resolve(data);
        });
      });
    });
  }
}
