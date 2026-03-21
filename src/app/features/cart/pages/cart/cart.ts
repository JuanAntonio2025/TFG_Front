import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Cart } from '../../services/cart';
import { CartData, CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(Cart);
  private readonly router = inject(Router);

  loading = false;
  errorMessage = '';
  successMessage = '';

  cartData: CartData | null = null;
  items: CartItem[] = [];

  ngOnInit(): void {
    this.loadCart();
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

  increaseQuantity(item: CartItem): void {
    this.updateQuantity(item, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity <= 1) {
      this.removeItem(item.book_id);
      return;
    }

    this.updateQuantity(item, item.quantity - 1);
  }

  updateQuantity(item: CartItem, quantity: number): void {
    this.cartService.updateItem(item.book_id, quantity).subscribe({
      next: (response) => {
        this.cartData = response.data;
        this.items = response.data.items;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'No se pudo actualizar el carrito.';
      }
    });
  }

  removeItem(bookId: number): void {
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

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
