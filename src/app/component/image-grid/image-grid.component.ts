import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AssetService, NotificationService } from '../../service';
import { Asset, Selectable } from '../../model';

@Component({
  selector: 'image-grid',
  templateUrl: './image-grid.html'
})
export class ImageGridComponent {
  @Input() filter: any = {};

  @Output() onSelect: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() onNavigate: EventEmitter<string> = new EventEmitter<string>();
  @Output() totalAssets: EventEmitter<number> = new EventEmitter<number>();

  public assets: Selectable<Asset>[] = [];
  public limit: number = 30;
  public page: number = 0;
  public showRatings: boolean = false;
  public showSelection: boolean = false;
  public scrollCooldown: boolean = false;

  constructor(
    private assetService: AssetService,
    private notification: NotificationService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.filter) {
      this.page = 0;
      this.assets = [];
      this.getAssets();
    }
  }

  public sanitize(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public toggleRatings(): void {
    this.showRatings = !this.showRatings;
  }

  public toggleSelection(): void {
    this.showSelection = !this.showSelection;
  }

  public gotoImage(asset: Selectable<Asset>): void {
    if (this.showSelection) {
      asset.selected = !asset.selected;
      this.onSelect.emit(this.assets.filter(asset => asset.selected).map(asset => asset.item._id));
    } else {
      this.onNavigate.emit(asset.item._id);
    }
  }

  public setRating(id: string, rating: number) {
    this.assetService.setRating(id, rating).subscribe(result => {
      this.notification.info('Rating updated!', 'Rating for the image has been updated!');
    });
  }

  public onScroll(): void {
    if (!this.scrollCooldown) {
      this.scrollCooldown = true;
      this.page += 1;

      this.getAssets();
    }
  }

  public getAssets(): void {
    this.assetService.filterPage(this.filter, this.page, this.limit).subscribe(result => {
      this.assets = this.assets.concat(result.map(asset => {
        return { item: asset, selected: false };
      }));

      this.scrollCooldown = false;
    });

    this.assetService.filterCount(this.filter).subscribe(result => {
      this.totalAssets.emit(result);
    });
  }
}
