import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ElectronService } from 'ngx-electron';

import { ModalConfirmComponent } from '../../component/modal/modal-confirm.component';

import { AssetService, TagService, CategoryService, NotificationService } from '../../service';
import { Asset, Category, Tag } from '../../model';

@Component({
  selector: 'ac-image-view',
  templateUrl: './image.html'
})
export class ImageViewComponent {
  @ViewChild(ModalConfirmComponent) deleteModal: ModalConfirmComponent;
  @ViewChild(HTMLImageElement) imageRef: HTMLImageElement;
  @ViewChild(HTMLDivElement) grid: HTMLDivElement

  public asset: Asset;
  public category: Category;
  public tags: Tag[];
  public selectedTags: Tag[] = [];
  public showMetadata: boolean = false;
  public monochrome: boolean = false;
  public flipHorizontal: boolean = false;

  constructor(
    private assetService: AssetService,
    private tagService: TagService,
    private categoryService: CategoryService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private zone: NgZone,
    private electron: ElectronService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.asset = data[0].asset;
      this.category = data[0].category;
      this.tags = data[0].tags;

      this.selectedTags = this.tags.filter(tag => this.asset.tags.indexOf(tag._id) != -1);
    });
  }

  public toggleMonochrome(): void {
    this.monochrome = !this.monochrome;
  }

  public toggleFlipHorizontal(): void {
    this.flipHorizontal = !this.flipHorizontal;
  }

  public gotoCategory(category: Category): void {
    this.router.navigate(['/library', category._id]);
  }

  public toggleMetadata(): void {
    this.showMetadata = !this.showMetadata;
  }

  public sanitize(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public confirmDelete(): void {
    this.deleteModal.open();
  }

  public deleteImage(deleteFile: boolean): void {
    if (!deleteFile) {
      this.removeAsset();
    } else {
      if (this.electron.isElectronApp) {
        this.electron.ipcRenderer.once('resource-removed', (event, data) => {
          this.zone.runOutsideAngular(() => {
            console.log('Image removed, proceeding to remove db');

            this.zone.runTask(() => {
              this.removeAsset();
            });
          });
        });

        this.electron.ipcRenderer.send('remove-resource', this.asset.url);
      }
    }
  }

  public removeAsset(): void {
    this.assetService.remove(this.asset._id).subscribe(result => {
      if (result == 1) {
        this.router.navigate(['/library']);
      }
    });
  }

  public generateThumbnail(): void {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.send('generate-thumbnail', { url: this.asset.url, id: this.asset._id, sizeBase: 400 });
    }
  }

  public setRating(rating: number) {
    this.assetService.setRating(this.asset._id, rating).subscribe(result => {
      this.notification.info('Rating updated!', 'Rating for the image has been updated!');
      this.asset.rating = rating;
    })
  }
}
