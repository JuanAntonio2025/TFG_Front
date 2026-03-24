import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';
import { Storage } from './storage';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly storageService = inject(Storage);

  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;

  register(payload: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap((response) => {
        this.storageService.setToken(response.token);
        this.storageService.setUser(response.user);
      })
    );
  }

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => {
        this.storageService.setToken(response.token);
        this.storageService.setUser(response.user);
      })
    );
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.storageService.clearAuth();
      })
    );
  }

  me(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap((user) => {
        this.storageService.setUser(user);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.storageService.getUser();
  }

  getToken(): string | null {
    return this.storageService.getToken();
  }

  isLoggedIn(): boolean {
    return this.storageService.isLoggedIn();
  }

  hasRole(roleName: string): boolean {
    const user = this.getCurrentUser();
    if (!user?.roles) {
      return false;
    }

    return user.roles.some(role => role.name === roleName);
  }

  hasAnyRole(roleNames: string[]): boolean {
    return roleNames.some(role => this.hasRole(role));
  }
}
