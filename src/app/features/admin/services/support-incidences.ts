import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Incidence } from '../../incidences/models/incidence.model';
import { IncidenceMessage } from '../../incidences/models/message.model';

export interface SupportIncidencesResponse {
  data: Incidence[];
}

export interface SupportIncidenceResponse {
  data: Incidence;
}

export interface SupportMessageResponse {
  message: string;
  data: IncidenceMessage;
}

@Injectable({
  providedIn: 'root',
})
export class SupportIncidences {
  private readonly http = inject(HttpClient);
  private readonly supportApiUrl = 'http://127.0.0.1:8000/api/v1/support/incidences';

  getIncidences(status?: 'active' | 'inactive'): Observable<SupportIncidencesResponse> {
    let params = new HttpParams();

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<SupportIncidencesResponse>(this.supportApiUrl, { params });
  }

  getIncidenceById(incidenceId: number): Observable<SupportIncidenceResponse> {
    return this.http.get<SupportIncidenceResponse>(`${this.supportApiUrl}/${incidenceId}`);
  }

  updateIncidenceStatus(incidenceId: number, status: 'active' | 'inactive') {
    return this.http.patch<{ message: string; data: { incidence_id: number; status: string } }>(
      `${this.supportApiUrl}/${incidenceId}/status`,
      { status }
    );
  }

  sendSupportMessage(incidenceId: number, message: string): Observable<SupportMessageResponse> {
    return this.http.post<SupportMessageResponse>(`${this.supportApiUrl}/${incidenceId}/messages`, {
      message
    });
  }
}
