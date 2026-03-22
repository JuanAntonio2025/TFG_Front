import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Incidence } from '../models/incidence.model';
import { IncidenceMessage } from '../models/message.model';

export interface IncidencesResponse {
  data: Incidence[];
}

export interface IncidenceResponse {
  data: Incidence;
}

export interface CreateIncidenceResponse {
  message: string;
  data: Incidence;
}

export interface CreateMessageResponse {
  message: string;
  data: IncidenceMessage;
}

@Injectable({
  providedIn: 'root',
})
export class Incidences {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/api/v1/incidences';

  getIncidences(): Observable<IncidencesResponse> {
    return this.http.get<IncidencesResponse>(this.apiUrl);
  }

  getIncidenceById(incidenceId: number): Observable<IncidenceResponse> {
    return this.http.get<IncidenceResponse>(`${this.apiUrl}/${incidenceId}`);
  }

  createIncidence(payload: {
    subject: string;
    type_of_incident: string;
    initial_message?: string;
  }): Observable<CreateIncidenceResponse> {
    return this.http.post<CreateIncidenceResponse>(this.apiUrl, payload);
  }

  createMessage(incidenceId: number, message: string): Observable<CreateMessageResponse> {
    return this.http.post<CreateMessageResponse>(`${this.apiUrl}/${incidenceId}/messages`, {
      message
    });
  }
}
