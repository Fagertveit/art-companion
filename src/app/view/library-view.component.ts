import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AssetService, CategoryService, TagService, NotificationService } from '../service';
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
  public showRatings: boolean = false;
  public showSelection: boolean = false;
  public filterRating: number = 0;

  constructor(
    private assetService: AssetService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private notification: NotificationService,
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

  public toggleRatings(): void {
    this.showRatings = !this.showRatings;
  }

  public toggleSelection(): void {
    this.showSelection = !this.showSelection;
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

  public setRating(id: string, rating: number) {
    this.assetService.setRating(id, rating).subscribe(result => {
      this.notification.info('Rating updated!', 'Rating for the image has been updated!');
    })
  }

  public setRatingFilter(rating: number): void {
    this.filterRating = rating;
    this.refreshAssets();
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
          },
          {
            rating: { $gte: this.filterRating }
          }
        ]
      };
    } else if(this.selectedCategory) {
      this.filter = {
        $and: [
          {
            category: this.selectedCategory._id
          },
          {
            rating: { $gte: this.filterRating }
          }
        ]
      };
    } else {
      this.filter = {
        rating: { $gte: this.filterRating }
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
