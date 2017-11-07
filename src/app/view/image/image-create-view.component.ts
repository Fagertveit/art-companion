import { Component, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ElectronService } from 'ngx-electron';

import { AssetService } from '../../service/asset.service';
import { CategoryService } from '../../service/category.service';
import { TagService } from '../../service/tag.service';
import { category, tag, Asset, asset } from '../../model';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'ac-image-create-view',
  templateUrl: './image-create.html'
})
export class ImageCreateViewComponent {
  public url: SafeResourceUrl;
  public path: string;
  public categories: category[] = [];
  public tags: tag[] = [];
  public asset: asset = {
    url: '',
    title: '',
    tags: [],
    category: '',
    size: 0,
    dimensions: {
      width: 0,
      height: 0
    },
    monochrome: false,
    format: '',
    _id: null
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private assetService: AssetService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private electron: ElectronService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.categories = data[0].categories as category[];
      this.tags = data[0].tags as tag[];
    });

    if (this.assetService.getImagePath()) {
      this.path = this.assetService.getImagePath();
    }

    if (this.assetService.getBase64()) {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.assetService.getBase64());
    }
  }

  public storeAsset(path: string): void {
    this.asset.url = path;

    console.log('Storing asset: ', this.asset);
    this.assetService.create(new Asset(
      this.asset.url,
      this.asset.category,
      this.asset.tags,
      this.asset.title,
      this.asset.size,
      this.asset.dimensions,
      this.asset.monochrome,
      this.asset.format)).subscribe(result => {
      console.log('Saved Asset: ', result);
    });
  }

  public saveAsset(): void {
    let data = {
      base64: this.assetService.getBase64(),
      category: this.categories.find(category => category._id == this.asset.category).title,
      fileName: 'test2'
    };

    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.once('resource-saved', (event, fileName) => {
        this.zone.runOutsideAngular(() => {
          console.log('Got a relative path: ', fileName);

          this.zone.runTask(() => {
            this.storeAsset(fileName);
          });
        });
      });

      this.electron.ipcRenderer.send('save-resource', data);
    }
  }

  public setImageData(data: string): void {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(data);
    this.assetService.setBase64(data);
  }

  public setPathData(url: string): void {
    console.log('Image path:', url);
    this.assetService.setImagePath(url);
  }

  public cancel() {
    this.assetService.setBase64(null);
    this.assetService.setImagePath(null);

    this.router.navigate(['']);
  }
}
