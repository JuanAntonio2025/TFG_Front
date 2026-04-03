import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly authService = inject(Auth);

  get isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }

  get isEmployee(): boolean {
    return this.authService.hasRole('employee');
  }
}
