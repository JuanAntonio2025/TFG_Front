import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

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

    const payload = {
      email: this.loginForm.value.email as string,
      password: this.loginForm.value.password as string
    };

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.loading = false;

        const roles = response.user.roles?.map(role => role.name) ?? [];

        if (roles.includes('admin')) {
          this.router.navigate(['/admin']);
          return;
        }

        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;

        if (error?.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error?.error?.errors?.email?.length) {
          this.errorMessage = error.error.errors.email[0];
        } else {
          this.errorMessage = 'An unexpected error occurred while logging in.';
        }
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
