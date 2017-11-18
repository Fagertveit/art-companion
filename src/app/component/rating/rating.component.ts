import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Star {
  svg: string;
}

@Component({
  selector: 'rating',
  templateUrl: './rating.html'
})
export class RatingComponent {
  @Input() rating: number;
  @Output() ratingChanged: EventEmitter<number> = new EventEmitter<number>();

  public stars: Star[] = [
    { svg: 'assets/svg/full-star.svg' },
    { svg: 'assets/svg/full-star.svg' },
    { svg: 'assets/svg/full-star.svg' },
    { svg: 'assets/svg/full-star.svg' },
    { svg: 'assets/svg/full-star.svg' }
  ];

  ngOnInit() {

  }


}
