import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Incidences } from '../../services/incidences';
import { Incidence } from '../../models/incidence.model';

@Component({
  selector: 'app-incidences-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './incidences-list.html',
  styleUrl: './incidences-list.scss',
})
export class IncidencesList implements OnInit {
  private readonly incidencesService = inject(Incidences);

  loading = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  incidences: Incidence[] = [];

  form = {
    subject: '',
    type_of_incident: '',
    initial_message: ''
  };

  ngOnInit(): void {
    this.loadIncidences();
  }

  loadIncidences(): void {
    this.loading = true;
    this.errorMessage = '';

    this.incidencesService.getIncidences().subscribe({
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

  createIncidence(): void {
    if (!this.form.subject || !this.form.type_of_incident) {
      this.errorMessage = 'Asunto y tipo de incidencia son obligatorios.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.incidencesService.createIncidence(this.form).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'Incidencia creada correctamente.';
        this.form = {
          subject: '',
          type_of_incident: '',
          initial_message: ''
        };
        this.loadIncidences();
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage = error?.error?.message || 'No se pudo crear la incidencia.';
      }
    });
  }
}
