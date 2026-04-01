import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Auth } from '../../../../core/services/auth';
import { Notification } from '../../../../core/services/notification';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(Auth);
  private readonly notificationService = inject(Notification);

  loading = false;
  errorMessage = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    token: [this.route.snapshot.queryParamMap.get('token') || '', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (value.password !== value.password_confirmation) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.resetPassword({
      email: value.email as string,
      token: value.token as string,
      password: value.password as string,
      password_confirmation: value.password_confirmation as string
    }).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.success('Contraseña restablecida correctamente.');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'No se pudo restablecer la contraseña.';
      }
    });
  }
}
