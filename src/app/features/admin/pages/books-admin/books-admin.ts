import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AdminBooks } from '../../services/admin-books';
import { AdminCategories } from '../../services/admin-categories';
import { Book } from '../../../public/models/book.model';
import { Category } from '../../../public/models/category.model';
import { ImageUrl } from '../../../../core/services/image-url';

@Component({
  selector: 'app-books-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './books-admin.html',
  styleUrls: ['./books-admin.scss'],
})
export class BooksAdmin implements OnInit {
  private readonly adminBooksService = inject(AdminBooks);
  private readonly adminCategoriesService = inject(AdminCategories);
  protected readonly imageUrlService = inject(ImageUrl);

  loading = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  selectedCoverFile: File | null = null;
  coverPreview: string | null = null;

  books: Book[] = [];
  categories: Category[] = [];
  editingBookId: number | null = null;

  selectedBookFile: File | null = null;
  bookFileName: string | null = null;

  form = {
    title: '',
    author: '',
    description: '',
    price: 0,
    format: 'PDF',
    available: 'available',
    featured: false,
    category_ids: [] as number[]
  };

  @ViewChild('coverInput') coverInput?: ElementRef<HTMLInputElement>;

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
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las categorías.';
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

  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    this.selectedCoverFile = file;

    if (!file) {
      this.coverPreview = this.editingBookId ? this.coverPreview : null;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.coverPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  editBook(book: Book): void {
    this.editingBookId = book.book_id;
    this.form = {
      title: book.title,
      author: book.author,
      description: book.description || '',
      price: Number(book.price),
      format: book.format,
      available: book.available,
      featured: !!book.featured,
      category_ids: book.categories?.map(category => category.category_id) || []
    };

    this.selectedCoverFile = null;
    this.coverPreview = book.front_page_url || (book.front_page ? this.imageUrlService.resolve(book.front_page) : null);

    this.selectedBookFile = null;
    this.bookFileName = book.file_path ? book.file_path.split('/').pop() || null : null;

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
      format: 'PDF',
      available: 'available',
      featured: false,
      category_ids: []
    };

    this.selectedBookFile = null;
    this.bookFileName = null;

    this.clearCoverSelection();
    this.errorMessage = '';
  }

  submit(): void {
    if (!this.form.title.trim() || !this.form.author.trim() || this.form.price < 0) {
      this.errorMessage = 'Título, autor y precio válido son obligatorios.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('title', this.form.title.trim());
    formData.append('author', this.form.author.trim());
    formData.append('description', this.form.description || '');
    formData.append('price', String(this.form.price));
    formData.append('format', this.form.format);
    formData.append('available', this.form.available);
    formData.append('featured', String(this.form.featured));

    this.form.category_ids.forEach((id) => {
      formData.append('category_ids[]', String(id));
    });

    if (this.selectedCoverFile) {
      formData.append('front_page', this.selectedCoverFile);
    }

    if (this.selectedBookFile) {
      formData.append('book_file', this.selectedBookFile);
    }

    if (this.editingBookId) {
      formData.append('_method', 'PUT');

      this.adminBooksService.updateBook(this.editingBookId, formData).subscribe({
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

    this.adminBooksService.createBook(formData).subscribe({
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

  clearCoverSelection(): void {
    this.selectedCoverFile = null;
    this.coverPreview = null;

    if (this.coverInput?.nativeElement) {
      this.coverInput.nativeElement.value = '';
    }
  }

  onBookFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    this.selectedBookFile = file;
    this.bookFileName = file ? file.name : null;
  }

  onFormatChange(): void {
    this.selectedBookFile = null;
    this.bookFileName = null;
  }
}
