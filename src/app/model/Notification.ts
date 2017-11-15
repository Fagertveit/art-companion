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
  message: string;
  image?: string;
  progress?: number;
}
