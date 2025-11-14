import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../interfaces/SearchTasks';
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';
import { environment } from '../../../../environments/environment';
import { CurrencyColombianPipe, SpanishDatePipe } from '../../../shared/pipes';
import { HelpButtonComponent } from '../../../shared/help-button/help-button';

@Component({
  selector: 'app-task-detail',
  imports: [DashboardNavbar, RouterLink, CurrencyColombianPipe, SpanishDatePipe, HelpButtonComponent],
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
  
  currentUserId = signal<number | null>(null);
  isApplying = signal<boolean>(false);
  hasApplied = signal<boolean>(false);
  isHovering = signal<boolean>(false);
  isWithdrawing = signal<boolean>(false);
  
  taskNotification = this.taskService.taskNotification;
  taskNotificationMessage = this.taskService.taskNotificationMessage;

  ngOnInit() {
    const taskId = this.route.snapshot.paramMap.get('id');
    const from = this.route.snapshot.queryParamMap.get('from');
    
    if (from === 'applied-tasks') {
      this.returnRoute.set('/applied-tasks');
    } else if (from === 'search') {
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
      this.loadCurrentUser();
      this.checkApplicationStatus();
    } else {
      this.error.set(true);
      this.errorMessage.set('ID de tarea no válido');
      this.isLoading.set(false);
    }
  }

  private loadCurrentUser() {
    this.taskService.getCurrentUser().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.currentUserId.set(response.data.id);
        }
      },
      error: (error) => {
        console.error('Error loading current user:', error);
      }
    });
  }

  private checkApplicationStatus() {
    const taskId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    if (!taskId) return;

    this.taskService.checkApplicationStatus(taskId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.hasApplied.set(response.data.hasApplied);
        }
      },
      error: (error) => {
        this.hasApplied.set(false);
      }
    });
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
    if (!taskData || !taskData.creator.photo_url) {
      return '/images/WebP/profile_mock.png';
    }
    
    return `${environment.supabaseStorageUrl}/${taskData.creator.photo_url}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== '/images/WebP/profile_mock.png') {
      img.src = '/images/WebP/profile_mock.png';
    }
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

  get isOwner(): boolean {
    const userId = this.currentUserId();
    const task = this.task();
    return userId !== null && task !== null && userId === task.creator_id;
  }

  get canApply(): boolean {
    return !this.isOwner && !this.hasApplied() && !this.isApplying() && !this.isWithdrawing();
  }

  get canWithdraw(): boolean {
    return !this.isOwner && this.hasApplied() && !this.isApplying() && !this.isWithdrawing();
  }

  get applyButtonText(): string {
    if (this.isOwner) return 'Tu tarea';
    if (this.isWithdrawing()) return 'Despostulando...';
    if (this.hasApplied() && this.isHovering()) return 'Despostularse';
    if (this.hasApplied()) return 'Postulado';
    if (this.isApplying()) return 'Postulando...';
    return 'Postularme';
  }

  get applyButtonClass(): string {
    const baseClass = "postular w-full md:w-auto px-4 md:px-20 lg:px-24 py-2 lg:py-2.5 rounded-xl font-semibold shadow-sm border border-black text-center text-sm lg:text-base flex items-center justify-center gap-2 transition-colors";
    
    if (this.isOwner) {
      return baseClass + " bg-gray-300 text-gray-600 cursor-not-allowed";
    }
    if (this.isWithdrawing()) {
      return baseClass + " bg-gray-400 text-white cursor-not-allowed";
    }
    if (this.hasApplied() && this.isHovering()) {
      return baseClass + " bg-main-blue text-white hover:bg-blue-600 cursor-pointer";
    }
    if (this.hasApplied()) {
      return baseClass + " bg-yellow-400 text-black hover:bg-main-blue hover:text-white cursor-pointer";
    }
    if (this.isApplying()) {
      return baseClass + " bg-gray-400 text-white cursor-not-allowed";
    }
    return baseClass + " bg-gradient-to-b bg-main-blue text-white hover:bg-blue-600 cursor-pointer";
  }

  applyToTask() {
    if (!this.canApply && !this.canWithdraw) return;

    const task = this.task();
    if (!task) return;

    if (this.hasApplied()) {
      this.isWithdrawing.set(true);
      this.taskService.withdrawApplication(task.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.hasApplied.set(false);
            this.taskService.markAsWithdrawn(task.id);
            this.taskService.taskNotification.set(true);
            this.taskService.taskNotificationMessage.set('Te despostulaste correctamente');
            
            setTimeout(() => {
              this.taskService.taskNotification.set(false);
            }, 5000);
          } else {
            console.error('Error withdrawing application:', response.message);
          }
          this.isWithdrawing.set(false);
        },
        error: (error) => {
          
          if (error.status === 400 && error.error?.message?.includes('Application status is not "applied"')) {
            this.taskService.taskNotification.set(true);
            this.taskService.taskNotificationMessage.set('No puedes despostularte, el creador de la tarea ya te ha seleccionado');
            
            setTimeout(() => {
              this.taskService.taskNotification.set(false);
            }, 5000);
          } else {
            this.taskService.taskNotification.set(true);
            this.taskService.taskNotificationMessage.set('Error al despostularse. Intenta nuevamente');
            
            setTimeout(() => {
              this.taskService.taskNotification.set(false);
            }, 5000);
          }
          
          this.isWithdrawing.set(false);
        }
      });
    } else {
      this.isApplying.set(true);
      this.taskService.applyToTask(task.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.hasApplied.set(true);
            this.taskService.markAsApplied(task.id);
            this.taskService.taskNotification.set(true);
            this.taskService.taskNotificationMessage.set('Te postulaste correctamente');
            
            setTimeout(() => {
              this.taskService.taskNotification.set(false);
            }, 5000);
          }
          this.isApplying.set(false);
        },
        error: (error) => {
          this.isApplying.set(false);
        }
      });
    }
  }

  onMouseEnter() {
    this.isHovering.set(true);
  }

  onMouseLeave() {
    this.isHovering.set(false);
  }
}
