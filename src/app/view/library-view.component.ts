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
    let activeTag = this.selectedTags.find(tag => tag._id == selectedTag._id);

    if (activeTag) {
      // Iterate over all selected tags and remove all tags that has the
      // active tag as parent.
      for (let tag of this.selectedTags) {
        if (tag.parentTag == activeTag._id) {
          this.selectedTags.splice(this.selectedTags.indexOf(tag), 1);
        }
      }

      // And last we remove the actual tag we toggled
      this.selectedTags.splice(this.selectedTags.indexOf(activeTag), 1);
    } else {
      // Else we just add the toggled tag to the selected tags list
      this.selectedTags.push(selectedTag);
    }

    this.refreshAssets();
  }
}
