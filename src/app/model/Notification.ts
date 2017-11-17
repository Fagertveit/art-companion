import { Progress } from './Progress';
import { Subject } from 'rxjs';

export const enum NotificationType {
  SUCCESS,
  INFO,
  ERROR,
  PROGRESS,
  CLIPBOARD
}

export interface Notification {
  type: number;
  title: string;
  message?: string;
  image?: string;
  progress?: Subject<Progress>;
}
