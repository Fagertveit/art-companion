import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';

import { Observable } from 'rxjs';

@Component({
  selector: 'slider',
  templateUrl: 'slider.html'
})
export class SliderComponent {
  @Input() horizontal: boolean = true;

  public mousedown$: Observable<MouseEvent>;
  public mousemove$: Observable<MouseEvent>;
  public mouseup$: Observable<MouseEvent>;
  public mousedrag$: Observable<{x: number, y: number}>;

  private sliderBarEl: HTMLDivElement;
  private sliderHandleEl: HTMLDivElement;
  private sliderContainerEl: HTMLDivElement;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.sliderContainerEl = this.el.nativeElement.firstElementChild as HTMLDivElement;
    this.sliderBarEl = this.sliderContainerEl.firstElementChild as HTMLDivElement;
    this.sliderHandleEl = this.sliderBarEl.firstElementChild as HTMLDivElement;

    this.mousedown$ = Observable.fromEvent(this.sliderHandleEl, 'mousedown');
    this.mousemove$ = Observable.fromEvent(document, 'mousemove');
    this.mouseup$ = Observable.fromEvent(document, 'mouseup');

    this.mousedrag$ = this.mousedown$.flatMap((event: MouseEvent) => {
      this.mousemove$.take(1).subscribe(() => {
        if (!this.sliderHandleEl.classList.contains('dragging')) {
          this.sliderHandleEl.classList.add('dragging');
        }
      });

      return this.mousemove$.map((moveEvent: MouseEvent) => {
        moveEvent.preventDefault();
        console.log('Event Offset', moveEvent.y, 'Client', moveEvent.clientY, 'El', this.sliderHandleEl.getBoundingClientRect().top - this.sliderBarEl.getBoundingClientRect().top)

        let dX = moveEvent.clientX - event.offsetX - this.sliderBarEl.offsetLeft;
        let dY = moveEvent.clientY - event.offsetY - this.sliderBarEl.offsetTop + this.sliderHandleEl.getBoundingClientRect().top;

        return ({ x: dX, y: dY });
      }).takeUntil(this.mouseup$);
    });

    this.mouseup$.subscribe(result => {
      this.sliderHandleEl.classList.remove('dragging');
    });

    this.mousedrag$.subscribe(result => {
      this.moveElement(result.x, result.y);
    });
  }

  private moveElement(x: number, y: number) {
    console.log('Pos: ', x, y);
    if (this.horizontal) {
      if (x < -4) {
        x = -4;
      }

      if (x > this.sliderBarEl.clientWidth - 16) {
        x = this.sliderBarEl.clientWidth - 16;
      }

      this.sliderHandleEl.style.left = x + 'px';
    } else {
      if (y < -4) {
        y = -4;
      }

      if (y > this.sliderBarEl.clientHeight - 16) {
        y = this.sliderBarEl.clientHeight - 16;
      }

      this.sliderHandleEl.style.top = y + 'px';
    }
  }
}
