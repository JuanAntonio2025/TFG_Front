import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Incidences } from '../../services/incidences';
import { Incidence } from '../../models/incidence.model';

@Component({
  selector: 'app-incidence-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './incidence-detail.html',
  styleUrl: './incidence-detail.scss',
})
export class IncidenceDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly incidencesService = inject(Incidences);

  loading = false;
  sending = false;
  errorMessage = '';
  successMessage = '';

  incidence: Incidence | null = null;
  newMessage = '';

  ngOnInit(): void {
    const incidenceId = Number(this.route.snapshot.paramMap.get('id'));

    if (!incidenceId) {
      this.errorMessage = 'Incidencia no encontrada.';
      return;
    }

    this.loadIncidence(incidenceId);
  }

  loadIncidence(incidenceId: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.incidencesService.getIncidenceById(incidenceId).subscribe({
      next: (response) => {
        this.loading = false;
        this.incidence = response.data;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo cargar la incidencia.';
      }
    });
  }

  sendMessage(): void {
    if (!this.incidence || !this.newMessage.trim()) {
      return;
    }

    this.sending = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.incidencesService.createMessage(this.incidence.incidence_id, this.newMessage).subscribe({
      next: () => {
        this.sending = false;
        this.successMessage = 'Mensaje enviado correctamente.';
        this.newMessage = '';
        this.loadIncidence(this.incidence!.incidence_id);
      },
      error: (error) => {
        this.sending = false;
        this.errorMessage = error?.error?.message || 'No se pudo enviar el mensaje.';
      }
    });
  }
}
