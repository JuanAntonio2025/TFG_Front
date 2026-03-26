import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../../../core/models/user.model';
import { Role } from '../../../core/models/role.model'
import { environment } from '../../../../environments/environment';

export interface AdminUsersResponse {
  data: User[];
}

export interface AdminUserResponse {
  data: User;
}

export interface RolesResponse {
  data: Role[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminUsers {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/admin/users`;
  private readonly rolesUrl = `${environment.apiBaseUrl}/admin/roles`;

  getUsers(): Observable<AdminUsersResponse> {
    return this.http.get<AdminUsersResponse>(this.apiUrl);
  }

  getUserById(userId: number): Observable<AdminUserResponse> {
    return this.http.get<AdminUserResponse>(`${this.apiUrl}/${userId}`);
  }

  updateUserStatus(userId: number, status: 'active' | 'banned') {
    return this.http.patch<{ message: string; data: { user_id: number; status: string } }>(
      `${this.apiUrl}/${userId}/status`,
      { status }
    );
  }

  getRoles(): Observable<RolesResponse> {
    return this.http.get<RolesResponse>(this.rolesUrl);
  }

  updateUserRoles(userId: number, roleIds: number[]) {
    return this.http.put<{ message: string; data: User }>(
      `${this.apiUrl}/${userId}/roles`,
      { role_ids: roleIds }
    );
  }
}
