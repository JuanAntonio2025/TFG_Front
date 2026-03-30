import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Order } from '../models/order.model';
import { environment } from '../../../../environments/environment';

export interface CreateOrderPayload {
  payment_method: 'card' | 'paypal';
  card_holder?: string;
  card_number?: string;
  expiry_date?: string;
  cvv?: string;
  paypal_email?: string;
}

export interface CreateOrderResponse {
  message: string;
  data: {
    payment: {
      simulated: boolean;
      method: string | null;
      status: string;
      transaction_reference: string;
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

  createOrder(payload: CreateOrderPayload): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(this.apiUrl, payload);
  }

  getOrders(): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(this.apiUrl);
  }

  getOrderById(orderId: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${orderId}`);
  }
}
