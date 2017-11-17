import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalEventService } from './service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    private router: Router,
    private globalEventService: GlobalEventService
  ) { }

  ngOnInit() { }

  public navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
