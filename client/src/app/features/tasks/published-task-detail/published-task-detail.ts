import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';
import { CurrencyColombianPipe, SpanishDatePipe } from '../../../shared/pipes';
import { TaskService } from '../services/task.service';
import { TaskDetail, Applicant } from '../interfaces';

@Component({
  selector: 'app-published-task-detail',
  imports: [DashboardNavbar, RouterLink, CurrencyColombianPipe, SpanishDatePipe],
  templateUrl: './published-task-detail.html',
  styleUrl: './published-task-detail.css'
})
export default class PublishedTaskDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);
  
  taskDetail = signal<TaskDetail | null>(null);
  applicants = signal<Applicant[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit() {
    const taskId = this.route.snapshot.paramMap.get('id');
    
    if (taskId) {
      this.loadTaskWithApplications(parseInt(taskId, 10));
    } else {
      this.error.set('ID de tarea no encontrado en la URL');
    }
  }

  private loadTaskWithApplications(taskId: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.taskService.getPublishedTaskWithApplications(taskId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const taskDetail: TaskDetail = {
            id: response.data.id,
            creator_id: response.data.creator_id,
            selected_user_id: response.data.selected_user_id,
            title: response.data.title,
            description: response.data.description,
            city: response.data.city,
            neighborhood: response.data.neighborhood,
            duration_days: response.data.duration_days,
            salary: parseFloat(response.data.salary),
            status: response.data.status,
            created_at: response.data.created_at
          };
          
          this.taskDetail.set(taskDetail);
          this.applicants.set(response.data.applications || []);
        } else {
          this.error.set('Error al cargar los detalles de la tarea');
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading task details:', error);
        this.error.set('Error al cargar los detalles de la tarea');
        this.isLoading.set(false);
      }
    });
  }



  get statusText(): string {
    const task = this.taskDetail();
    if (!task) return 'Sin estado';
    
    switch (task.status) {
      case 'available':
        return 'Disponible';
      case 'in_progress':
        return 'En progreso';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Sin estado';
    }
  }

  get durationText(): string {
    const task = this.taskDetail();
    if (!task) return '';
    
    const days = task.duration_days;
    return days === 1 ? '1 día' : `${days} días`;
  }

  onSelectApplicant(): void {
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== '/images/WebP/profile_mock.png') {
      img.src = '/images/WebP/profile_mock.png';
    }
  }
}
