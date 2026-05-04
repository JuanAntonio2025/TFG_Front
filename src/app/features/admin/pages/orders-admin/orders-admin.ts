import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AdminOrders } from '../../services/admin-orders';
import { AdminOrder } from '../../models/admin-order.model';
import { ImageUrl } from '../../../../core/services/image-url';

@Component({
  selector: 'app-orders-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './orders-admin.html',
  styleUrl: './orders-admin.scss',
})
export class OrdersAdmin implements OnInit {
  private readonly adminOrdersService = inject(AdminOrders);
  protected readonly imageUrlService = inject(ImageUrl);

  loading = false;
  errorMessage = '';

  orders: AdminOrder[] = [];
  selectedOrder: AdminOrder | null = null;

  filters = {
    search: '',
    status: '',
  };

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.adminOrdersService.getOrders({
      search: this.filters.search.trim(),
      status: this.filters.status,
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.orders = response.data;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'No se pudieron cargar los pedidos.';
      }
    });
  }

  clearFilters(): void {
    this.filters = {
      search: '',
      status: '',
    };

    this.loadOrders();
  }

  selectOrder(order: AdminOrder): void {
    this.selectedOrder = order;
  }

  closeDetail(): void {
    this.selectedOrder = null;
  }

  formatDate(value: string): string {
    if (!value) return '-';

    return new Date(value).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
