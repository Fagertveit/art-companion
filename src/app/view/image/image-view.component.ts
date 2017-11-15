import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ElectronService } from 'ngx-electron';

import { AssetService, TagService, CategoryService } from '../../service';
import { Asset, Category, Tag } from '../../model';

@Component({
  selector: 'ac-image-view',
  templateUrl: './image.html'
})
export class ImageViewComponent {
  public asset: Asset;
  public category: Category;
  public tags: Tag[];
  public selectedTags: Tag[] = [];
  public showMetadata: boolean = false;

  constructor(
    private assetService: AssetService,
    private tagService: TagService,
    private categoryService: CategoryService,
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

  public gotoCategory(category: Category): void {
    this.router.navigate(['/library', category._id]);
  }

  public toggleMetadata(): void {
    this.showMetadata = !this.showMetadata;
  }

  public sanitize(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
}
