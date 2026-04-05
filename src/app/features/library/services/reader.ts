import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ReaderContentResponse } from '../models/reader-content.model';

@Injectable({
  providedIn: 'root',
})
export class Reader {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/reader`;

  getBookContent(bookId: number): Observable<ReaderContentResponse> {
    return this.http.get<ReaderContentResponse>(`${this.apiUrl}/${bookId}`);
  }

  getBookFileUrl(bookId: number): string {
    return `${environment.apiBaseUrl}/reader/${bookId}/file`;
  }

  getBookFileBlob(bookId: number) {
    return this.http.get(`${this.apiUrl}/${bookId}/file`, {
      responseType: 'blob'
    });
  }
}
