import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { ModalComponent } from '../component/modal/modal.component';
import { ModalConfirmComponent } from '../component/modal/modal-confirm.component';

import { Progress } from '../model';

import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'ac-dashboard',
  templateUrl: './dashboard.html'
})
export class DashboardViewComponent {
  @ViewChild(ModalComponent) modal: ModalComponent;
  @ViewChild(ModalConfirmComponent) confirmModal: ModalConfirmComponent;

  public toastType: string = 'success';
  public progressValue: number = 0;
  public sub: any;
  public subject: Subject<Progress>;
  public rating: number = 7;

  constructor(private router: Router, private notification: NotificationService) { }

  ngOnInit() {
    this.subject = new Subject();
    this.sub = Observable.interval(1000).subscribe(() => {
      if (this.progressValue < 100) {
        this.progressValue += 10;
      } else {
        this.progressValue = 0;
      }

      this.subject.next({maxValue: 100, value: this.progressValue});
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public createAsset(): void {
    this.router.navigate(['image/create']);
  }

  public showToast(): void {
    switch(this.toastType) {
      case 'success':
        this.notification.success('Success toast!', 'With a message!');
        break;
      case 'info':
        this.notification.info('Info toast!', 'Testing the rating component here, current rating is ' + this.rating + '!!!');
        break;
      case 'error':
        this.notification.error('Error toast!', 'With a message!');
        break;
      case 'progress':
        this.notification.progress('Progress toast!', this.subject);
        break;
      default:
        this.notification.success('Success toast!', 'With a message!');
    }
  }

  public modalConfirm(): void {
    this.notification.success('Confirmed!', 'We confirmed the modal action! Yay!');
  }

  public modalCancel(): void {
    this.notification.info('Cancelled', 'We have cancelled the modal action!');
  }
}
