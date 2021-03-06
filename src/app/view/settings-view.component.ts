import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { ElectronService } from 'ngx-electron';

import { AssetService, CategoryService, SettingsService, TagService, LibraryService, CollectionService } from '../service';
import { Asset, Category, Tag, Collection } from '../model';

import { COLLECTION_SEED } from '../model/collection.seed';
import { CATEGORY_SEED } from '../model/category.seed';
import { ASSET_SEED } from '../model/asset.seed';
import { TAG_SEED } from '../model/tag.seed';

@Component({
  selector: 'settings',
  templateUrl: './settings.html'
})
export class SettingsViewComponent {
  public libraryPath: string;
  public photoshopPath: string;

  constructor(
    private assetService: AssetService,
    private categoryService: CategoryService,
    private settingsService: SettingsService,
    private tagService: TagService,
    private electron: ElectronService,
    private libraryService: LibraryService,
    private collectionService: CollectionService
  ) { }

  public ngOnInit() {
    this.libraryPath = this.settingsService.getLibraryPath();
    this.photoshopPath = this.settingsService.getPhotoshopPath();
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

  public listCollections(): void {
    this.collectionService.list().subscribe(result => {
      console.table(result);
    });
  }

  public listFilesystem(): void {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.send('list-library');
    }
  }

  public importLibrary(): void {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.send('import-library');
    }
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

  public seedCollections(): void {
    let observables = [];

    for (let collection of COLLECTION_SEED) {
      observables.push(this.collectionService.create(collection));
    }

    Observable.forkJoin(observables).subscribe(result => {
      console.table(result);
    });
  }

  public setPhotoshopPath(): void {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.once('set-photoshop-path', (event, data) => {
        if (data && data.photoshopPath) {
          this.settingsService.setPhotoshopPath(data.photoshopPath);
          this.photoshopPath = data.photoshopPath;
        }
      });

      this.electron.ipcRenderer.send('find-photoshop');
    }
  }

  public setLibraryPath(): void {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.once('set-library-path', (event, data) => {
        if (data && data.libraryPath) {
          this.settingsService.setLibraryPath(data.libraryPath);
          this.libraryPath = data.libraryPath;
        }

        this.libraryService.importLibrary(data.fs).then(result => {
          console.log('Library imported!');
          this.libraryService.generateThumbnails();
        });
      });

      this.electron.ipcRenderer.send('select-library');
    }
  }
}
