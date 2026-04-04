import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Books } from '../../services/books';
import { Cart } from '../../../cart/services/cart';
import { Book } from '../../models/book.model';
import { Review } from '../../../reviews/models/review.model';
import { Auth } from '../../../../core/services/auth';
import { GuestCart } from '../../../../core/services/guest-cart';
import { Reviews } from '../../../reviews/services/reviews';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss',
})
export class BookDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly booksService = inject(Books);
  private readonly cartService = inject(Cart);
  private readonly authService = inject(Auth);
  private readonly guestCartService = inject(GuestCart);
  private readonly reviewsService = inject(Reviews);

  loading = false;
  cartLoading = false;
  reviewLoading = false;
  errorMessage = '';
  successMessage = '';

  book: Book | null = null;
  reviews: Review[] = [];
  avgPoints: number | null = null;
  totalReviews = 0;

  reviewForm = {
    points: 5,
    comment: ''
  };

  editingReviewId: number | null = null;

  ngOnInit(): void {
    const bookId = Number(this.route.snapshot.paramMap.get('id'));

    if (!bookId) {
      this.errorMessage = 'Libro no encontrado.';
      return;
    }

    this.loadBook(bookId);
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
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

  refreshReviews(): void {
    if (!this.book) return;

    this.reviewsService.getReviewsByBook(this.book.book_id).subscribe({
      next: (response) => {
        this.reviews = response.data;
        this.totalReviews = response.data.length;

        if (response.data.length > 0) {
          const sum = response.data.reduce((acc, review) => acc + review.points, 0);
          this.avgPoints = Number((sum / response.data.length).toFixed(2));
        } else {
          this.avgPoints = null;
        }
      }
    });
  }

  addToCart(): void {
    if (!this.book) return;

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.authService.isLoggedIn()) {
      const added = this.guestCartService.addItem(this.book.book_id);

      if (!added) {
        this.errorMessage = 'Este libro ya está en tu carrito.';
        return;
      }

      this.successMessage = 'Libro añadido al carrito.';
      return;
    }

    this.cartLoading = true;

    this.cartService.addItem(this.book.book_id).subscribe({
      next: (response) => {
        this.cartLoading = false;
        this.successMessage = response.message;
      },
      error: (error) => {
        this.cartLoading = false;

        const backendMessage = error?.error?.message;

        if (backendMessage === 'You already own this book.') {
          this.errorMessage = 'Ya has comprado este libro.';
        } else if (backendMessage === 'This book is already in your cart.') {
          this.errorMessage = 'Este libro ya está en tu carrito.';
        } else {
          this.errorMessage = backendMessage || 'No se pudo añadir el libro al carrito.';
        }
      }
    });
  }

  hasOwnReview(): boolean {
    if (!this.currentUser) return false;

    return this.reviews.some(review => review.user_id === this.currentUser?.user_id);
  }

  getOwnReview(): Review | undefined {
    if (!this.currentUser) return undefined;

    return this.reviews.find(review => review.user_id === this.currentUser?.user_id);
  }

  startEditReview(review: Review): void {
    this.editingReviewId = review.review_id;
    this.reviewForm.points = review.points;
    this.reviewForm.comment = review.comment;
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEditReview(): void {
    this.editingReviewId = null;
    this.reviewForm = {
      points: 5,
      comment: ''
    };
  }

  submitReview(): void {
    if (!this.book) return;
    if (!this.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.reviewForm.comment.trim()) {
      this.errorMessage = 'El comentario no puede estar vacío.';
      return;
    }

    this.reviewLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.editingReviewId) {
      this.reviewsService.updateReview(this.editingReviewId, {
        points: this.reviewForm.points,
        comment: this.reviewForm.comment
      }).subscribe({
        next: () => {
          this.reviewLoading = false;
          this.successMessage = 'Reseña actualizada correctamente.';
          this.cancelEditReview();
          this.refreshReviews();
        },
        error: (error) => {
          this.reviewLoading = false;
          this.errorMessage = error?.error?.message || 'No se pudo actualizar la reseña.';
        }
      });

      return;
    }

    this.reviewsService.createReview(this.book.book_id, {
      points: this.reviewForm.points,
      comment: this.reviewForm.comment
    }).subscribe({
      next: () => {
        this.reviewLoading = false;
        this.successMessage = 'Reseña creada correctamente.';
        this.reviewForm = {
          points: 5,
          comment: ''
        };
        this.refreshReviews();
      },
      error: (error) => {
        this.reviewLoading = false;
        this.errorMessage = error?.error?.message || 'No se pudo crear la reseña.';
      }
    });
  }

  deleteReview(reviewId: number): void {
    this.reviewLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.reviewsService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviewLoading = false;
        this.successMessage = 'Reseña eliminada correctamente.';
        this.cancelEditReview();
        this.refreshReviews();
      },
      error: (error) => {
        this.reviewLoading = false;
        this.errorMessage = error?.error?.message || 'No se pudo eliminar la reseña.';
      }
    });
  }

  getStars(points: number): string {
    const full = '★'.repeat(points);
    const empty = '☆'.repeat(5 - points);
    return full + empty;
  }
}
