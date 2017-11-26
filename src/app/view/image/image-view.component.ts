import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeStyle } from '@angular/platform-browser';
import { ElectronService } from 'ngx-electron';

import { ModalConfirmComponent } from '../../component/modal/modal-confirm.component';
import { ModalComponent } from '../../component/modal/modal.component';

import { AssetService, TagService, CategoryService, SettingsService, NotificationService, CollectionService } from '../../service';
import { Asset, Category, Tag, Collection } from '../../model';

@Component({
  selector: 'ac-image-view',
  templateUrl: './image.html'
})
export class ImageViewComponent {
  @ViewChild('deleteModal') deleteModal: ModalConfirmComponent;
  @ViewChild('editTagsModal') editTagsModal: ModalConfirmComponent;

  @ViewChild(HTMLImageElement) imageRef: HTMLImageElement;
  @ViewChild(HTMLDivElement) grid: HTMLDivElement

  public asset: Asset;
  public category: Category;
  public tags: Tag[];
  public allTags: Tag[];
  public tag: Tag = {
    title: '',
  };
  public selectedTags: Tag[] = [];
  public collections: Collection[] = [];
  public availableCollections: Collection[] = [];
  public collectionList: Collection[] = [];
  public selectedCollection: Collection;
  public showMetadata: boolean = true;
  public monochrome: boolean = false;
  public flipHorizontal: boolean = false;
  public tagId: string;
  public tmpTagId: string;
  public sanitizedImageUrl: SafeStyle;

  constructor(
    private assetService: AssetService,
    private tagService: TagService,
    private categoryService: CategoryService,
    private notification: NotificationService,
    private settingsService: SettingsService,
    private collectionService: CollectionService,
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
      this.allTags = data[0].tags;
      this.tags = data[0].tags;
      this.collectionList = data[0].collections;

      this.sanitizedImageUrl = this.sanitizeStyle(this.asset.url);
      this.selectedTags = this.tags.filter(tag => this.asset.tags.indexOf(tag._id) != -1);
      this.tagId = this.asset.tags[this.asset.tags.length - 1];
      this.getTags();
      this.getCollections();
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

  public sanitizeStyle(url: string): SafeStyle {
    let styleUrl = "url('" + url.replace(/\\/g, '/') + "')";
    return this.sanitizer.bypassSecurityTrustStyle(styleUrl);
  }

  public editTags(): void {
    this.getTags();
    this.tmpTagId = this.tagId;
    this.editTagsModal.open();
  }

  public confirmDelete(): void {
    this.deleteModal.open();
  }

  public cancelEditTags(): void {
    this.tagId = this.tmpTagId;
    this.selectedTags = this.allTags.filter(tag => this.asset.tags.indexOf(tag._id) != -1);
    this.getTags();
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
        parentCategory: this.asset.category
      };
    }

    this.tagService.filter(filter).subscribe(result => {
      this.tags = result;
    });
  }

  public getCollections(): void {
    this.collectionService.filter({ assets: this.asset._id }).subscribe(result => {
      this.collections = result;

      this.availableCollections = this.collectionList.filter(collection => {
        return this.collections.find(col => col._id == collection._id) == null;
      });

      if (this.availableCollections.length > 0) {
        this.selectedCollection = this.availableCollections[0];
      }
    });
  }

  public removeFromCollection(collection: Collection): void {
    let index = collection.assets.indexOf(this.asset._id);

    collection.assets.splice(index, 1);

    this.collectionService.update(collection).subscribe(result => {
      this.getCollections();
    });
  }

  public addToCollection(collection: Collection): void {
    this.selectedCollection.assets.push(this.asset._id);

    this.collectionService.update(this.selectedCollection).subscribe(result => {
      this.getCollections();
    });
  }

  public gotoCollection(collection: Collection): void {
    this.router.navigate(['/collection', collection._id]);
  }

  public createTag(): void {
    if (this.tagId) {
      this.tag.parentTag = this.tagId;
      this.tag._id = this.tagId + '-' + this.tag.title.toLowerCase().replace(' ', '_');
    } else {
      this.tag.parentCategory = this.asset.category;
      this.tag._id = this.asset.category + '-' + this.tag.title.toLowerCase().replace(' ', '_');
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

  public updateAsset(): void {
    let updatedPath: any = {
      dest: this.settingsService.getLibraryPath() + '/' + this.category.title + '/' + this.selectedTags.map(tag => tag.title).join('/') + '/' + this.asset.title,
      destDir: this.settingsService.getLibraryPath() + '/' + this.category.title + '/' + this.selectedTags.map(tag => tag.title).join('/'),
      src: this.asset.url
    };

    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.once('resource-updated', (event, data) => {
        this.zone.runTask(() => {
          this.asset.url = data.destination;
          this.asset.tags = this.selectedTags.map(tag => tag._id);

          this.assetService.update(this.asset).subscribe(result => {
            this.notification.success('Image tags updated', 'The image tags has been updated, file has been moved.');
          });
        });
      });

      this.electron.ipcRenderer.send('update-resource', updatedPath);
    }
  }
}
