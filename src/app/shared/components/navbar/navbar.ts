import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Auth } from '../../../core/services/auth';
import { Notification } from '../../../core/services/notification';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly notificationService = inject(Notification);

  isMenuOpen = false;

  get user() {
    return this.authService.currentUser();
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  get isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }

  get isSupport(): boolean {
    return this.authService.hasRole('support');
  }

  get isEmployee(): boolean {
    return this.authService.hasRole('employee');
  }

  get canAccessAdminPanel(): boolean {
    return this.authService.hasAnyRole(['admin', 'employee']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.notificationService.success('Sesión cerrada correctamente.');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.authService.clearAuth();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
