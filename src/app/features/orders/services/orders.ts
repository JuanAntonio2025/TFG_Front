import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Order } from '../models/order.model';
import { environment } from '../../../../environments/environment';

export interface CreateOrderResponse {
  message: string;
  data: {
    payment: {
      simulated: boolean;
      method: string | null;
      status: string;
    };
    order: Order;
  };
}

export interface OrdersResponse {
  data: Order[];
}

export interface OrderResponse {
  data: Order;
}

@Injectable({
  providedIn: 'root',
})
export class Orders {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/orders`;

  createOrder(paymentMethod: 'card' | 'paypal'): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(this.apiUrl, {
      payment_method: paymentMethod
    });
  }

  getOrders(): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(this.apiUrl);
  }

  getOrderById(orderId: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${orderId}`);
  }
}
