import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Auth } from '../../../../core/services/auth';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { GuestCart } from '../../../../core/services/guest-cart';
import { Cart } from '../../../cart/services/cart';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly guestCartService = inject(GuestCart);
  private readonly cartService = inject(Cart);

  loading = false;
  errorMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = this.loginForm.getRawValue();

    this.authService.login({
      email: payload.email as string,
      password: payload.password as string
    }).subscribe({
      next: () => {
        this.loading = false;
        this.mergeGuestCart();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'No se pudo iniciar sesión.';
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  private mergeGuestCart(): void {
    const guestItems = this.guestCartService.getItems();

    if (guestItems.length === 0) {
      this.redirectAfterLogin();
      return;
    }

    const requests = guestItems.map(bookId =>
      this.cartService.addItem(bookId).pipe(
        catchError(() => of(null))
      )
    );

    forkJoin(requests).subscribe({
      next: () => {
        this.guestCartService.clear();
        this.redirectAfterLogin();
      },
      error: () => {
        this.guestCartService.clear();
        this.redirectAfterLogin();
      }
    });
  }

  private redirectAfterLogin(): void {
    const postLoginRedirect = localStorage.getItem('post_login_redirect');

    if (postLoginRedirect) {
      localStorage.removeItem('post_login_redirect');
      this.router.navigate([postLoginRedirect]);
      return;
    }

    if (this.authService.hasRole('admin') || this.authService.hasRole('employee')) {
      this.router.navigate(['/admin']);
      return;
    }

    if (this.authService.hasRole('support')) {
      this.router.navigate(['/admin/incidences']);
      return;
    }

    this.router.navigate(['/']);
  }
}
