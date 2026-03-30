import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CartData } from '../models/cart.model';
import { environment } from '../../../../environments/environment';

export interface CartResponse {
  data: CartData;
}

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/cart`;

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.apiUrl);
  }

  addItem(bookId: number): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.apiUrl}/items`, {
      book_id: bookId
    });
  }

  updateItem(bookId: number, quantity: number): Observable<CartResponse> {
    return this.http.put<CartResponse>(`${this.apiUrl}/items/${bookId}`, {
      quantity
    });
  }

  deleteItem(bookId: number): Observable<{ message: string; data: CartData }> {
    return this.http.delete<{ message: string; data: CartData }>(`${this.apiUrl}/items/${bookId}`);
  }
}
