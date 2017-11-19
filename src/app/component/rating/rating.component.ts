import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

interface Star {
  class: string;
  index: number;
}

@Component({
  selector: 'rating',
  templateUrl: './rating.html'
})
export class RatingComponent implements OnChanges {
  @Input() rating: number = 5;
  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();

  private trackedRating: number;

  public stars: Star[] = [
    { index: 0, class: 'star-full' },
    { index: 1, class: 'star-full' },
    { index: 2, class: 'star-full' },
    { index: 3, class: 'star-full' },
    { index: 4, class: 'star-full' }
  ];

  ngOnInit() {
    this.setStars(this.rating);
  }

  ngOnChanges(changes: any) {
    this.setStars(this.rating);
  }

  private setStars(rating: number) {
    let fullStars = Math.floor(rating / 2);
    let halfStar = rating % 2;

    for (let star of this.stars) {
      if (star.index < fullStars) {
        star.class = 'star-full';
      } else if (star.index == fullStars && halfStar == 1) {
        star.class = 'star-half';
      } else {
        star.class = 'star-empty';
      }
    }
  }

  public trackRating(ev: MouseEvent, star: number): void {
    let srcElement: Element = ev.srcElement;
    let offsetX: number = ev.offsetX;
    let width: number;
    let starRating: number = 1;


    width = srcElement.clientWidth;

    if (offsetX > width / 2) {
      starRating = 2;
    }

    this.trackedRating = star * 2 + starRating;
    this.setStars(this.trackedRating);
  }

  public setRating(): void {
    this.rating = this.trackedRating;
    this.setStars(this.rating);
    this.ratingChange.emit(this.rating);
  }
}
