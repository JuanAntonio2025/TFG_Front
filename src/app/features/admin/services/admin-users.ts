import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../../../core/models/user.model';
import { environment } from '../../../../environments/environment';

export interface AdminUsersResponse {
  data: User[];
}

export interface AdminUserResponse {
  data: User;
}

@Injectable({
  providedIn: 'root',
})
export class AdminUsers {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/admin/users`;

  getUsers(): Observable<AdminUsersResponse> {
    return this.http.get<AdminUsersResponse>(this.apiUrl);
  }

  getUserById(userId: number): Observable<AdminUserResponse> {
    return this.http.get<AdminUserResponse>(`${this.apiUrl}/${userId}`);
  }

  updateUserStatus(userId: number, status: 'active' | 'banned'): Observable<{ message: string; data: { user_id: number; status: string } }> {
    return this.http.patch<{ message: string; data: { user_id: number; status: string } }>(
      `${this.apiUrl}/${userId}/status`,
      { status }
    );
  }
}
