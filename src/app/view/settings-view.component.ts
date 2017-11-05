import { Component } from '@angular/core';
import { CATEGORY_SEED } from '../model/category.seed';
import { Category } from '../model/Category';
import { Observable } from 'rxjs';

import { CategoryService } from '../service';

@Component({
  selector: 'ac-settings',
  templateUrl: './settings.html'
})
export class SettingsViewComponent {
  constructor(private categoryService: CategoryService) { }

  public seedCategories(): void {
    let observables = [];

    for (let category of CATEGORY_SEED) {
      observables.push(this.categoryService.create(new Category(category.title, category.description, category.icon)));
    }

    Observable.forkJoin(observables).subscribe(result => {
      console.table(result);
    });
  }

  public seedTags(): void {

  }
}
