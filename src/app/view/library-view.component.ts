import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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
  public selectedCategory: Category;
  public selectedTags: Tag[] = [];
  public categoryId: string;
  public tagId: string;

  constructor(
    private assetService: AssetService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.categoryId = params.id;
      }
    });

    this.getCategories();
    this.getAssets();
  }

  public gotoImage(id: string): void {
    this.router.navigate(['image', id]);
  }

  public refreshAssets(): void {
    let filter = {
      category: this.selectedCategory._id,
    };

    this.assetService.filter(filter).subscribe(result => {
      this.assets = result;
    });
  }

  public getAssets(): void {
    this.assetService.list().subscribe(result => {
      this.assets = result;
    });
  }

  public getCategories(): void {
    this.categoryService.list().subscribe(result => {
      this.categories = result;

      if (this.categoryId) {
        this.setCategory(this.categories.find(category => category._id == this.categoryId));
      }
    });
  }

  public setCategory(category: Category): void {
    this.selectedTags = [];
    this.tagId = null;
    this.selectedCategory = category;
    this.getTags();
    this.refreshAssets();
  }

  public setTag(tag: Tag): void {
    this.selectedTags.push(tag);
    this.tagId = tag._id;
    this.getTags();
  }

  public getTags(): void {
    let filter;

    this.tags = [];

    if (this.tagId) {
      filter = {
        parentTag: this.tagId
      };
    } else {
      filter = {
        parentCategory: this.selectedCategory._id
      };
    }

    this.tagService.filter(filter).subscribe(result => {
      this.tags = result;
    });
  }

  public toggleTag(selectedTag: Tag): void {
    this.selectedTags = this.selectedTags.splice(0, this.selectedTags.indexOf(selectedTag));

    if (this.selectedTags.length > 0) {
      this.tagId = this.selectedTags[this.selectedTags.length - 1]._id;
    } else {
      this.tagId = null;
    }

    this.refreshAssets();
    this.getTags();
  }
}
