import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { Notification } from '../../../core/services/notification';

@Component({
  selector: 'app-app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-notification.html',
  styleUrl: './app-notification.scss',
})
export class AppNotification {
  readonly notificationService = inject(Notification);
}
