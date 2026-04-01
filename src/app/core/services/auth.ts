import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { Storage } from './storage';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly storageService = inject(Storage);

  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;

  private readonly currentUserSignal = signal<User | null>(this.storageService.getUser());

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  register(payload: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap((response) => {
        this.storageAuth(response.token, response.user);
      })
    );
  }

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => {
        this.storageAuth(response.token, response.user);
      })
    );
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearAuth();
      })
    );
  }

  me(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap((user) => {
        this.storageService.setUser(user);
        this.currentUserSignal.set(user);
      })
    );
  }

  profile() {
    return this.http.get<{ data: User }>(`${this.apiUrl.replace('/auth', '')}/profile`).pipe(
      tap((response) => {
        this.storageService.setUser(response.data);
        this.currentUserSignal.set(response.data);
      })
    );
  }

  updateProfile(payload: {
    name: string;
    email: string;
    current_password?: string;
    new_password?: string;
    new_password_confirmation?: string;
  }) {
    return this.http.put<{ message: string; data: User }>(
      `${this.apiUrl.replace('/auth', '')}/profile`,
      payload
    ).pipe(
      tap((response) => {
        this.storageService.setUser(response.data);
        this.currentUserSignal.set(response.data);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  getToken(): string | null {
    return this.storageService.getToken();
  }

  isLoggedIn(): boolean {
    return !!this.storageService.getToken();
  }

  hasRole(roleName: string): boolean {
    const user = this.currentUserSignal();

    if (!user?.roles) {
      return false;
    }

    return user.roles.some(role => role.name === roleName);
  }

  hasAnyRole(roleNames: string[]): boolean {
    return roleNames.some(role => this.hasRole(role));
  }

  clearAuth(): void {
    this.storageService.clearAuth();
    this.currentUserSignal.set(null);
  }

  private storageAuth(token: string, user: User): void {
    this.storageService.setToken(token);
    this.storageService.setUser(user);
    this.currentUserSignal.set(user);
  }

  forgotPassword(payload: { email: string }) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/forgot-password`,
      payload
    );
  }

  resetPassword(payload: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/reset-password`,
      payload
    );
  }
}
