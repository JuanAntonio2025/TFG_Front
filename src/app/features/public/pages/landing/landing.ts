import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';

import { Books } from '../../services/books';
import { Book } from '../../models/book.model';
import { ImageUrl } from '../../../../core/services/image-url';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing implements OnInit {
  private readonly booksService = inject(Books);
  protected readonly imageUrlService = inject(ImageUrl);
  private readonly authService = inject(Auth);

  featuredBooks: Book[] = [];
  featuredLoading = false;

  ngOnInit(): void {
    this.loadFeaturedBooks();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  loadFeaturedBooks(): void {
    this.featuredLoading = true;

    this.booksService.getFeaturedBooks().subscribe({
      next: (response) => {
        this.featuredLoading = false;
        this.featuredBooks = response.data.slice(0, 4);
      },
      error: () => {
        this.featuredLoading = false;
        this.featuredBooks = [];
      }
    });
  }
}
