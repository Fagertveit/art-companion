import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Notification, NotificationType } from '../model';

@Injectable()
export class NotificationService {
  public activeNotification: Notification;
  public timeToLive: number = 5000;

  public subject: Subject<Notification> = new Subject<Notification>();

  public success(title: string, message: string): void {
    let notification: Notification = {
      title: title,
      message: message,
      type: NotificationType.SUCCESS
    };

    this.subject.next(notification);
  }

  public info(title: string, message: string): void {
    let notification: Notification = {
      title: title,
      message: message,
      type: NotificationType.INFO
    };

    this.subject.next(notification);
  }

  public error(title: string, message: string): void {
    let notification: Notification = {
      title: title,
      message: message,
      type: NotificationType.ERROR
    };

    this.subject.next(notification);
  }

  public progress(title: string, message: string, progress: number): void {
    let notification: Notification = {
      title: title,
      message: message,
      progress: progress,
      type: NotificationType.PROGRESS
    };

    this.subject.next(notification);
  }

  public clipboard(title: string, message: string, image: string): void {
    let notification: Notification = {
      title: title,
      message: message,
      type: NotificationType.CLIPBOARD
    };

    this.subject.next(notification);
  }
}
