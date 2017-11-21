import { Component, ViewChild } from '@angular/core';

import { ModalConfirmComponent } from '../../component/modal/modal-confirm.component';
import { Sketch, SketchSeries } from '../../model';

@Component({
  selector: 'sketch-setup',
  templateUrl: './sketch-setup.html'
})
export class SketchSetupViewComponent {
  @ViewChild('createSketch') createSketch: ModalConfirmComponent;

  public sketches: Sketch[] = [];
  public newSketch: Sketch = {
    title: '',
    assetSource: 0,
    assetSourceId: '',
    series: []
  };
  public newSeries: SketchSeries = {
    timePerAsset: 30,
    numberAssets: 3,
    flipHorizontal: false,
    monochrome: false,
    grid: false
  };

  constructor() { }

  public openCreateSketch(): void {
    this.createSketch.open();
  }

  public setSourceType(type: number): void {
    this.newSketch.assetSource = type;
  }
}
