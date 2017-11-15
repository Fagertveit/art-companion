import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ModalComponent } from '../component/modal/modal.component';

import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'ac-dashboard',
  templateUrl: './dashboard.html'
})
export class DashboardViewComponent {
  @ViewChild(ModalComponent) modal: ModalComponent;

  public toastType: string = 'success';

  constructor(private router: Router, private notification: NotificationService) { }

  public createAsset(): void {
    this.router.navigate(['image/create']);
  }

  public showToast(): void {
    switch(this.toastType) {
      case 'success':
        this.notification.success('Success toast!', 'With a message!');
        break;
      case 'info':
        this.notification.info('Info toast!', 'With a message!');
        break;
      case 'error':
        this.notification.error('Error toast!', 'With a message!');
        break;
      case 'progress':
        this.notification.progress('Progress toast!', 'With a message!', 50);
        break;
      default:
        this.notification.success('Success toast!', 'With a message!');
    }
  }
}
