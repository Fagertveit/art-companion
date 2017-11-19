import { Pipe } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe {
  transform(value: number): string {
    let inKb = (value / 1024);
    let inMb = (value / 1024) / 1024;

    if (inMb > 1) {
      return '' + inMb.toFixed(2) + 'Mb';
    } else {
      return '' + inKb.toFixed() + 'Kb';
    }
  }
}
