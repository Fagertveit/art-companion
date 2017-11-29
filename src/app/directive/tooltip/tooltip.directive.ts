import { Directive, Input, ElementRef, HostListener } from '@angular/core';

import { TooltipService } from './tooltip.service';
import { Tooltip } from '../../model';

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective {
  @Input() tooltipText: string;
  @Input() relativeX: number = 10;
  @Input() relativeY: number = -30;

  @HostListener('mouseenter') onMouseEnter(): void {
    let pos = this.el.nativeElement.getBoundingClientRect();
    let tooltip: Tooltip = {
      text: this.tooltipText,
      posX: Math.floor(pos.left) + this.relativeX,
      posY: Math.floor(pos.top) + this.relativeY
    };

    console.log('Tooltip: ', tooltip);
    this.tooltipService.setTooltip(tooltip);
  }
  @HostListener('mouseleave') onMouseLeave(): void {
    this.tooltipService.setTooltip(null);
  }

  constructor(private tooltipService: TooltipService, private el: ElementRef) { }


}
