import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { TooltipService } from './tooltip.service';
import { Tooltip } from '../../model';

@Component({
  selector: 'tooltip-content',
  templateUrl: './tooltip.html'
})
export class TooltipComponent {
  public tooltip: Tooltip;
  public hidden: boolean = true;

  constructor(private tooltipService: TooltipService) { }

  ngOnInit() {
    this.tooltipService.getTooltip().subscribe(result => {
      if (result) {
        this.tooltip = result;
        this.hidden = false;
      } else {
        this.hidden = true;
      }
    });
  }
}
