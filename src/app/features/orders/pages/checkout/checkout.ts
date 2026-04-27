/*import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Cart } from '../../../cart/services/cart';
import { Orders } from '../../services/orders';
import { CartData } from '../../../cart/models/cart.model';
import { Notification } from '../../../../core/services/notification';

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
  private readonly notificationService = inject(Notification);

  loading = false;
  orderLoading = false;
  errorMessage = '';
  successMessage = '';
  transactionReference = '';

  cartData: CartData | null = null;
  selectedPaymentMethod: 'card' | 'paypal' = 'card';

  cardForm = {
    card_holder: '',
    card_number: '',
    expiry_date: '',
    cvv: ''
  };

  paypalForm = {
    paypal_email: ''
  };

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

    this.errorMessage = '';
    this.successMessage = '';
    this.transactionReference = '';

    const payload = this.buildPaymentPayload();

    if (!payload) {
      return;
    }

    this.orderLoading = true;

    this.ordersService.createOrder(payload).subscribe({
      next: (response) => {
        this.orderLoading = false;
        this.successMessage = 'Pago simulado procesado correctamente.';
        this.transactionReference = response.data.payment.transaction_reference;

        this.notificationService.success('Pedido realizado correctamente.');

        setTimeout(() => {
          this.router.navigate(['/library']);
        }, 1800);
      },
      error: (error) => {
        this.orderLoading = false;
        this.errorMessage = error?.error?.message || 'No se pudo completar la compra.';
      }
    });
  }

  private buildPaymentPayload():
    | {
    payment_method: 'card' | 'paypal';
    card_holder?: string;
    card_number?: string;
    expiry_date?: string;
    cvv?: string;
    paypal_email?: string;
  }
    | null {
    if (this.selectedPaymentMethod === 'card') {
      if (
        !this.cardForm.card_holder.trim() ||
        !this.cardForm.card_number.trim() ||
        !this.cardForm.expiry_date.trim() ||
        !this.cardForm.cvv.trim()
      ) {
        this.errorMessage = 'Completa todos los campos de la tarjeta.';
        return null;
      }

      return {
        payment_method: 'card',
        card_holder: this.cardForm.card_holder.trim(),
        card_number: this.cardForm.card_number.trim(),
        expiry_date: this.cardForm.expiry_date.trim(),
        cvv: this.cardForm.cvv.trim()
      };
    }

    if (!this.paypalForm.paypal_email.trim()) {
      this.errorMessage = 'Introduce el correo de PayPal.';
      return null;
    }

    return {
      payment_method: 'paypal',
      paypal_email: this.paypalForm.paypal_email.trim()
    };
  }
}*/

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Cart } from '../../../cart/services/cart';
import { Orders } from '../../services/orders';
import { CartData } from '../../../cart/models/cart.model';
import { Notification } from '../../../../core/services/notification';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit {
  private readonly cartService = inject(Cart);
  private readonly ordersService = inject(Orders);
  private readonly notificationService = inject(Notification);

  loading = false;
  orderLoading = false;
  errorMessage = '';

  cartData: CartData | null = null;

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

    this.errorMessage = '';
    this.orderLoading = true;

    this.ordersService.createStripeSession().subscribe({
      next: (response) => {
        this.orderLoading = false;
        window.location.href = response.url;
      },
      error: (error) => {
        this.orderLoading = false;
        this.errorMessage = error?.error?.message || 'No se pudo iniciar el pago con Stripe.';
        this.notificationService.error(this.errorMessage);
      }
    });
  }
}
