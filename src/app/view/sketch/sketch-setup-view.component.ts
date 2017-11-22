import { Component, ViewChild } from '@angular/core';

import { ModalConfirmComponent } from '../../component/modal/modal-confirm.component';
import { Category, Tag, Collection, Sketch, SketchSeries } from '../../model';
import { CategoryService, TagService, CollectionService } from '../../service';

@Component({
  selector: 'sketch-setup',
  templateUrl: './sketch-setup.html'
})
export class SketchSetupViewComponent {
  @ViewChild('createSketch') createSketch: ModalConfirmComponent;

  public collections: Collection[] = [];
  public categories: Category[] = [];
  public tags: Tag[] = [];
  public selectedTag: Tag;
  public selectedTags: Tag[] = [];
  public selectedCategory: Category;
  public tagId: string;
  public categoryId: string;
  public sketches: Sketch[] = [];
  public newSketch: Sketch = {
    title: '',
    assetSource: 0,
    assetSourceId: null,
    series: []
  };
  public newSeries: SketchSeries = {
    timePerAsset: 30,
    numberAssets: 3,
    flipHorizontal: false,
    monochrome: false,
    grid: false
  };

  constructor(
    private categoryService: CategoryService,
    private collectionService: CollectionService,
    private tagService: TagService
  ) { }

  ngOnInit() {
    this.getCollections();
    this.getCategories();
  }

  private getCollections(): void {
    this.collectionService.list().subscribe(result => {
      this.collections = result;
    });
  }

  private getCategories(): void {
    this.categoryService.list().subscribe(result => {
      this.categories = result;
    });
  }

  public setCategory(category: Category): void {
    this.selectedTags = [];
    this.tagId = null;
    this.selectedCategory = category;
    this.getTags();
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

    this.getTags();
  }

  public toggleCategory(selectedCategory: Category): void {
    this.selectedTags = [];
    this.tagId = null;
    this.selectedCategory = null;
  }

  public openCreateSketch(): void {
    this.createSketch.open();
  }

  public setSourceType(type: number): void {
    this.newSketch.assetSource = type;
    this.newSketch.assetSourceId = null;
    this.tags = [];
    this.selectedTags = [];
    this.tagId = null;
    this.selectedCategory = null;
    this.categoryId = null;
  }

  public toggleFlipHorizontal(): void {
    this.newSeries.flipHorizontal = !this.newSeries.flipHorizontal;
  }

  public toggleMonochrome(): void {
    this.newSeries.monochrome = !this.newSeries.monochrome;
  }

  public toggleGrid(): void {
    this.newSeries.grid = !this.newSeries.grid;
  }

  public addSeries(): void {
    let series: SketchSeries = {
      timePerAsset: this.newSeries.timePerAsset,
      numberAssets: this.newSeries.numberAssets,
      flipHorizontal: this.newSeries.flipHorizontal,
      monochrome: this.newSeries.monochrome,
      grid: this.newSeries.grid
    };

    this.newSketch.series.push(this.newSeries);

    this.newSeries = {
      timePerAsset: 30,
      numberAssets: 3,
      flipHorizontal: false,
      monochrome: false,
      grid: false
    }
  }
}
