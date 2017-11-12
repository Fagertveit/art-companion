import { Component } from '@angular/core';

import { Category } from '../model/Category';
import { Observable } from 'rxjs';
import { ElectronService } from 'ngx-electron';

import { AssetService, CategoryService, SettingsService, TagService } from '../service';

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
        if (data && data.length > 0) {
          this.settingsService.setLibraryPath(data[0]);
        }
      });

      this.electron.ipcRenderer.send('select-library');
    }
  }
}
