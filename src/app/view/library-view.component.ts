import { Component } from '@angular/core';

import { AssetService, CategoryService, TagService } from '../service';
import { Asset, Category, Tag } from '../model';

@Component({
  selector: 'ac-library',
  templateUrl: './library.html'
})
export class LibraryViewComponent {
  public assets: Asset[] = [];
  public categories: Category[] = [];
  public tags: Tag[] = [];

  constructor(
    private assetService: AssetService,
    private categoryService: CategoryService,
    private tagService: TagService
  ) { }

  ngOnInit() {
    this.getCategories();
    this.getAssets();
  }

  public getAssets(): void {
    this.assetService.list().subscribe(result => {
      this.assets = result;
    });
  }

  public getCategories(): void {
    this.categoryService.list().subscribe(result => {
      this.categories = result;
    });
  }
}
