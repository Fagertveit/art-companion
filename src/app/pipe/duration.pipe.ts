import { Pipe } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe {
  transform(value: number) {
    if (value < 60) {
      return '' + value + ' Seconds';
    } else {
      let minutes = Math.floor(value / 60);
      let seconds = value % 60;

      if (seconds != 0) {
        return '' + Math.floor(value / 60) + ' Minutes ' + seconds + ' Seconds';
      }

      return '' + Math.floor(value / 60) + ' Minutes';
    }
  }
}
