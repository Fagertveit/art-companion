import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ModalConfirmComponent } from '../../component/modal/modal-confirm.component';
import { SketchFormComponent } from './sketch-form.component';

import { Sketch } from '../../model';
import { SketchService } from '../../service';

@Component({
  selector: 'sketch-setup',
  templateUrl: './sketch-setup.html'
})
export class SketchSetupViewComponent {
  @ViewChild('createSketchModal') createSketchModal: ModalConfirmComponent;
  @ViewChild('editSketchModal') editSketchModal: ModalConfirmComponent;
  @ViewChild('createSketchForm') createSketchForm: SketchFormComponent;
  @ViewChild('editSketchForm') editSketchForm: SketchFormComponent;

  public sketches: Sketch[] = [];
  public newSketch: Sketch = {
    title: '',
    assetSource: 0,
    assetSourceId: null,
    series: []
  };
  public editSketch: Sketch;

  constructor(
    private sketchService: SketchService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getSketches();
  }

  public getSketches(): void {
    this.sketchService.list().subscribe(result => {
      this.sketches = result;
    });
  }

  public clearSketch(): void {
    this.newSketch = {
      title: '',
      assetSource: 0,
      assetSourceId: null,
      series: []
    };

    delete this.newSketch._id;
  }

  public clearEditSketch(): void {
    this.editSketch = null;
  }

  public openEditSketch(sketch: Sketch): void {
    this.editSketch = sketch;
    this.editSketchModal.open();
  }

  public openCreateSketch(): void {
    this.createSketchModal.open();
  }

  public createSketch(sketch: Sketch): void {
    this.sketchService.create(sketch).subscribe(result => {
      this.getSketches();
    });
  }

  public updateSketch(sketch: Sketch): void {
    this.sketchService.update(sketch).subscribe(result => {
      this.getSketches();
    });
  }

  public deleteSketch(sketch: Sketch): void {
    this.sketchService.remove(sketch._id).subscribe(result => {
      this.getSketches();
    });
  }

  public gotoSketch(sketch: Sketch): void {
    this.router.navigate(['/sketch', sketch._id]);
  }
}
