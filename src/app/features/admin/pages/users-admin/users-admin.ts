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

  editingUserId: number | null = null;
  submitting = false;

  userForm = {
    name: '',
    email: '',
    password: '',
    status: 'active' as 'active' | 'banned',
    role_ids: [] as number[]
  };

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.resetUserForm();
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

  deleteUser(user: User): void {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar al usuario "${user.name}"? Esta acción no se puede deshacer.`
    );

    if (!confirmed) {
      return;
    }

    this.adminUsersService.deleteUser(user.user_id).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.loadUsers();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'No se pudo eliminar el usuario.';
      }
    });
  }

  resetUserForm(): void {
    this.editingUserId = null;
    this.userForm = {
      name: '',
      email: '',
      password: '',
      status: 'active',
      role_ids: []
    };
  }

  editUser(user: User): void {
    this.editingUserId = user.user_id;
    this.userForm = {
      name: user.name,
      email: user.email,
      password: '',
      status: user.status as 'active' | 'banned',
      role_ids: user.roles?.map(role => role.role_id) || []
    };

    this.errorMessage = '';
    this.successMessage = '';
  }

  toggleFormRole(roleId: number): void {
    if (this.userForm.role_ids.includes(roleId)) {
      this.userForm.role_ids = this.userForm.role_ids.filter(id => id !== roleId);
    } else {
      this.userForm.role_ids = [...this.userForm.role_ids, roleId];
    }
  }

  submitUser(): void {
    if (!this.userForm.name.trim() || !this.userForm.email.trim()) {
      this.errorMessage = 'Nombre y correo son obligatorios.';
      return;
    }

    if (!this.editingUserId && !this.userForm.password.trim()) {
      this.errorMessage = 'La contraseña es obligatoria al crear un usuario.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      name: this.userForm.name.trim(),
      email: this.userForm.email.trim(),
      status: this.userForm.status,
      role_ids: this.userForm.role_ids,
      ...(this.userForm.password.trim() ? { password: this.userForm.password.trim() } : {})
    };

    const request = this.editingUserId
      ? this.adminUsersService.updateUser(this.editingUserId, payload)
      : this.adminUsersService.createUser(payload as {
        name: string;
        email: string;
        password: string;
        status: 'active' | 'banned';
        role_ids: number[];
      });

    request.subscribe({
      next: (response) => {
        this.submitting = false;
        this.successMessage = response.message;
        this.resetUserForm();
        this.loadUsers();
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage = error?.error?.message || 'No se pudo guardar el usuario.';
      }
    });
  }
}
