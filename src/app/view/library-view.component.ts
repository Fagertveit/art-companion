import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { AssetService, CategoryService, TagService, NotificationService, StatusBarService } from '../service';
import { Asset, Category, Tag, Selectable } from '../model';

@Component({
  selector: 'ac-library',
  templateUrl: './library.html'
})
export class LibraryViewComponent {
  public assets: Selectable<Asset>[] = [];
  public categories: Category[] = [];
  public tags: Tag[] = [];
  public selectedCategory: Category;
  public selectedTags: Tag[] = [];
  public categoryId: string;
  public tagId: string;
  public showNavigation: boolean = true;
  public filter: any = {};
  public limit: number = 30;
  public page: number = 0;
  public totalAssets: number = 0;
  public scrollCooldown: boolean = false;
  public showRatings: boolean = false;
  public showSelection: boolean = false;
  public filterRating: number = 0;

  constructor(
    private assetService: AssetService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private notification: NotificationService,
    private statusBarService: StatusBarService,
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

    this.statusBarService.setHidden(false);

    this.assetService.count().subscribe(result => {
      this.statusBarService.setLibraryCount(result);
    });

    this.getCategories();

    if (!this.categoryId) {
      this.getAssets();
    }
  }

  ngOnDestroy() {
    this.statusBarService.setHidden(true);
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

  public batchTagging(): void {
    console.log('Batch tagging the following assets: ', this.assets.filter(asset => asset.selected));
  }

  public batchDelete(): void {
    console.log('Batch deleting the following assets: ', this.assets.filter(asset => asset.selected));
    /*
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.once('resource-removed', (event, data) => {
        this.zone.runOutsideAngular(() => {
          console.log('Image removed, proceeding to remove db');

          this.zone.runTask(() => {
            this.assetService.remove(asset._id);
          });
        });
      });

      this.electron.ipcRenderer.send('remove-resource', [asset.url, asset.thumbnail]);
    }
    */
  }

  public batchBookmark(): void {

  }

  public batchCollection(): void {

  }

  public sanitize(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public gotoImage(asset: Selectable<Asset>): void {
    if (this.showSelection) {
      asset.selected = !asset.selected;
    } else {
      this.router.navigate(['image', asset.item._id]);
    }
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

  public testAsset(): void {

  }

  public getAssets(): void {
    this.assetService.filterPage(this.filter, this.page, this.limit).subscribe(result => {
      this.assets = this.assets.concat(result.map(asset => {
        return {item: asset, selected: false}
      }));

      this.scrollCooldown = false;
    });

    this.assetService.filterCount(this.filter).subscribe(result => {
      this.statusBarService.setAreaCount(result);
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

  public clearCategory(): void {
    this.selectedTags = [];
    this.tagId = null;
    this.selectedCategory = null;
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
