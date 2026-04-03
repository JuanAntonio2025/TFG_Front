import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Cart } from '../../services/cart';
import { CartData, CartItem } from '../../models/cart.model';
import { Auth } from '../../../../core/services/auth';
import { GuestCart } from '../../../../core/services/guest-cart';
import { Books } from '../../../public/services/books';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(Cart);
  private readonly router = inject(Router);
  private readonly guestCartService = inject(GuestCart);
  private readonly authService = inject(Auth);
  private readonly booksService = inject(Books);

  loading = false;
  errorMessage = '';
  successMessage = '';

  cartData: CartData | null = null;
  items: CartItem[] = [];

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadCart();
    } else {
      this.loadGuestCart();
    }
  }

  loadCart(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cartService.getCart().subscribe({
      next: (response) => {
        this.loading = false;
        this.cartData = response.data;
        this.items = response.data.items;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo cargar el carrito.';
      }
    });
  }

  removeItem(bookId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.guestCartService.removeItem(bookId);
      this.loadGuestCart();
      return;
    }

    this.cartService.deleteItem(bookId).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.cartData = response.data;
        this.items = response.data.items;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'No se pudo eliminar el libro del carrito.';
      }
    });
  }

  loadGuestCart(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const ids = this.guestCartService.getItems();

    if (ids.length === 0) {
      this.loading = false;
      this.cartData = {
        cart: null,
        items: [],
        summary: {
          items_count: 0,
          total_amount: 0
        }
      };
      this.items = [];
      return;
    }

    this.booksService.getBooksByIds(ids).subscribe({
      next: (response) => {
        this.loading = false;

        this.items = response.data.map(book => ({
          book_id: book.book_id,
          title: book.title,
          author: book.author,
          front_page: book.front_page,
          format: book.format,
          price: Number(book.price),
          line_total: Number(book.price)
        }));

        this.cartData = {
          cart: null,
          items: this.items,
          summary: {
            items_count: this.items.length,
            total_amount: this.items.reduce((sum, item) => sum + Number(item.line_total), 0)
          }
        };
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo cargar el carrito de visitante.';
      }
    });
  }

  goToCheckout(): void {
    if (!this.authService.isLoggedIn()) {
      localStorage.setItem('post_login_redirect', '/checkout');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.router.navigate(['/checkout']);
  }
}
