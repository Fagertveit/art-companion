import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { ElectronService } from 'ngx-electron';
import { NotificationService } from './notification.service';
import { AssetService } from './asset.service';
import { SettingsService } from './settings.service';
import { LibraryService } from './library.service';

import { Dimension, Progress, Asset } from '../model';

@Injectable()
export class GlobalEventService {
  private maxActiveThumbnails: number = 2;
  public numActiveThumbnails: number = 0;
  public numImageImports: number = 0;
  private thumbnailQueue: any[] = [];
  private thumbSubject: Subject<Progress>;

  private importNum: number = 0;
  private numImported: number = 0;

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

      this.electron.ipcRenderer.on('import-start', (event, numResources) => {
        this.importNum = numResources;

        this.thumbSubject = new Subject();
        this.notification.progress('Importing library', this.thumbSubject);

        this.electron.ipcRenderer.send('import-take-next');
      });

      this.electron.ipcRenderer.on('import-file-info', (event, imageInfo) => {
        this.ngZone.runOutsideAngular(() => {
          if (imageInfo.category == 'thumbnails') {
            this.numImported += 1;

            if (this.importNum > this.numImported) {
              this.electron.ipcRenderer.send('import-take-next');
            }
          } else {
            this.libraryService.importImage(imageInfo).subscribe(asset => {
              this.electron.ipcRenderer.send('import-thumbnail', { url: asset.url, id: asset._id });
            });
          }
        });
      });

      this.electron.ipcRenderer.on('imported-thumbnail', (event, data) => {
        this.ngZone.runOutsideAngular(() => {
          this.updateAsset(data.id, data.url, data.size).subscribe(result => {
            this.numImported += 1;

            this.ngZone.runTask(() => {
              this.thumbSubject.next({ maxValue: this.importNum, value: this.numImported });
            });

            if (this.importNum > this.numImported) {
              setTimeout(() => {
                this.electron.ipcRenderer.send('import-take-next');
              }, 100);
            } else {
              this.libraryService.importCategories().subscribe(result => {
                console.log('Categories created!');
              });

              this.libraryService.importTags().subscribe(result => {
                console.log('Tags created!');
              });
            }
          });
        });
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
          this.libraryService.importCategories().subscribe(result => {
            console.log('Categories created!');
          });
        });
      });

      this.electron.ipcRenderer.on('import-tags', (event, data) => {
        this.ngZone.runOutsideAngular(() => {
          this.libraryService.importTags().subscribe(result => {
            console.log('Tags created!');
          });
        });
      });
    }
  }

  public updateAsset(id: string, thumbUrl: string, imgSize: Dimension): Observable<Asset> {
    return Observable.create(obs => {
      this.assetService.get(id).subscribe(result => {
        result.thumbnail = thumbUrl;
        result.dimensions = imgSize;

        this.assetService.update(result).subscribe(asset => {
          obs.next(asset);
          obs.complete();
        });
      });
    });
  }
}
