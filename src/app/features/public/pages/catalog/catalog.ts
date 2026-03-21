import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Navbar } from '../../../../shared/components/navbar/navbar';
import { Footer } from '../../../../shared/components/footer/footer';
import { Books } from '../../services/books';
import { BooksResponse } from '../../models/books-response.model';
import { Categories } from '../../services/categories';
import { Book } from '../../models/book.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, FormsModule, RouterModule, Navbar, Footer],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog implements OnInit {
  private readonly booksService = inject(Books);
  private readonly categoriesService = inject(Categories);

  books: Book[] = [];
  categories: Category[] = [];

  loading = false;
  errorMessage = '';

  search = '';
  selectedCategoryId: number | null = null;
  selectedSort = 'title_asc';

  currentPage = 1;
  lastPage = 1;

  ngOnInit(): void {
    this.loadCategories();
    this.loadBooks();
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      }
    });
  }

  loadBooks(page: number = 1): void {
    this.loading = true;
    this.errorMessage = '';

    this.booksService.getBooks({
      search: this.search || undefined,
      category_id: this.selectedCategoryId ?? undefined,
      sort: this.selectedSort,
      page
    }).subscribe({
      next: (response: BooksResponse) => {
        this.loading = false;
        this.books = response.data;
        this.currentPage = response.current_page;
        this.lastPage = response.last_page;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudieron cargar los libros.';
      }
    });
  }

  applyFilters(): void {
    this.loadBooks(1);
  }

  clearFilters(): void {
    this.search = '';
    this.selectedCategoryId = null;
    this.selectedSort = 'title_asc';
    this.loadBooks(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.lastPage) return;
    this.loadBooks(page);
  }
}
