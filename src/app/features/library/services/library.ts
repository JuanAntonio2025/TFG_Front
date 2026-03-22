import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LibraryBook } from '../models/library-book.model';

export interface LibraryResponse {
  data: LibraryBook[];
}

@Injectable({
  providedIn: 'root',
})
export class Library {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/api/v1/library';

  getLibrary(): Observable<LibraryResponse> {
    return this.http.get<LibraryResponse>(this.apiUrl);
  }
}
