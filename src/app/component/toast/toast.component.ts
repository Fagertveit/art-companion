import { Component } from '@angular/core';
import { Subscriber, Observable, Subscription } from 'rxjs';

import { NotificationService } from '../../service/notification.service';

import { Notification, NotificationType } from '../../model';

@Component({
  selector: 'toast',
  templateUrl: './toast.html'
})
export class ToastComponent {
  public notification: Notification;
  public show: boolean = true;
  public types: NotificationType;

  public maxValue: number;
  public value: number;
  private progressSub: Subscription;

  private subscriber: Subscriber<Notification>;
  private timer: Subscription;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.notificationService.subject.subscribe(result => {
      this.notification = result;
      this.show = true;

      if (this.notification.type == NotificationType.PROGRESS) {
        this.progressSub = this.notification.progress.subscribe(values => {

          this.maxValue = values.maxValue;
          this.value = values.value;

          if (values.maxValue == values.value) {
            this.timer = Observable.timer(1000).subscribe(() => {
              this.closeToast();
            });
          }
        });
      } else {
        this.timer = Observable.timer(5000).subscribe(() => {
          this.show = false;
        });
      }
    });
  }

  public closeToast(): void {
    if (this.notification.type == NotificationType.PROGRESS) {
      this.progressSub.unsubscribe();
    } else {
      this.timer.unsubscribe();
    }

    this.show = false;
  }
}
