import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';
import { CurrencyColombianPipe, SpanishDatePipe } from '../../../shared/pipes';
import { TaskService } from '../services/task.service';
import { TaskDetail, Applicant } from '../interfaces';
import { NgClass } from '@angular/common';
import { CancelTaskModal } from '../components/cancel-task-modal/cancel-task-modal';
import { environment } from '../../../../environments/environment';
import { HelpButtonComponent } from '../../../shared/help-button/help-button';

@Component({
  selector: 'app-published-task-detail',
  imports: [DashboardNavbar, RouterLink, CurrencyColombianPipe, SpanishDatePipe, NgClass, CancelTaskModal, HelpButtonComponent],
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
  isSelectingApplicant = signal<number | null>(null);
  hoveredApplicant = signal<number | null>(null);
  isStartingTask = signal<boolean>(false);
  taskNotification = signal<boolean>(false);
  taskNotificationMessage = signal<string>('');
  isCancelModalOpen = signal<boolean>(false);
  isCancellingTask = signal<boolean>(false);
  isCompletingTask = signal<boolean>(false);

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
          const activeApplications = (response.data.applications || [])
            .filter((app: any) => app.status !== 'withdrawn')
            .map((app: any) => ({
              id: app.applicant_id,        
              application_id: app.id,     
              first_name: app.first_name,
              last_name: app.last_name,               
              photo_url: app.photo_url,
              applied_at: app.applied_at,
              status: app.status
            }));
          this.applicants.set(activeApplications);
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

  refreshApplications(): void {
    const taskDetail = this.taskDetail();
    if (taskDetail) {
      this.loadTaskWithApplications(taskDetail.id);
    }
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

  getStatusIndicatorClass(): string {
    const task = this.taskDetail();
    if (!task) return 'w-3 h-3 rounded-full bg-gray-300';
    
    switch (task.status) {
      case 'available':
        return 'w-3 h-3 rounded-full bg-green-400 shadow-sm';
      case 'in_progress':
        return 'w-3 h-3 rounded-full bg-blue-400 shadow-sm animate-pulse';
      case 'completed':
        return 'w-3 h-3 rounded-full bg-gray-400 shadow-sm';
      case 'cancelled':
        return 'w-3 h-3 rounded-full bg-red-400 shadow-sm';
      default:
        return 'w-3 h-3 rounded-full bg-gray-300';
    }
  }

  getStatusTextClass(): string {
    const task = this.taskDetail();
    if (!task) return 'text-gray-500';
    
    switch (task.status) {
      case 'available':
        return 'text-green-700 bg-green-500/30 px-3 py-1 rounded-full text-sm border border-green-700';
      case 'in_progress':
        return 'text-blue-700 bg-blue-500/30 px-3 py-1 rounded-full text-sm border border-blue-700';
      case 'completed':
        return 'text-gray-700 bg-gray-500/30 px-3 py-1 rounded-full text-sm border border-gray-700';
      case 'cancelled':
        return 'text-red-700 bg-red-500/30 px-3 py-1 rounded-full text-sm border border-red-700';
      default:
        return 'text-gray-500';
    }
  }

  get durationText(): string {
    const task = this.taskDetail();
    if (!task) return '';
    
    const days = task.duration_days;
    return days === 1 ? '1 día' : `${days} días`;
  }

  onSelectApplicant(applicant: Applicant): void {
    const taskDetail = this.taskDetail();
    if (!taskDetail) return;

    this.isSelectingApplicant.set(applicant.application_id);

    if (applicant.status === 'selected') {
      this.taskService.deselectApplicant(taskDetail.id).subscribe({
        next: (response) => {
          if (response.success) {
            const currentApplicants = this.applicants();
            const updatedApplicants = currentApplicants.map(app => 
              app.application_id === applicant.application_id 
                ? { ...app, status: 'applied' as const }
                : app
            );
            this.applicants.set(updatedApplicants);

            const updatedTask = { ...taskDetail, selected_user_id: null };
            this.taskDetail.set(updatedTask);
          }
          this.isSelectingApplicant.set(null);
        },
        error: (error) => {
          console.error('Error deselecting applicant:', error);
          this.isSelectingApplicant.set(null);
        }
      });
    } else {
      this.taskService.selectApplicant(taskDetail.id, applicant.id).subscribe({
        next: (response) => {
          if (response.success) {
            const currentApplicants = this.applicants();
            const updatedApplicants = currentApplicants.map(app => 
              app.application_id === applicant.application_id 
                ? { ...app, status: 'selected' as const }
                : { ...app, status: 'applied' as const }
            );
            this.applicants.set(updatedApplicants);

            const updatedTask = { ...taskDetail, selected_user_id: applicant.id };
            this.taskDetail.set(updatedTask);
          }
          this.isSelectingApplicant.set(null);
        },
        error: (error) => {
          console.error('Error selecting applicant:', error);
          this.isSelectingApplicant.set(null);
        }
      });
    }
  }

  onMouseEnterApplicant(applicantId: number): void {
    this.hoveredApplicant.set(applicantId);
  }

  onMouseLeaveApplicant(): void {
    this.hoveredApplicant.set(null);
  }

  getButtonText(applicant: Applicant): string {
    const isLoading = this.isSelectingApplicant() === applicant.application_id;
    const isHovered = this.hoveredApplicant() === applicant.application_id;
    
    if (isLoading) {
      return 'Cargando...';
    }
    
    if (applicant.status === 'selected') {
      return isHovered ? 'Deseleccionar' : 'Seleccionado';
    }
    
    return 'Seleccionar';
  }

  getButtonClass(applicant: Applicant): string {
    const isLoading = this.isSelectingApplicant() === applicant.application_id;
    const isHovered = this.hoveredApplicant() === applicant.application_id;
    
    if (isLoading) {
      return 'px-4 py-2 sm:px-6 sm:py-2 rounded-full bg-gray-400 text-white text-xs sm:text-sm font-medium border border-black cursor-not-allowed';
    }
    
    if (applicant.status === 'selected') {
      if (isHovered) {
        return 'px-4 py-2 sm:px-6 sm:py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-medium border border-black transition-colors cursor-pointer';
      }
      return 'px-4 py-2 sm:px-6 sm:py-2 rounded-full bg-main-yelllow hover:bg-yellow-500 text-black text-xs sm:text-sm font-medium border border-black transition-colors cursor-pointer';
    }
    
    return 'px-4 py-2 sm:px-6 sm:py-2 rounded-full bg-main-blue hover:bg-blue-600 text-white text-xs sm:text-sm font-medium border border-black transition-colors cursor-pointer';
  }

  onStartTask(): void {
    const taskDetail = this.taskDetail();
    if (!taskDetail) return;

    this.isStartingTask.set(true);

    this.taskService.startTask(taskDetail.id).subscribe({
      next: (response) => {
        if (response.success) {
          const updatedTask = { ...taskDetail, status: 'in_progress' as const };
          this.taskDetail.set(updatedTask);

          this.taskNotificationMessage.set('Ha empezado la tarea exitosamente');
          this.taskNotification.set(true);
          
          setTimeout(() => {
            this.taskNotification.set(false);
          }, 3000);
        }
        this.isStartingTask.set(false);
      },
      error: (error) => {
        this.isStartingTask.set(false);
      }
    });
  }

  canStartTask(): boolean {
    const taskDetail = this.taskDetail();
    if (!taskDetail) return false;
    
    return taskDetail.status === 'available' && taskDetail.selected_user_id !== null;
  }

  getStartTaskButtonClass(): string {
    const canStart = this.canStartTask();
    const isLoading = this.isStartingTask();
    
    if (isLoading) {
      return 'px-6 py-2 rounded-full bg-gray-400 text-white text-sm font-medium border border-black cursor-not-allowed';
    }
    
    if (!canStart) {
      return 'px-6 py-2 rounded-full bg-gray-300 text-gray-500 text-sm font-medium border border-black cursor-not-allowed';
    }
    
    return 'px-6 py-2 rounded-full bg-main-blue hover:bg-blue-600 text-white text-sm font-medium border border-black transition-colors cursor-pointer';
  }

  getStartTaskButtonText(): string {
    const isLoading = this.isStartingTask();
    return isLoading ? 'Iniciando...' : this.taskDetail()?.status === 'in_progress'? 'Tarea iniciada' : 'Empezar tarea'; 
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== '/images/WebP/profile_mock.png') {
      img.src = '/images/WebP/profile_mock.png';
    }
  }

  getPhotoUrl(photoPath: string | null | undefined): string {
    if (!photoPath || photoPath === '/images/WebP/profile_mock.png') {
      return '/images/WebP/profile_mock.png';
    }
    return `${environment.supabaseStorageUrl}${photoPath}`;
  }

  onCancelTask(): void {
    // No abrir modal si el botón está deshabilitado
    if (!this.isCancelTaskEnabled()) {
      return;
    }
    
    this.isCancelModalOpen.set(true);
  }

  onConfirmCancel(): void {
    const taskDetail = this.taskDetail();
    if (!taskDetail) return;

    this.isCancellingTask.set(true);

    this.taskService.cancelTask(taskDetail.id).subscribe({
      next: (response) => {
        if (response.success) {
          const updatedTask = { ...taskDetail, status: 'cancelled' as const };
          this.taskDetail.set(updatedTask);

          this.taskNotificationMessage.set('Tarea cancelada exitosamente');
          this.taskNotification.set(true);
          
          setTimeout(() => {
            this.taskNotification.set(false);
          }, 3000);
        }
        this.isCancellingTask.set(false);
        this.isCancelModalOpen.set(false);
      },
      error: (error) => {
        console.error('Error cancelling task:', error);
        this.isCancellingTask.set(false);
        this.isCancelModalOpen.set(false);
        
        this.taskNotificationMessage.set('Error al cancelar la tarea');
        this.taskNotification.set(true);
        
        setTimeout(() => {
          this.taskNotification.set(false);
        }, 3000);
      }
    });
  }

  onCancelModal(): void {
    this.isCancelModalOpen.set(false);
  }

  canCancelTask(): boolean {
    const taskDetail = this.taskDetail();
    if (!taskDetail) return false;
    
    return taskDetail.status === 'available' || taskDetail.status === 'in_progress';
  }

  isCancelTaskEnabled(): boolean {
    const taskDetail = this.taskDetail();
    if (!taskDetail) return false;
    
    return (taskDetail.status === 'available' && taskDetail.selected_user_id === null) ||
           taskDetail.status === 'in_progress';
  }

  getCancelTaskButtonClass(): string {
    const isEnabled = this.isCancelTaskEnabled();
    
    if (!isEnabled) {
      return 'w-full sm:w-auto px-6 py-2 rounded-full bg-gray-300 text-gray-500 text-sm font-medium border border-black cursor-not-allowed';
    }
    
    return 'w-full sm:w-auto px-6 py-2 rounded-full bg-white hover:bg-gray-300 text-sm font-medium border border-black transition-colors cursor-pointer';
  }

  onCompleteTask(): void {
    const taskDetail = this.taskDetail();
    if (!taskDetail) return;

    this.isCompletingTask.set(true);

    this.taskService.completeTask(taskDetail.id).subscribe({
      next: (response) => {
        if (response.success) {
          const updatedTask = { ...taskDetail, status: 'completed' as const };
          this.taskDetail.set(updatedTask);

          this.taskNotificationMessage.set('Tarea completada exitosamente');
          this.taskNotification.set(true);
          
          setTimeout(() => {
            this.taskNotification.set(false);
          }, 3000);
        }
        this.isCompletingTask.set(false);
      },
      error: (error) => {
        console.error('Error completing task:', error);
        this.isCompletingTask.set(false);
        
        this.taskNotificationMessage.set('Error al completar la tarea');
        this.taskNotification.set(true);
        
        setTimeout(() => {
          this.taskNotification.set(false);
        }, 3000);
      }
    });
  }

  canCompleteTask(): boolean {
    const taskDetail = this.taskDetail();
    if (!taskDetail) return false;
    
    return taskDetail.status === 'in_progress';
  }

  getCompleteTaskButtonClass(): string {
    const canComplete = this.canCompleteTask();
    const isLoading = this.isCompletingTask();
    
    if (isLoading) {
      return 'w-full sm:w-auto px-6 py-2 rounded-full bg-gray-400 text-white text-sm font-medium border border-black cursor-not-allowed';
    }
    
    if (!canComplete) {
      return 'hidden';
    }
    
    return 'w-full sm:w-auto px-6 py-2 rounded-full bg-main-blue hover:bg-blue-600 text-white text-sm font-medium border border-black transition-colors cursor-pointer';
  }

  getCompleteTaskButtonText(): string {
    const isLoading = this.isCompletingTask();
    return isLoading ? 'Completando...' : 'Completar tarea';
  }
}
