import { Component, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ElectronService } from 'ngx-electron';

import { AssetService } from '../../service/asset.service';
import { CategoryService } from '../../service/category.service';
import { TagService } from '../../service/tag.service';
import { Category, Tag, Asset, ImportedData, Dimension } from '../../model';

@Component({
  selector: 'image-create-view',
  templateUrl: './image-create.html'
})
export class ImageCreateViewComponent {
  public url: SafeResourceUrl;
  public path: string;
  public categories: Category[] = [];
  public tags: Tag[] = [];
  public selectedCategory: Category;
  public selectedTags: Tag[] = [];
  public categoryId: string;
  public tagId: string;
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
    rating: 5,
    format: ''
  };
  public tag: Tag = {
    title: '',
    parentCategory: '',
    parentTag: ''
  };
  public category: Category = {
    title: '',
    icon: '',
  }
  public importedData: ImportedData;

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
    });

    if (this.assetService.haveImport()) {
      this.importedData = this.assetService.getImportedData();
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.importedData.base64);
      this.path = this.importedData.url;
    }
  }

  public getCategoryIcon(icon: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(icon);
  }

  public setCategory(category: Category): void {
    this.selectedTags = [];
    this.tagId = null;
    this.selectedCategory = category;
    this.getTags();
  }

  public createCategory(): void {
    this.category._id = this.category.title.toLowerCase().replace(' ', '_');

    this.categoryService.create(this.category).subscribe(result => {
      this.category = {
        title: '',
        icon: ''
      };

      delete this.category._id;

      this.categories.push(result);

      this.selectedCategory = this.categories.find(cat => cat._id == result._id);
      this.getTags();
    });
  }

  public setTag(tag: Tag): void {
    this.selectedTags.push(tag);
    this.tagId = tag._id;
    this.getTags();
  }

  public getTags(): void {
    let filter;

    this.tags = [];

    if (this.tagId) {
      filter = {
        parentTag: this.tagId
      };
    } else {
      filter = {
        parentCategory: this.selectedCategory._id
      };
    }

    this.tagService.filter(filter).subscribe(result => {
      this.tags = result;
    });
  }

  public createTag(): void {
    if (this.tagId) {
      this.tag.parentTag = this.tagId;
      this.tag._id = this.tagId + '-' + this.tag.title.toLowerCase().replace(' ', '_');
    } else {
      this.tag.parentCategory = this.selectedCategory._id;
      this.tag._id = this.selectedCategory._id + '-' + this.tag.title.toLowerCase().replace(' ', '_');
    }

    this.tagService.create(this.tag).subscribe(result => {
      this.selectedTags.push(result);
      this.tagId = result._id;
      // We don't have any subtags of newly created tags, so we can reset the array
      this.tags = [];
      this.tag = {
        title: '',
        parentCategory: '',
        parentTag: '',
      }

      delete this.tag._id;
    });
  }

  public toggleTag(selectedTag: Tag): void {
    this.selectedTags = this.selectedTags.splice(0, this.selectedTags.indexOf(selectedTag));

    if (this.selectedTags.length > 0) {
      this.tagId = this.selectedTags[this.selectedTags.length - 1]._id;
    } else {
      this.tagId = null;
    }

    this.getTags();
  }

  public updateAsset(path: string, thumbPath: string, size: Dimension, fileSize: number, fileType: string): void {
    this.asset.url = path;
    this.asset.thumbnail = thumbPath;
    this.asset.title = this.importedData.filename;
    this.asset.category = this.selectedCategory._id;
    this.asset.tags = this.selectedTags.map(tag => tag._id);
    this.asset.dimensions = size;
    this.asset.format = fileType;
    this.asset.size = fileSize;

    this.assetService.update(this.asset).subscribe(result => {
      this.assetService.clearImportedData();

      this.router.navigate(['/image', this.asset._id]);
    });
  }

  public storeAsset(): void {
    this.assetService.create(this.asset).subscribe(result => {
      this.asset = result;

      this.saveAsset();
    });
  }

  public saveAsset(): void {
    let data = {
      base64: this.importedData.base64,
      category: this.selectedCategory.title,
      tags: this.selectedTags.map(tag => tag.title).join('/'),
      filename: this.importedData.filename,
      id: this.asset._id
    };

    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.once('resource-created', (event, data) => {
        this.zone.runTask(() => {
          this.updateAsset(data.url, data.thumbUrl, data.imageSize, data.fileSize, data.fileFormat);
        });
      });

      this.electron.ipcRenderer.send('create-resource', data);
    }
  }

  public setImageData(data: string): void {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(data);
    this.importedData.base64 = data;
  }

  public setPathData(url: string): void {
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
