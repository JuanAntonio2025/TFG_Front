import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Books } from '../../services/books';
import { Cart } from '../../../cart/services/cart';
import { Book } from '../../models/book.model';
import { Review } from '../../models/review.model';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-book-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss',
})
export class BookDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly booksService = inject(Books);
  private readonly cartService = inject(Cart);
  private readonly authService = inject(Auth);

  loading = false;
  cartLoading = false;
  errorMessage = '';
  successMessage = '';

  book: Book | null = null;
  reviews: Review[] = [];
  avgPoints: number | null = null;
  totalReviews = 0;

  ngOnInit(): void {
    const bookId = Number(this.route.snapshot.paramMap.get('id'));

    if (!bookId) {
      this.errorMessage = 'Libro no encontrado.';
      return;
    }

    this.loadBook(bookId);
  }

  loadBook(bookId: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.booksService.getBookById(bookId).subscribe({
      next: (response) => {
        this.loading = false;
        this.book = response.data.book;
        this.reviews = response.data.book.reviews ?? [];
        this.avgPoints = response.data.reviews_summary.avg_points;
        this.totalReviews = response.data.reviews_summary.total_reviews;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo cargar el detalle del libro.';
      }
    });
  }

  addToCart(): void {
    if (!this.book) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.cartLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cartService.addItem(this.book.book_id, 1).subscribe({
      next: () => {
        this.cartLoading = false;
        this.successMessage = 'Libro añadido al carrito correctamente.';
      },
      error: (error) => {
        this.cartLoading = false;

        if (error?.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'No se pudo añadir el libro al carrito.';
        }
      }
    });
  }
}
