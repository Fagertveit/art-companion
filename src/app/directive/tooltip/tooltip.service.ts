import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { Tooltip } from '../../model';

@Injectable()
export class TooltipService {
  private tooltip: Subject<Tooltip> = new Subject<Tooltip>();

  constructor() { }

  public getTooltip(): Observable<Tooltip> {
    return this.tooltip.asObservable();
  }

  public setTooltip(tooltip: Tooltip): void {
    this.tooltip.next(tooltip);
  }
}
