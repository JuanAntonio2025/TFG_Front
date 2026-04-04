import { CommonModule } from '@angular/common';
import { Component, inject, HostListener, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Auth } from '../../../core/services/auth';
import { Notification } from '../../../core/services/notification';
import { GuestCart } from '../../../core/services/guest-cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly authService = inject(Auth);
  private readonly guestCartService = inject(GuestCart);
  private readonly router = inject(Router);

  dropdownOpen = signal(false);
  mobileMenuOpen = signal(false);

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }

  get isEmployee(): boolean {
    return this.authService.hasRole('employee');
  }

  get isSupport(): boolean {
    return this.authService.hasRole('support');
  }

  get isCustomer(): boolean {
    return this.authService.hasRole('customer');
  }

  get hasClientFeatures(): boolean {
    return this.authService.hasAnyRole(['customer', 'employee', 'admin']);
  }

  get canAccessAdminPanel(): boolean {
    return this.authService.hasAnyRole(['admin', 'employee']);
  }

  get canAccessSupportPanel(): boolean {
    return this.authService.hasAnyRole(['admin', 'support']);
  }

  get cartCount(): number {
    if (this.isLoggedIn) {
      return 0;
    }

    return this.guestCartService.count();
  }

  toggleDropdown(): void {
    this.dropdownOpen.update(value => !value);
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.closeDropdown();
    this.closeMobileMenu();

    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.router.navigate(['/']);
      }
    });
  }

  onNavigate(): void {
    this.closeDropdown();
    this.closeMobileMenu();
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.user-menu')) {
      this.closeDropdown();
    }
  }
}
