import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { StatusBarService } from '../../service/status-bar.service';

@Component({
  selector: 'status-bar',
  templateUrl: './status-bar.html'
})
export class StatusBarComponent {
  public hidden$: Observable<boolean>;
  public libraryCount$: Observable<number>;
  public areaCount$: Observable<number>;

  constructor(private statusBarService: StatusBarService) { }

  ngOnInit() {
    this.libraryCount$ = this.statusBarService.getLibraryCount();
    this.areaCount$ = this.statusBarService.getAreaCount();
    this.hidden$ = this.statusBarService.getHidden();
  }
}
