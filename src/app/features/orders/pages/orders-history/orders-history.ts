import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Orders } from '../../services/orders';
import { Order } from '../../models/order.model';
import { ImageUrl } from '../../../../core/services/image-url';

@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders-history.html',
  styleUrl: './orders-history.scss',
})
export class OrdersHistory implements OnInit {
  private readonly ordersService = inject(Orders);
  protected readonly imageUrlService = inject(ImageUrl);

  loading = false;
  errorMessage = '';
  orders: Order[] = [];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.ordersService.getOrders().subscribe({
      next: (response) => {
        this.loading = false;
        this.orders = response.data;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo cargar el historial de pedidos.';
      }
    });
  }
}
