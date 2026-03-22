import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Cart} from '../../../cart/services/cart';
import { Orders } from '../../services/orders';
import { CartData } from '../../../cart/models/cart.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit {
  private readonly cartService = inject(Cart);
  private readonly ordersService = inject(Orders);
  private readonly router = inject(Router);

  loading = false;
  orderLoading = false;
  errorMessage = '';
  successMessage = '';

  cartData: CartData | null = null;
  selectedPaymentMethod: 'card' | 'paypal' = 'card';

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.errorMessage = '';

    this.cartService.getCart().subscribe({
      next: (response) => {
        this.loading = false;
        this.cartData = response.data;

        if (!this.cartData.items.length) {
          this.errorMessage = 'Tu carrito está vacío.';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo cargar el carrito.';
      }
    });
  }

  confirmOrder(): void {
    if (!this.cartData || this.cartData.items.length === 0) {
      this.errorMessage = 'No hay productos en el carrito.';
      return;
    }

    this.orderLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.ordersService.createOrder(this.selectedPaymentMethod).subscribe({
      next: (response) => {
        this.orderLoading = false;
        this.successMessage = response.message;

        setTimeout(() => {
          this.router.navigate(['/library']);
        }, 1200);
      },
      error: (error) => {
        this.orderLoading = false;
        this.errorMessage = error?.error?.message || 'No se pudo completar la compra.';
      }
    });
  }
}
