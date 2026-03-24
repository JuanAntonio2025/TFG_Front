import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface AppNotification {
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root',
})
export class Notification {
  notification = signal<AppNotification | null>(null);

  show(message: string, type: NotificationType = 'info'): void {
    this.notification.set({ message, type });

    setTimeout(() => {
      this.clear();
    }, 3000);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  clear(): void {
    this.notification.set(null);
  }
}
