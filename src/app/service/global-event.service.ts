import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { ElectronService } from 'ngx-electron';
import { NotificationService } from './notification.service';
import { AssetService } from './asset.service';
import { SettingsService } from './settings.service';
import { LibraryService } from './library.service';

import { Dimension, Progress } from '../model';

@Injectable()
export class GlobalEventService {
  private maxActiveThumbnails: number = 2;
  public numActiveThumbnails: number = 0;
  public numImageImports: number = 0;
  private thumbnailQueue: any[] = [];
  private thumbSubject: Subject<Progress>;

  constructor(
    private electron: ElectronService,
    private notification: NotificationService,
    private router: Router,
    private ngZone: NgZone,
    private assetService: AssetService,
    private settingsService: SettingsService,
    private libraryService: LibraryService
  ) {
    this.addListeners();
  }

  private addListeners(): void {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.on('import-resource', (event, data) => {
        this.ngZone.runOutsideAngular(() => {
          console.log('We\'ve gotten an url from the main process', data.url);

          this.assetService.setImportedData(data);
        });

        this.ngZone.runTask(() => {
          this.router.navigate(['/image/create']);
        });
      });

      this.electron.ipcRenderer.on('thumbnail-generated', (event, data) => {
        this.ngZone.runOutsideAngular(() => {
          this.updateAsset(data.id, data.url, data.size);
          this.numActiveThumbnails -= 1;

          if (this.thumbnailQueue.length > 0 && this.numActiveThumbnails < this.maxActiveThumbnails) {
            let thumbData = this.thumbnailQueue.pop();
            this.numActiveThumbnails += 1;

            this.ngZone.runTask(() => {
              this.thumbSubject.next({ maxValue: this.numImageImports, value: this.numImageImports - this.thumbnailQueue.length });
            });

            setTimeout(() => {
              this.electron.ipcRenderer.send('generate-thumbnail', thumbData);
            }, 250);
          }
        });
      });

      if (this.settingsService.getLibraryPath()) {
        this.electron.ipcRenderer.send('client-startup', { libraryPath: this.settingsService.getLibraryPath() });
      }

      this.electron.ipcRenderer.on('library-listed', (event, data) => {
        console.log(data.fs);
      });

      this.electron.ipcRenderer.on('import-image', (event, data) => {
        this.ngZone.runOutsideAngular(() => {
          this.libraryService.importImage(data).subscribe(asset => {
            this.numImageImports += 1;

            if (this.numActiveThumbnails > this.maxActiveThumbnails) {
              this.ngZone.runTask(() => {
                this.thumbSubject = new Subject();
                this.notification.progress('Generating thumbnails', this.thumbSubject);
              });

              this.thumbnailQueue.push({ url: asset.url, id: asset._id, sizeBase: 400 });
            } else {
              this.numActiveThumbnails += 1;
              this.electron.ipcRenderer.send('generate-thumbnail', { url: asset.url, id: asset._id, sizeBase: 400 });
            }
          });
        });
      });

      this.electron.ipcRenderer.on('import-categories', (event, data) => {
        this.ngZone.runOutsideAngular(() => {
          this.libraryService.importCategories(data).subscribe(result => {
            console.log('Categories created!');
          });
        });
      });

      this.electron.ipcRenderer.on('import-tags', (event, data) => {
        this.ngZone.runOutsideAngular(() => {
          this.libraryService.importTags(data).subscribe(result => {
            console.log('Tags created!');
          });
        });
      });
    }
  }

  public updateAsset(id: string, thumbUrl: string, imgSize: Dimension): void {
    this.assetService.get(id).subscribe(result => {
      result.thumbnail = thumbUrl;
      result.dimensions = imgSize;

      this.assetService.update(result).subscribe(result => {
      });
    });
  }
}
