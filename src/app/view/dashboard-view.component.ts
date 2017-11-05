import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ac-dashboard',
  templateUrl: './dashboard.html'
})
export class DashboardViewComponent {
  constructor(private router: Router) { }

  public createAsset(): void {
    this.router.navigate(['image/create']);
  }
}
