import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Reader } from '../../services/reader';
import { ReaderContent } from '../../models/reader-content.model';

@Component({
  selector: 'app-reader',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reader.html',
  styleUrl: './reader.scss',
})
export class ReaderComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly readerService = inject(Reader);

  loading = false;
  errorMessage = '';

  bookContent = signal<ReaderContent | null>(null);
  currentPageIndex = signal(0);

  currentPage = computed(() => {
    const content = this.bookContent();
    if (!content || content.pages.length === 0) return null;
    return content.pages[this.currentPageIndex()];
  });

  ngOnInit(): void {
    const bookId = Number(this.route.snapshot.paramMap.get('bookId'));

    if (!bookId) {
      this.errorMessage = 'Libro no encontrado.';
      return;
    }

    this.loadContent(bookId);
  }

  loadContent(bookId: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.readerService.getBookContent(bookId).subscribe({
      next: (response) => {
        this.loading = false;
        this.bookContent.set(response.data);
        this.currentPageIndex.set(0);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'No se pudo cargar el contenido del libro.';
      }
    });
  }

  nextPage(): void {
    const content = this.bookContent();
    if (!content) return;

    if (this.currentPageIndex() < content.pages.length - 1) {
      this.currentPageIndex.update(value => value + 1);
    }
  }

  previousPage(): void {
    if (this.currentPageIndex() > 0) {
      this.currentPageIndex.update(value => value - 1);
    }
  }
}
