import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {RouterLink, RouterModule} from '@angular/router';

import { Auth } from '../../../../core/services/auth';
import { Notification } from '../../../../core/services/notification';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(Auth);
  private readonly notificationService = inject(Notification);

  loading = false;
  errorMessage = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.forgotPassword({
      email: this.form.getRawValue().email as string
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.notificationService.success('Si el correo existe, se han enviado instrucciones de recuperación.');
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'No se pudo procesar la solicitud.';
      }
    });
  }
}
