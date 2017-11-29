import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Asset } from '../../model';

@Component({
  selector: 'coverflow',
  templateUrl: './coverflow.html'
})
export class CoverflowComponent {
  @Input() assets: Asset[] = [];

  public viewAssets: Asset[] = [];
  public index: number = 0;
  public numView: number = 5;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.assets && this.assets.length != 0) {
      this.setViewAssets(this.index);
    }
  }

  public sanitize(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public setViewAssets(index: number): void {
    this.viewAssets = this.assets.slice(index, index + this.numView);
  }

  public next(): void {
    this.index += 1;
    this.setViewAssets(this.index);
  }

  public previous(): void {
    this.index -= 1;
    this.setViewAssets(this.index);
  }
}
