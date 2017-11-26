import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeStyle } from '@angular/platform-browser';

import { SketchService, AssetService, CollectionService } from '../../service';
import { Sketch, SketchSeries, Asset, Collection } from '../../model';
import { DomAnchor } from '../../directive/dom-anchor/dom-anchor.directive';

@Component({
  selector: 'sketch-player',
  templateUrl: './sketch-player.html'
})
export class SketchPlayerViewComponent {
  @ViewChild('sketchPlayer') sketchPlayer: ElementRef;

  private sketch: Sketch;
  private sketchId: string;
  private assetsList: Asset[] = [];
  private sketchAssetList: string[] = [];
  private collection: Collection;

  public current: Asset;
  public currentUrl: SafeStyle;
  public currentIndex: number = 0;
  public currentTime: number = 0;
  public currentTimer: number = 30;
  public intervalId: any;
  public monochrome: boolean = false;
  public flipHorizontal: boolean = false;
  public paused: boolean = true;
  public fullscreen: boolean = false;
  public showControl: boolean = false;

  constructor(
    private sketchService: SketchService,
    private assetService: AssetService,
    private collectionService: CollectionService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.sketchId = params.get('id');

      this.getSketch();
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  private getSketch(): void {
    this.sketchService.get(this.sketchId).subscribe(result => {
      this.sketch = result;

      // The Sketch is using a collection as source, so we need the collection.
      switch (this.sketch.assetSource) {
        case 0:
          this.getAssetsListByCategory(this.sketch.assetSourceId);
          break;
        case 1:
          this.getAssetsListByTag(this.sketch.assetSourceId);
          break;
        case 2:
          this.collectionService.get(this.sketch.assetSourceId).subscribe(result => {
            this.collection = result;

            this.getAssetsListByCollection(this.collection);
          });
          break;
      }
    });
  }

  private getAssetsListByCollection(collection: Collection): void {
    let filter = {
      $and: [
        {
          _id: {
            $in: collection.assets
          }
        }
      ]
    };

    this.assetService.filter(filter).subscribe(result => {
      this.assetsList = result;

      this.sketchAssetList = this.generateSketchAssets();
      let series = this.getSeriesByIndex(this.currentIndex);

      this.currentTime = 0;
      this.currentTimer = series.timePerAsset;
      this.monochrome = series.monochrome;
      this.flipHorizontal = series.flipHorizontal;

      this.current = this.assetsList.find(asset => asset._id == this.sketchAssetList[this.currentIndex]);
      this.currentUrl = this.sanitizeStyle(this.current.url);
    });
  }

  private getAssetsListByTag(tagId: string): void {
    let filter = {
      $and: [
        {
          tags: tagId
        }
      ]
    };

    this.assetService.filter(filter).subscribe(result => {
      this.assetsList = result;

      this.sketchAssetList = this.generateSketchAssets();
      let series = this.getSeriesByIndex(this.currentIndex);

      this.currentTime = 0;
      this.currentTimer = series.timePerAsset;
      this.monochrome = series.monochrome;
      this.flipHorizontal = series.flipHorizontal;

      this.current = this.assetsList.find(asset => asset._id == this.sketchAssetList[this.currentIndex]);
      this.currentUrl = this.sanitizeStyle(this.current.url);
    });
  }

  private getAssetsListByCategory(categoryId: string): void {
    let filter = {
      $and: [
        {
          category: categoryId
        }
      ]
    };

    this.assetService.filter(filter).subscribe(result => {
      this.assetsList = result;

      this.sketchAssetList = this.generateSketchAssets();
      let series = this.getSeriesByIndex(this.currentIndex);

      this.currentTime = 0;
      this.currentTimer = series.timePerAsset;
      this.monochrome = series.monochrome;
      this.flipHorizontal = series.flipHorizontal;

      this.current = this.assetsList.find(asset => asset._id == this.sketchAssetList[this.currentIndex]);
      this.currentUrl = this.sanitizeStyle(this.current.url);
    });
  }

  private generateSketchAssets(): string[] {
    let assetSource: string[] = [];
    let sketchAssets: string[] = [];
    let totalNumberAssets: number = 0;
    let generatedAssets: number = 0;

    for (let series of this.sketch.series) {
      totalNumberAssets += series.numberAssets;
    }

    assetSource = this.assetsList.map(asset => asset._id);

    while (totalNumberAssets > generatedAssets) {
      let randomAsset = assetSource.splice(this.getRandomIndex(assetSource.length), 1)[0];

      sketchAssets.push(randomAsset);

      if (assetSource.length == 0) {
        assetSource = this.assetsList.map(asset => asset._id);
      }

      generatedAssets += 1;
    }

    return sketchAssets;
  }

  private getRandomIndex(indices: number): number {
    return Math.floor(Math.random() * indices);
  }

  private getSeriesByIndex(index: number): SketchSeries {
    let assetIndex: number = 0;
    let activeSeries: SketchSeries;

    for (let series of this.sketch.series) {
      assetIndex += series.numberAssets;

      if (index <= assetIndex) {
        activeSeries = series;
        break;
      }
    }

    return activeSeries;
  }

  public updateProgress(): void {
    this.currentTime += 1;

    if (this.currentTime == this.currentTimer) {
      this.nextAsset();
    }
  }

  public play(): void {
    this.intervalId = setInterval(() => {
      this.updateProgress();
    }, 1000);

    this.paused = false;
  }

  public pause(): void {
    clearInterval(this.intervalId);

    this.paused = true;
  }

  public nextAsset(): void {
    this.currentIndex += 1;

    if (this.sketchAssetList.length - 1 < this.currentIndex) {
      this.currentIndex = 0;
    }

    let series = this.getSeriesByIndex(this.currentIndex);

    this.currentTime = 0;
    this.currentTimer = series.timePerAsset;
    this.monochrome = series.monochrome;
    this.flipHorizontal = series.flipHorizontal;

    this.current = this.assetsList.find(asset => asset._id == this.sketchAssetList[this.currentIndex]);
    this.currentUrl = this.sanitizeStyle(this.current.url);
  }

  public previousAsset(): void {
    this.currentIndex -= 1;

    if (this.currentIndex < 0) {
      this.currentIndex = this.sketchAssetList.length - 1;
    }

    let series = this.getSeriesByIndex(this.currentIndex);

    this.currentTime = 0;
    this.currentTimer = series.timePerAsset;
    this.monochrome = series.monochrome;
    this.flipHorizontal = series.flipHorizontal;

    this.current = this.assetsList.find(asset => asset._id == this.sketchAssetList[this.currentIndex]);
    this.currentUrl = this.sanitizeStyle(this.current.url);
  }

  public enterFullscreen(): void {
    this.sketchPlayer.nativeElement.webkitRequestFullscreen();
    this.fullscreen = true;
  }

  public exitFullscreen(): void {
    if (document.webkitIsFullScreen) {
      document.webkitExitFullscreen();
      this.fullscreen = false;
    }
  }

  public exitSketch(): void {
    this.exitFullscreen();
    this.router.navigate(['/sketch']);
  }

  public gotoCurrent(): void {
    this.exitFullscreen();
    this.router.navigate(['/image', this.current._id]);
  }

  public handleKey(event: KeyboardEvent): void {
    console.log('Pressed key: ', event);
    event.preventDefault();
    let keyCode = event.keyCode;

    switch (keyCode) {
      case 27:
        if (this.fullscreen) {
          this.fullscreen = false;
        }
        break;
      case 32:
        if (this.paused) {
          this.play();
        } else {
          this.pause();
        }
        break;
      case 37:
        this.previousAsset();
        break;
      case 39:
        this.nextAsset();
        break;
      case 70:
        if (this.fullscreen) {
          this.exitFullscreen();
        } else {
          this.enterFullscreen();
        }
        break;
    }
  }

  public sanitize(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public sanitizeStyle(url: string): SafeStyle {
    let styleUrl = "url('" + url.replace(/\\/g, '/') + "')";
    return this.sanitizer.bypassSecurityTrustStyle(styleUrl);
  }
}
