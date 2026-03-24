import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminCategories } from '../../services/admin-categories';
import { Category } from '../../../public/models/category.model';

@Component({
  selector: 'app-categories-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories-admin.html',
  styleUrl: './categories-admin.scss',
})
export class CategoriesAdmin implements OnInit {
  private readonly adminCategoriesService = inject(AdminCategories);

  loading = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  categories: Category[] = [];
  editingCategoryId: number | null = null;

  form = {
    name: '',
    description: ''
  };

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.adminCategoriesService.getCategories().subscribe({
      next: (response) => {
        this.loading = false;
        this.categories = response.data;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudieron cargar las categorías.';
      }
    });
  }

  editCategory(category: Category): void {
    this.editingCategoryId = category.category_id;
    this.form = {
      name: category.name,
      description: category.description
    };
  }

  cancelEdit(): void {
    this.editingCategoryId = null;
    this.form = {
      name: '',
      description: ''
    };
  }

  submit(): void {
    if (!this.form.name || !this.form.description) {
      this.errorMessage = 'Nombre y descripción son obligatorios.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.editingCategoryId) {
      this.adminCategoriesService.updateCategory(this.editingCategoryId, this.form).subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Categoría actualizada correctamente.';
          this.cancelEdit();
          this.loadCategories();
        },
        error: (error) => {
          this.submitting = false;
          this.errorMessage = error?.error?.message || 'No se pudo actualizar la categoría.';
        }
      });
      return;
    }

    this.adminCategoriesService.createCategory(this.form).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'Categoría creada correctamente.';
        this.cancelEdit();
        this.loadCategories();
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage = error?.error?.message || 'No se pudo crear la categoría.';
      }
    });
  }

  deleteCategory(categoryId: number): void {
    this.adminCategoriesService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.successMessage = 'Categoría eliminada correctamente.';
        this.loadCategories();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'No se pudo eliminar la categoría.';
      }
    });
  }
}
