import { Component, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ElectronService } from 'ngx-electron';

import { AssetService } from '../../service/asset.service';
import { CategoryService } from '../../service/category.service';
import { TagService } from '../../service/tag.service';
import { Category, Tag, Asset, ImportedData } from '../../model';

@Component({
  selector: 'ac-image-create-view',
  templateUrl: './image-create.html'
})
export class ImageCreateViewComponent {
  public url: SafeResourceUrl;
  public path: string;
  public categories: Category[] = [];
  public tags: Tag[] = [];
  public asset: Asset = {
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
    format: ''
  };
  public importedData: ImportedData;
  public selectedCategory: Category;

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
      this.categories = data[0].categories as Category[];
      this.tags = data[0].tags as Tag[];
    });

    if (this.assetService.haveImport()) {
      this.importedData = this.assetService.getImportedData();
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.importedData.base64);
      this.path = this.importedData.url;
      console.log('Imported data: ', this.importedData);
    }
  }

  public getCategoryIcon(icon: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(icon);
  }

  public setCategory(category: Category): void {
    this.selectedCategory = category;
    this.saveAsset();
  }

  public storeAsset(path: string): void {
    this.asset.url = path;
    this.asset.title = this.importedData.filename;
    this.asset.category = this.selectedCategory._id;

    console.log('Storing asset: ', this.asset);
    this.assetService.create(this.asset).subscribe(result => {
      console.log('Saved Asset: ', result);
      this.assetService.clearImportedData();

      this.router.navigate(['/image', result._id]);
    });
  }

  public saveAsset(): void {
    let data = {
      base64: this.importedData.base64,
      category: this.selectedCategory.title,
      filename: this.importedData.filename
    };

    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.once('resource-saved', (event, filename) => {
        this.zone.runOutsideAngular(() => {
          console.log('Got a relative path: ', filename);

          this.zone.runTask(() => {
            this.storeAsset(filename);
          });
        });
      });

      console.log('Saving data: ', data);
      this.electron.ipcRenderer.send('save-resource', data);
    }
  }

  public setImageData(data: string): void {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(data);
    this.importedData.base64 = data;
  }

  public setPathData(url: string): void {
    console.log('Image path:', url);
    let path = url;
    let pathArr = url.split('/');
    let filename = pathArr[pathArr.length - 1];

    this.importedData.url = url;
    this.importedData.filename = filename;
  }

  public cancel() {
    this.assetService.clearImportedData();

    this.router.navigate(['']);
  }
}
