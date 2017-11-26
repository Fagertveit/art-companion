import { Pipe } from '@angular/core';

import { SketchSeries } from '../model';

@Pipe({
  name: 'totalTime'
})
export class TotalTimePipe {
  transform (value: SketchSeries[]) {
    let totalSeconds: number = 0;

    for (let series of value) {
      totalSeconds += series.timePerAsset * series.numberAssets;
    }

    return totalSeconds;
  }
}
