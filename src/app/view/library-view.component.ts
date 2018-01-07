import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

import { ImageGridComponent } from '../component/image-grid/image-grid.component';
import { AssetService, CategoryService, TagService, NotificationService } from '../service';
import { Asset, Category, Tag, Selectable } from '../model';

@Component({
  selector: 'library',
  templateUrl: './library.html'
})
export class LibraryViewComponent {
  @ViewChild('library') library: ImageGridComponent;
  public categories: Category[] = [];
  public tags: Tag[] = [];
  public selectedCategory: Category;
  public selectedTags: Tag[] = [];
  public categoryId: string;
  public tagId: string;
  public filter$: Observable<any>;
  public libraryCount: number = 0;
  public areaCount: number = 0;
  public filterRating: number = 0;

  private filter: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(
    private assetService: AssetService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private notification: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.categoryId = params.id;
      }
    });

    this.assetService.count().subscribe(result => {
      this.libraryCount = result;
    });

    this.getCategories();

    if (!this.categoryId) {
      this.filter$ = this.filter.asObservable();
    }
  }

  public batchTagging(): void {
    //console.log('Batch tagging the following assets: ', this.assets.filter(asset => asset.selected));
  }

  public batchDelete(): void {
    //console.log('Batch deleting the following assets: ', this.assets.filter(asset => asset.selected));
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

  public gotoImage(id: string): void {
    this.router.navigate(['image', id]);
  }

  public setRatingFilter(rating: number): void {
    this.filterRating = rating;
    this.refreshAssets();
  }

  public refreshAssets(): void {
    let filter: any;
    if (this.tagId) {
      filter = {
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
      filter = {
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
      filter = {
        rating: { $gte: this.filterRating }
      };
    }

    this.filter.next(filter);
  }

  public getCategories(): void {
    this.categoryService.list().subscribe(result => {
      this.categories = result;

      if (this.categoryId) {
        this.filter$ = this.filter.asObservable().delay(250);
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
