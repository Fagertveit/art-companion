import { Component } from '@angular/core';
import { Subscriber, Observable } from 'rxjs';

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
  private subscriber: Subscriber<Notification>;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.notificationService.subject.subscribe(result => {
      this.notification = result;
      this.show = true;

      setTimeout(() => {
        this.show = false;
      }, 5000);
    });
  }

  public closeToast(): void {
    this.show = false;
  }
}
