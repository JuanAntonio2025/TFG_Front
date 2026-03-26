import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Auth } from '../../../../core/services/auth';
import { Notification } from '../../../../core/services/notification';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(Auth);
  private readonly notificationService = inject(Notification);

  loading = false;
  submitting = false;
  errorMessage = '';

  profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    email: ['', [Validators.required, Validators.email]],
    current_password: [''],
    new_password: ['', [Validators.minLength(8)]],
    new_password_confirmation: ['']
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.profile().subscribe({
      next: (response) => {
        this.loading = false;
        this.profileForm.patchValue({
          name: response.data.name,
          email: response.data.email
        });
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo cargar el perfil.';
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const value = this.profileForm.getRawValue();

    if (value.new_password && value.new_password !== value.new_password_confirmation) {
      this.errorMessage = 'La nueva contraseña y su confirmación no coinciden.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    this.authService.updateProfile({
      name: value.name as string,
      email: value.email as string,
      current_password: value.current_password || undefined,
      new_password: value.new_password || undefined,
      new_password_confirmation: value.new_password_confirmation || undefined
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.notificationService.success('Perfil actualizado correctamente.');
        this.profileForm.patchValue({
          current_password: '',
          new_password: '',
          new_password_confirmation: ''
        });
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage = error?.error?.message || 'No se pudo actualizar el perfil.';
      }
    });
  }

  get name() {
    return this.profileForm.get('name');
  }

  get email() {
    return this.profileForm.get('email');
  }

  get newPassword() {
    return this.profileForm.get('new_password');
  }
}
