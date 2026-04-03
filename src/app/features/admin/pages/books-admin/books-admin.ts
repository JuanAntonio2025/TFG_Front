import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminBooks } from '../../services/admin-books';
import { AdminCategories } from '../../services/admin-categories';
import { Book } from '../../../public/models/book.model';
import { Category } from '../../../public/models/category.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-books-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './books-admin.html',
  styleUrl: './books-admin.scss',
})
export class BooksAdmin implements OnInit {
  private readonly adminBooksService = inject(AdminBooks);
  private readonly adminCategoriesService = inject(AdminCategories);

  loading = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  books: Book[] = [];
  categories: Category[] = [];
  editingBookId: number | null = null;

  form = {
    title: '',
    author: '',
    description: '',
    price: 0,
    front_page: '',
    format: 'PDF',
    available: 'available',
    featured: false,
    category_ids: [] as number[]
  };

  ngOnInit(): void {
    this.loadBooks();
    this.loadCategories();
  }

  loadBooks(): void {
    this.loading = true;
    this.adminBooksService.getBooks().subscribe({
      next: (response) => {
        this.loading = false;
        this.books = response.data;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudieron cargar los libros.';
      }
    });
  }

  loadCategories(): void {
    this.adminCategoriesService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      }
    });
  }

  toggleCategory(categoryId: number): void {
    if (this.form.category_ids.includes(categoryId)) {
      this.form.category_ids = this.form.category_ids.filter(id => id !== categoryId);
    } else {
      this.form.category_ids = [...this.form.category_ids, categoryId];
    }
  }

  editBook(book: Book): void {
    this.editingBookId = book.book_id;
    this.form = {
      title: book.title,
      author: book.author,
      description: book.description || '',
      price: Number(book.price),
      front_page: book.front_page || '',
      format: book.format,
      available: book.available,
      featured: !!book.featured,
      category_ids: book.categories?.map(category => category.category_id) || []
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.editingBookId = null;
    this.form = {
      title: '',
      author: '',
      description: '',
      price: 0,
      front_page: '',
      format: 'PDF',
      available: 'available',
      featured: false,
      category_ids: []
    };
  }

  submit(): void {
    if (!this.form.title || !this.form.author || this.form.price < 0) {
      this.errorMessage = 'Título, autor y precio válido son obligatorios.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = { ...this.form };

    if (this.editingBookId) {
      this.adminBooksService.updateBook(this.editingBookId, payload).subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Libro actualizado correctamente.';
          this.cancelEdit();
          this.loadBooks();
        },
        error: (error) => {
          this.submitting = false;
          this.errorMessage = error?.error?.message || 'No se pudo actualizar el libro.';
        }
      });
      return;
    }

    this.adminBooksService.createBook(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'Libro creado correctamente.';
        this.cancelEdit();
        this.loadBooks();
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage = error?.error?.message || 'No se pudo crear el libro.';
      }
    });
  }

  deleteBook(bookId: number): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.adminBooksService.deleteBook(bookId).subscribe({
      next: () => {
        this.successMessage = 'Libro eliminado correctamente.';
        this.loadBooks();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'No se pudo eliminar el libro.';
      }
    });
  }
}
