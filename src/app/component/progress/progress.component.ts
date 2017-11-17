import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress.html'
})
export class ProgressComponent implements OnChanges {
  @Input() maxValue: number;
  @Input() value: number;

  public percent: SafeStyle = '100&';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.calculateBar();
  }

  ngOnChanges(changes: any) {
    this.calculateBar();
  }

  private calculateBar(): void {
    let percentage = (this.value / this.maxValue) * 100;

    this.percent = this.sanitizer.bypassSecurityTrustStyle('' + percentage + '%');
  }
}
