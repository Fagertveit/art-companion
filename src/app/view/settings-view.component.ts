import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { ElectronService } from 'ngx-electron';

import { AssetService, CategoryService, SettingsService, TagService } from '../service';
import { Asset, Category, Tag } from '../model';

import { CATEGORY_SEED } from '../model/category.seed';
import { ASSET_SEED } from '../model/asset.seed';
import { TAG_SEED } from '../model/tag.seed';

@Component({
  selector: 'ac-settings',
  templateUrl: './settings.html'
})
export class SettingsViewComponent {
  public libraryPath: string;

  constructor(
    private assetService: AssetService,
    private categoryService: CategoryService,
    private settingsService: SettingsService,
    private tagService: TagService,
    private electron: ElectronService
  ) { }

  public ngOnInit() {
    this.libraryPath = this.settingsService.getLibraryPath();
  }

  public listTags(): void {
    this.tagService.list().subscribe(result => {
      console.table(result);
    });
  }

  public listAssets(): void {
    this.assetService.list().subscribe(result => {
      console.table(result);
    });
  }

  public listCategories(): void {
    this.categoryService.list().subscribe(result => {
      console.table(result);
    });
  }

  public seedCategories(): void {
    let observables = [];

    for (let category of CATEGORY_SEED) {
      observables.push(this.categoryService.create(category));
    }

    Observable.forkJoin(observables).subscribe(result => {
      console.table(result);
    });
  }

  public seedAssets(): void {
    let observables = [];

    for (let asset of ASSET_SEED) {
      observables.push(this.assetService.create(asset));
    }

    Observable.forkJoin(observables).subscribe(result => {
      console.table(result);
    });
  }

  public seedTags(): void {
    let observables = [];

    for (let tag of TAG_SEED) {
      observables.push(this.tagService.create(tag));
    }

    Observable.forkJoin(observables).subscribe(result => {
      console.table(result);
    });
  }

  public setLibraryPath(): void {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.once('set-library-path', (event, data) => {
        if (data && data.relativePath) {
          this.settingsService.setLibraryPath(data.relativePath);
        }

        this.importLibrary(data.fs).then(result => {
          console.log('Library imported!');
        });
      });

      this.electron.ipcRenderer.send('select-library');
    }
  }

  public importLibrary(fileSystem: any): Promise<boolean> {
    return new Promise((resolve) => {
      let observables = [];

      for (let category in fileSystem) {
        let files = fileSystem[category];
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
            category: file.category.toLowerCase() as string,
            format: file.format as string,
            tags: []
          };

          for (let tag of file.tags) {
            newAsset.tags.push(tag._id);

            observables.push(this.tagService.create(tag));
          }

          observables.push(this.assetService.create(newAsset));
        }
      }

      Observable.forkJoin(observables).subscribe(result => {
        console.log(result);

        resolve(true);
      });
    });
  }
}
