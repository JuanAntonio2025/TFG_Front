import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Library } from '../../services/library';
import { LibraryBook } from '../../models/library-book.model';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './library.html',
  styleUrl: './library.scss',
})
export class LibraryComponent implements OnInit {
  private readonly libraryService = inject(Library);

  loading = false;
  errorMessage = '';
  libraryBooks: LibraryBook[] = [];

  ngOnInit(): void {
    this.loadLibrary();
  }

  loadLibrary(): void {
    this.loading = true;
    this.errorMessage = '';

    this.libraryService.getLibrary().subscribe({
      next: (response) => {
        this.loading = false;
        this.libraryBooks = response.data;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo cargar tu biblioteca.';
      }
    });
  }
}
