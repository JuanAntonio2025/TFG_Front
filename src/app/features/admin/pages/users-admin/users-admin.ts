import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { AdminUsers } from '../../services/admin-users';
import { User } from '../../../../core/models/user.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users-admin.html',
  styleUrl: './users-admin.scss',
})
export class UsersAdmin implements OnInit {
  private readonly adminUsersService = inject(AdminUsers);

  loading = false;
  errorMessage = '';
  successMessage = '';

  users: User[] = [];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminUsersService.getUsers().subscribe({
      next: (response) => {
        this.loading = false;
        this.users = response.data;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudieron cargar los usuarios.';
      }
    });
  }

  toggleStatus(user: User): void {
    const newStatus = user.status === 'active' ? 'banned' : 'active';

    this.adminUsersService.updateUserStatus(user.user_id, newStatus).subscribe({
      next: () => {
        this.successMessage = 'Estado del usuario actualizado correctamente.';
        this.loadUsers();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'No se pudo actualizar el estado del usuario.';
      }
    });
  }

  getRoleNames(user: User): string {
    if (!user.roles || user.roles.length === 0) {
      return 'Sin roles';
    }

    return user.roles.map(role => role.name).join(', ');
  }
}
