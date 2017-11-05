import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { CategoryService, TagService }  from '../../service';

@Injectable()
export class ImageCreateResolve implements Resolve<any> {
  constructor(private categoryService: CategoryService, private tagService: TagService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let resource = [];

    resource.push(this.categoryService.list());
    resource.push(this.tagService.list());

    return Observable.forkJoin(resource).map(results => {
      return { categories: results[0], tags: results[1] };
    });
  }
}
