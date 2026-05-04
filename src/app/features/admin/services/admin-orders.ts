import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { AdminOrderResponse, AdminOrdersResponse } from '../models/admin-order.model';

@Injectable({
  providedIn: 'root',
})
export class AdminOrders {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/admin/orders`;

  getOrders(filters?: { search?: string; status?: string }): Observable<AdminOrdersResponse> {
    let params = new HttpParams();

    if (filters?.search) {
      params = params.set('search', filters.search);
    }

    if (filters?.status) {
      params = params.set('status', filters.status);
    }

    return this.http.get<AdminOrdersResponse>(this.apiUrl, { params });
  }

  getOrderById(orderId: number): Observable<AdminOrderResponse> {
    return this.http.get<AdminOrderResponse>(`${this.apiUrl}/${orderId}`);
  }
}
