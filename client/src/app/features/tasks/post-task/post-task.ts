import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para ngFor
import { RouterLink, RouterModule } from '@angular/router'; // Para el botón de regresar
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';

interface Applicant {
  id: number;
  name: string;
  avatar: string; // Ruta al avatar
}

@Component({
  selector: 'app-public-task',
  imports: [DashboardNavbar, RouterLink],
  templateUrl: './post-task.html',
  styleUrl: './post-task.css'
})
export default class PublishedTasksComponent {

  // Datos de la tarea publicada (simulados)
  task = {
    title: 'Jardinero',
    description: 'Mantenimiento jardín',
    details: [
      'Se requiere persona para labores de jardinería: siembra, trasplante, mantenimiento y manejo de sistemas de riego.',
      'Se requiere persona para labores de jardinería: siembra, trasplante, mantenimiento y manejo de sistemas de riego.',
    ],
    date: '09 de Mayo de 2025',
    available: 'Disponible'
  };

  // Personas que han postulado (simuladas)
  applicants: Applicant[] = [
    { id: 1, name: 'John Doe', avatar: '/images/WebP/avatar.png' }, // Usamos el mismo avatar por simplicidad
    { id: 2, name: 'Juan Pérez', avatar: '/images/WebP/avatar.png' },
    { id: 3, name: 'Juan Pérez', avatar: '/images/WebP/avatar.png' }
  ];

  constructor() { }

  selectApplicant(applicantId: number) {
    console.log(`Candidato seleccionado: ${applicantId}`);
    // Aquí iría la lógica para "seleccionar" al candidato
    alert(`Has seleccionado a ${this.applicants.find(a => a.id === applicantId)?.name}`);
  }
}

