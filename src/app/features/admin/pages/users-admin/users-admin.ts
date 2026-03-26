import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminUsers } from '../../services/admin-users';
import { User } from '../../../../core/models/user.model';
import { RouterLink } from '@angular/router';
import { Role } from '../../../../core/models/role.model';

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './users-admin.html',
  styleUrl: './users-admin.scss',
})
export class UsersAdmin implements OnInit {
  private readonly adminUsersService = inject(AdminUsers);

  loading = false;
  errorMessage = '';
  successMessage = '';

  users: User[] = [];
  roles: Role[] = [];

  editingRolesUserId: number | null = null;
  selectedRoleIds: number[] = [];

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
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

  loadRoles(): void {
    this.adminUsersService.getRoles().subscribe({
      next: (response) => {
        this.roles = response.data;
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

  editRoles(user: User): void {
    this.editingRolesUserId = user.user_id;
    this.selectedRoleIds = user.roles?.map(role => role.role_id) || [];
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEditRoles(): void {
    this.editingRolesUserId = null;
    this.selectedRoleIds = [];
  }

  toggleRole(roleId: number): void {
    if (this.selectedRoleIds.includes(roleId)) {
      this.selectedRoleIds = this.selectedRoleIds.filter(id => id !== roleId);
    } else {
      this.selectedRoleIds = [...this.selectedRoleIds, roleId];
    }
  }

  saveRoles(userId: number): void {
    if (this.selectedRoleIds.length === 0) {
      this.errorMessage = 'Debes seleccionar al menos un rol.';
      return;
    }

    this.adminUsersService.updateUserRoles(userId, this.selectedRoleIds).subscribe({
      next: () => {
        this.successMessage = 'Roles actualizados correctamente.';
        this.cancelEditRoles();
        this.loadUsers();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'No se pudieron actualizar los roles.';
      }
    });
  }
}
