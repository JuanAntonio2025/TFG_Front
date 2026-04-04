import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Reader } from '../../services/reader';
import { ReaderContent } from '../../models/reader-content.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-reader',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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

  fontSize = signal(18);
  fontFamily = signal<'serif' | 'sans' | 'reading'>('serif');
  darkMode = signal(false);

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

    this.restoreReaderPreferences();
    this.loadContent(bookId);
  }

  loadContent(bookId: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.readerService.getBookContent(bookId).subscribe({
      next: (response) => {
        this.loading = false;
        this.bookContent.set(response.data);

        const savedPage = this.getSavedProgress(response.data.book_id);
        const maxIndex = response.data.pages.length - 1;

        if (savedPage >= 0 && savedPage <= maxIndex) {
          this.currentPageIndex.set(savedPage);
        } else {
          this.currentPageIndex.set(0);
        }
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
      this.saveProgress();
    }
  }

  previousPage(): void {
    if (this.currentPageIndex() > 0) {
      this.currentPageIndex.update(value => value - 1);
      this.saveProgress();
    }
  }

  increaseFontSize(): void {
    if (this.fontSize() < 28) {
      this.fontSize.update(value => value + 2);
      this.saveReaderPreferences();
    }
  }

  decreaseFontSize(): void {
    if (this.fontSize() > 14) {
      this.fontSize.update(value => value - 2);
      this.saveReaderPreferences();
    }
  }

  toggleDarkMode(): void {
    this.darkMode.update(value => !value);
    this.saveReaderPreferences();
  }

  private saveProgress(): void {
    const content = this.bookContent();
    if (!content) return;

    localStorage.setItem(
      this.getProgressKey(content.book_id),
      String(this.currentPageIndex())
    );
  }

  private getSavedProgress(bookId: number): number {
    const rawValue = localStorage.getItem(this.getProgressKey(bookId));
    return rawValue ? Number(rawValue) : 0;
  }

  private getProgressKey(bookId: number): string {
    return `reader_progress_${bookId}`;
  }

  private saveReaderPreferences(): void {
    localStorage.setItem('reader_font_size', String(this.fontSize()));
    localStorage.setItem('reader_dark_mode', String(this.darkMode()));
    localStorage.setItem('reader_font_family', this.fontFamily());
  }

  private restoreReaderPreferences(): void {
    const savedFontSize = localStorage.getItem('reader_font_size');
    const savedDarkMode = localStorage.getItem('reader_dark_mode');
    const savedFontFamily = localStorage.getItem('reader_font_family') as
      | 'serif'
      | 'sans'
      | 'reading'
      | null;

    if (savedFontSize) {
      this.fontSize.set(Number(savedFontSize));
    }

    if (savedDarkMode) {
      this.darkMode.set(savedDarkMode === 'true');
    }

    if (savedFontFamily) {
      this.fontFamily.set(savedFontFamily);
    }
  }

  setFontFamily(font: 'serif' | 'sans' | 'reading'): void {
    this.fontFamily.set(font);
    this.saveReaderPreferences();
  }
}
