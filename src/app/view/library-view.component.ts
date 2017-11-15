import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  public showNavigation: boolean = true;
  public filter: any = {};
  public limit: number = 20;
  public page: number = 0;
  public scrollCooldown: boolean = false;

  constructor(
    private assetService: AssetService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.categoryId = params.id;
      }
    });

    this.getCategories();

    if (!this.categoryId) {
      this.getAssets();
    }
  }

  public toggleNavigation(): void {
    this.showNavigation = !this.showNavigation;
  }

  public sanitize(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public gotoImage(id: string): void {
    this.router.navigate(['image', id]);
  }

  public refreshAssets(): void {
    if (this.tagId) {
      this.filter = {
        $and: [
          {
            category: this.selectedCategory._id
          },
          {
            tags: this.tagId
          }
        ]
      };
    } else {
      this.filter = {
        category: this.selectedCategory._id
      };
    }

    this.page = 0;
    this.assets = [];

    this.getAssets();
  }

  public onScroll(): void {
    if (!this.scrollCooldown) {
      this.scrollCooldown = true;
      this.page += 1;

      this.getAssets();
    }
  }

  public getAssets(): void {
    this.assetService.filterPage(this.filter, this.page, this.limit).subscribe(result => {
      this.assets = this.assets.concat(result);
      this.scrollCooldown = false;
    });
  }

  public getCategories(): void {
    this.categoryService.list().subscribe(result => {
      this.categories = result;

      if (this.categoryId) {
        this.setCategory(this.categories.find(category => category._id == this.categoryId));
        this.refreshAssets();
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
    this.refreshAssets();
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
