import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageUrl {
  resolve(path?: string | null): string {
    if (!path) {
      return 'https://via.placeholder.com/200x290?text=Libro';
    }

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    return `${environment.backendBaseUrl}/storage/${path}`;
  }
}
