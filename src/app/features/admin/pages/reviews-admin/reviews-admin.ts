import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { AdminReviews } from '../../services/admin-reviews';
import { AdminReview } from '../../models/admin-review.model';
import { Notification } from '../../../../core/services/notification';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-reviews-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reviews-admin.html',
  styleUrl: './reviews-admin.scss',
})
export class ReviewsAdmin implements OnInit {
  private readonly adminReviewsService = inject(AdminReviews);
  private readonly notificationService = inject(Notification);

  loading = false;
  errorMessage = '';
  reviews: AdminReview[] = [];

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.errorMessage = '';

    this.adminReviewsService.getReviews().subscribe({
      next: (response) => {
        this.loading = false;
        this.reviews = response.data;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudieron cargar las reseñas.';
      }
    });
  }

  deleteReview(reviewId: number): void {
    this.adminReviewsService.deleteReview(reviewId).subscribe({
      next: () => {
        this.notificationService.success('Reseña eliminada correctamente.');
        this.loadReviews();
      },
      error: (error) => {
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
