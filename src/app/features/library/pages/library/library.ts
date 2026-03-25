import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Library } from '../../services/library';
import { LibraryBook } from '../../models/library-book.model';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './library.html',
  styleUrl: './library.scss',
})
export class LibraryComponent implements OnInit {
  private readonly libraryService = inject(Library);

  loading = false;
  errorMessage = '';

  private readonly libraryBooksSignal = signal<LibraryBook[]>([]);

  searchTerm = '';
  selectedFormat = '';

  filteredBooks: LibraryBook[] = [];

  ngOnInit(): void {
    this.loadLibrary();
  }

  loadLibrary(): void {
    this.loading = true;
    this.errorMessage = '';

    this.libraryService.getLibrary().subscribe({
      next: (response) => {
        this.loading = false;
        this.libraryBooksSignal.set(response.data);
        this.filteredBooks = response.data;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo cargar tu biblioteca.';
      }
    });
  }

  applyFilters(): void {
    const search = this.searchTerm.trim().toLowerCase();
    const format = this.selectedFormat;

    this.filteredBooks = this.libraryBooksSignal().filter(book => {
      const matchesSearch =
        !search ||
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search);

      const matchesFormat =
        !format || book.format === format;

      return matchesSearch && matchesFormat;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedFormat = '';
    this.filteredBooks = this.libraryBooksSignal();
  }
}
