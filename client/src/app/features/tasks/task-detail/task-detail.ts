import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../interfaces/SearchTasks';
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-task-detail',
  imports: [DashboardNavbar, RouterLink],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css'
})
export default class TaskDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);

  task = signal<Task | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<boolean>(false);
  errorMessage = signal<string>('');
  returnRoute = signal<string>('/dashboard');

  ngOnInit() {
    const taskId = this.route.snapshot.paramMap.get('id');
    const from = this.route.snapshot.queryParamMap.get('from');
    
    if (from === 'search') {
      this.returnRoute.set('/task-result');
    } else if (from === 'dashboard') {
      this.returnRoute.set('/dashboard');
    } else {
      const searchFilters = this.taskService.searchFilters();
      if (searchFilters && (searchFilters.position || searchFilters.city)) {
        this.returnRoute.set('/task-result');
      } else {
        this.returnRoute.set('/dashboard');
      }
    }
    
    if (taskId) {
      this.loadTask(parseInt(taskId, 10));
    } else {
      this.error.set(true);
      this.errorMessage.set('ID de tarea no válido');
      this.isLoading.set(false);
    }
  }

  private loadTask(taskId: number) {
    this.taskService.getTaskById(taskId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.task.set(response.data);
          this.error.set(false);
        } else {
          this.error.set(true);
          this.errorMessage.set('No se pudo cargar la tarea');
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.error.set(true);
        this.errorMessage.set('Error al cargar la tarea. Por favor intenta nuevamente.');
        this.isLoading.set(false);
      }
    });
  }

  get formattedSalary(): string {
    const taskData = this.task();
    if (!taskData) return '$0';
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(taskData.salary);
  }

  get formattedDate(): string {
    const taskData = this.task();
    if (!taskData) return '';
    
    const date = new Date(taskData.created_at);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'long',
      year: 'numeric'
    });
  }

  get durationText(): string {
    const taskData = this.task();
    if (!taskData) return '';
    
    return taskData.duration_days === 1 ? '1 día' : `${taskData.duration_days} días`;
  }

  get locationText(): string {
    const taskData = this.task();
    if (!taskData) return '';
    
    if (taskData.city && taskData.neighborhood) {
      return `${taskData.city}, ${taskData.neighborhood}`;
    }
    return taskData.city || 'Sin ubicación';
  }

  get creatorName(): string {
    const taskData = this.task();
    if (!taskData) return '';
    
    return `${taskData.creator.first_name} ${taskData.creator.last_name}`;
  }

  get creatorAvatar(): string {
    const taskData = this.task();
    if (!taskData) return '/images/WebP/avatar.png';
    
    return environment.supabaseStorageUrl + taskData.creator.photo_url || '/images/WebP/avatar.png';
  }

  get statusText(): string {
    const taskData = this.task();
    if (!taskData) return '';
    
    switch (taskData.status) {
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

  get returnButtonText(): string {
    return this.returnRoute() === '/dashboard' 
      ? 'Volver al dashboard' 
      : 'Volver a las tareas';
  }
}
