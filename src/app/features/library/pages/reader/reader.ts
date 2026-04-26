import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, computed, inject, signal, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import ePub, { Book as EpubBook, Rendition } from 'epubjs';

import { Reader } from '../../services/reader';
import { ReaderContent } from '../../models/reader-content.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reader',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reader.html',
  styleUrl: './reader.scss',
})
export class ReaderComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly readerService = inject(Reader);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;
  errorMessage = '';

  @ViewChild('epubViewer') epubViewer?: ElementRef<HTMLDivElement>;

  fileUrl: SafeResourceUrl | null = null;
  rawObjectUrl: string | null = null;
  useDocumentViewer = false;

  epubBook: EpubBook | null = null;
  epubRendition: Rendition | null = null;
  epubReady = false;

  bookContent = signal<ReaderContent | null>(null);
  currentPageIndex = signal(0);

  epubTotalPages = signal<number | null>(null);
  epubAtStart = signal(true);
  epubAtEnd = signal(false);

  fontSize = signal(18);
  fontFamily = signal<'serif' | 'sans' | 'reading'>('serif');
  darkMode = signal(false);

  currentPage = computed(() => {
    const content = this.bookContent();
    if (!content || content.pages.length === 0) return null;
    return content.pages[this.currentPageIndex()];
  });

  isPdf = computed(() => this.bookContent()?.format === 'PDF');
  isEpub = computed(() => this.bookContent()?.format === 'EPUB');

  showPageIndicator = computed(() => !!this.bookContent() && !this.isPdf());
  showReaderControls = computed(() => !!this.bookContent() && !this.isPdf());

  epubCurrentDisplayPage = signal(1);
  epubDisplayedTotal = signal<number | null>(null);

  isMobile = computed(() => window.innerWidth <= 768);

  displayedPageText = computed(() => {
    if (this.isPdf()) {
      return '';
    }

    if (this.isEpub()) {
      return `Página ${this.epubCurrentDisplayPage()}`;
    }

    const content = this.bookContent();
    if (!content) {
      return '';
    }

    return `Página ${this.currentPageIndex() + 1} de ${content.pages.length}`;
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

  ngOnDestroy(): void {
    if (this.epubRendition) {
      this.epubRendition.destroy();
    }

    if (this.rawObjectUrl) {
      URL.revokeObjectURL(this.rawObjectUrl);
    }
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

        this.loadDocumentFile(response.data.book_id, response.data.format);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'No se pudo cargar el contenido del libro.';
      }
    });
  }

  loadDocumentFile(bookId: number, format: string): void {
    this.readerService.getBookFileBlob(bookId).subscribe({
      next: async (blob) => {
        if (this.rawObjectUrl) {
          URL.revokeObjectURL(this.rawObjectUrl);
          this.rawObjectUrl = null;
        }

        if (format === 'PDF') {
          this.rawObjectUrl = URL.createObjectURL(blob);

          this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawObjectUrl);

          this.useDocumentViewer = true;
          this.epubReady = false;
          this.epubTotalPages.set(null);
          this.epubAtStart.set(true);
          this.epubAtEnd.set(false);
          this.epubCurrentDisplayPage.set(1);
          this.epubDisplayedTotal.set(null);
          return;
        }

        if (format === 'EPUB') {
          this.useDocumentViewer = true;
          this.fileUrl = null;
          this.epubReady = false;
          this.epubTotalPages.set(null);
          this.epubAtStart.set(true);
          this.epubAtEnd.set(false);
          this.epubCurrentDisplayPage.set(1);
          this.epubDisplayedTotal.set(null);

          this.cdr.detectChanges();

          const arrayBuffer = await blob.arrayBuffer();

          setTimeout(() => {
            this.renderEpub(arrayBuffer);
          }, 0);

          return;
        }

        this.useDocumentViewer = false;
        this.fileUrl = null;
      },
      error: () => {
        this.useDocumentViewer = false;
        this.fileUrl = null;
        this.epubReady = false;
      }
    });
  }

  nextPage(): void {
    const content = this.bookContent();

    if (this.useDocumentViewer && content?.format === 'EPUB' && this.epubRendition) {
      this.epubRendition.next();
      return;
    }

    if (!content) return;

    if (this.currentPageIndex() < content.pages.length - 1) {
      this.currentPageIndex.update(value => value + 1);
      this.saveProgress();
    }
  }

  previousPage(): void {
    const content = this.bookContent();

    if (this.useDocumentViewer && content?.format === 'EPUB' && this.epubRendition) {
      this.epubRendition.prev();
      return;
    }

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

  private renderEpub(epubData: ArrayBuffer): void {
    try {
      if (!this.epubViewer?.nativeElement) {
        this.errorMessage = 'No se pudo inicializar el visor EPUB.';
        return;
      }

      if (this.epubRendition) {
        this.epubRendition.destroy();
        this.epubRendition = null;
      }

      this.epubBook = ePub(epubData);
      this.epubRendition = this.epubBook.renderTo(this.epubViewer.nativeElement, {
        width: '100%',
        height: '100%',
        spread: 'none'
      } as any);

      this.epubRendition.on('relocated', (location: any) => {
        const displayedPage = location?.start?.displayed?.page;
        const displayedTotal = location?.start?.displayed?.total;
        const atStart = !!location?.atStart;
        const atEnd = !!location?.atEnd;

        if (typeof displayedPage === 'number' && displayedPage > 0) {
          this.epubCurrentDisplayPage.set(displayedPage);
          this.currentPageIndex.set(displayedPage - 1);
          this.saveProgress();
        }

        if (typeof displayedTotal === 'number' && displayedTotal > 0) {
          this.epubDisplayedTotal.set(displayedTotal);
        } else {
          this.epubDisplayedTotal.set(null);
        }

        this.epubAtStart.set(atStart);
        this.epubAtEnd.set(atEnd);
      });

      this.epubRendition.display();
      this.epubReady = true;
    } catch (error) {
      console.error('EPUB render error:', error);
      this.errorMessage = 'No se pudo renderizar el EPUB.';
    }
  }

  setFontFamily(font: 'serif' | 'sans' | 'reading'): void {
    this.fontFamily.set(font);
    this.saveReaderPreferences();
  }
}
