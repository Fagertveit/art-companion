import { Pipe } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe {
  transform(value: number) {
    if (value < 60) {
      return '' + value + ' Seconds';
    } else if (value < 3600) {
      let minutes = Math.floor(value / 60);
      let seconds = value % 60;

      if (seconds != 0) {
        return '' + Math.floor(value / 60) + ' Minutes ' + seconds + ' Seconds';
      }

      return '' + Math.floor(value / 60) + ' Minutes';
    } else {
      let hours = Math.floor(value / 3600);
      let minutes = Math.floor((value % 3600) / 60);
      let seconds = ((value % 3600) % 60);

      if (minutes != 0) {
        if (seconds != 0) {
          return '' + hours + ' Hours ' + minutes + ' Minutes ' + seconds + ' Seconds';
        } else {
          return '' + hours + ' Hours ' + minutes + ' Minutes';
        }
      } else {
        if (seconds != 0) {
          return '' + hours + ' Hours ' + minutes + ' Minutes ' + seconds + ' Seconds';
        }

        return '' + hours + ' Hours';
      }
    }
  }
}
