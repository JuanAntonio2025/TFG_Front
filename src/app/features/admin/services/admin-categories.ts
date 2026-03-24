import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Category } from '../../public/models/category.model';

export interface AdminCategoriesResponse {
  data: Category[];
}

export interface AdminCategoryResponse {
  message?: string;
  data: Category;
}

@Injectable({
  providedIn: 'root',
})
export class AdminCategories {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/api/v1/admin/categories';

  getCategories(): Observable<AdminCategoriesResponse> {
    return this.http.get<AdminCategoriesResponse>(this.apiUrl);
  }

  getCategoryById(categoryId: number): Observable<AdminCategoryResponse> {
    return this.http.get<AdminCategoryResponse>(`${this.apiUrl}/${categoryId}`);
  }

  createCategory(payload: { name: string; description: string }): Observable<AdminCategoryResponse> {
    return this.http.post<AdminCategoryResponse>(this.apiUrl, payload);
  }

  updateCategory(categoryId: number, payload: { name?: string; description?: string }): Observable<AdminCategoryResponse> {
    return this.http.put<AdminCategoryResponse>(`${this.apiUrl}/${categoryId}`, payload);
  }

  deleteCategory(categoryId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${categoryId}`);
  }
}
