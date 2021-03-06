import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ElectronService } from 'ngx-electron';

import { FileSystem, File, Asset, Tag, Category } from '../model';
import { AssetService } from './asset.service';
import { CategoryService } from './category.service';
import { TagService } from './tag.service';

@Injectable()
export class LibraryService {
  constructor(
    private assetService: AssetService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private electron: ElectronService
  ) { }

  private categories: string[] = [];
  private tags: string[] = [];
  private newCategories: Category[] = [];
  private newTags: Tag[] = [];

  public importImage(file: File): Observable<Asset> {
    return Observable.create(obs => {
      let newAsset: Asset = {
        title: file.filename as string,
        url: file.url as string,
        thumbnail: '',
        category: file.category.toLowerCase().replace(' ', '_'),
        format: file.format as string,
        dimensions: file.dimensions,
        size: file.size,
        rating: 5,
        tags: []
      };

      if (this.categories.indexOf(file.category) == -1) {
        this.newCategories.push({
          title: file.category,
          _id: file.category.toLowerCase().replace(' ', '_'),
          icon: ''
        });

        this.categories.push(file.category);
      }

      for (let tag of file.tags) {
        if (this.tags.indexOf(tag._id) == -1) {
          this.newTags.push(tag);
          this.tags.push(tag._id);
        }
        newAsset.tags.push(tag._id);
      }

      this.assetService.create(newAsset).subscribe(asset => {
        obs.next(asset);
        obs.complete();
      })
    });
  }

  public importCategories(): Observable<Category[]> {
    return Observable.create(obs => {
      let observables = [];

      for (let category of this.newCategories) {
        observables.push(this.categoryService.create(category));
      }

      Observable.forkJoin(observables).subscribe(results => {
        obs.next(results);
        obs.complete();
      });
    });
  }

  public importTags(): Observable<Tag[]> {
    return Observable.create(obs => {
      let observables = [];

      for (let tag of this.newTags) {
        observables.push(this.tagService.create(tag));
      }

      Observable.forkJoin(observables).subscribe(results => {
        obs.next(results);
        obs.complete();
      });
    });
  }

  public importLibrary(fs: FileSystem): Promise<boolean> {
    return new Promise((resolve) => {
      let observables = [];
      let createdTags = [];

      for (let category in fs) {
        if (category == 'thumbnails') {
          continue;
        }

        let files = fs[category];
        let newCategory: Category = {
          title: category,
          _id: category.toLowerCase(),
          icon: ''
        };

        observables.push(this.categoryService.create(newCategory));

        for (let file of files) {
          let newAsset: Asset = {
            title: file.filename as string,
            url: file.url as string,
            thumbnail: '',
            category: file.category.toLowerCase() as string,
            format: file.format as string,
            dimensions: file.dimensions,
            size: file.size,
            tags: []
          };

          for (let tag of file.tags) {
            newAsset.tags.push(tag._id);

            if (createdTags.indexOf(tag._id) == -1) {
              observables.push(this.tagService.create(tag));
              createdTags.push(tag._id);
            }
          }

          observables.push(this.assetService.create(newAsset));
        }
      }

      Observable.forkJoin(observables).subscribe(result => {
        resolve(true);
      });
    });
  }

  public generateThumbnails(): void {
    let assets: Asset[];

    this.assetService.list().subscribe(result => {
      for (let asset of result) {
        this.electron.ipcRenderer.send('generate-thumbnail', { id: asset._id, url: asset.url, sizeBase: 400 });
      }
    });
  }
}
