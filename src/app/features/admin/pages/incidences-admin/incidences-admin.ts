import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SupportIncidences } from '../../services/support-incidences';
import { Incidence } from '../../../incidences/models/incidence.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-incidences-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './incidences-admin.html',
  styleUrl: './incidences-admin.scss',
})
export class IncidencesAdmin implements OnInit {
  private readonly supportIncidencesService = inject(SupportIncidences);

  loading = false;
  errorMessage = '';
  successMessage = '';

  incidences: Incidence[] = [];
  selectedIncidence: Incidence | null = null;
  supportMessage = '';
  selectedStatus: 'active' | 'inactive' | '' = '';

  ngOnInit(): void {
    this.loadIncidences();
  }

  loadIncidences(status?: 'active' | 'inactive'): void {
    this.loading = true;

    this.supportIncidencesService.getIncidences(status).subscribe({
      next: (response) => {
        this.loading = false;
        this.incidences = response.data;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudieron cargar las incidencias.';
      }
    });
  }

  filterByStatus(): void {
    this.loadIncidences(this.selectedStatus || undefined);
  }

  openIncidence(incidenceId: number): void {
    this.supportIncidencesService.getIncidenceById(incidenceId).subscribe({
      next: (response) => {
        this.selectedIncidence = response.data;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el detalle de la incidencia.';
      }
    });
  }

  updateStatus(status: 'active' | 'inactive'): void {
    if (!this.selectedIncidence) return;

    this.supportIncidencesService.updateIncidenceStatus(this.selectedIncidence.incidence_id, status).subscribe({
      next: () => {
        this.successMessage = 'Estado de la incidencia actualizado.';
        this.openIncidence(this.selectedIncidence!.incidence_id);
        this.loadIncidences(this.selectedStatus || undefined);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'No se pudo actualizar la incidencia.';
      }
    });
  }

  sendMessage(): void {
    if (!this.selectedIncidence || !this.supportMessage.trim()) return;

    this.supportIncidencesService.sendSupportMessage(this.selectedIncidence.incidence_id, this.supportMessage).subscribe({
      next: () => {
        this.successMessage = 'Mensaje enviado correctamente.';
        this.supportMessage = '';
        this.openIncidence(this.selectedIncidence!.incidence_id);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'No se pudo enviar el mensaje.';
      }
    });
  }
}
