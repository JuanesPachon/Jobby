import { Component, Input, inject, signal, OnInit } from '@angular/core';
import { Task } from '../../interfaces/SearchTasks';
import { environment } from '../../../../../environments/environment';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { CurrencyColombianPipe, SpanishDatePipe, CapitalizePipe } from '../../../../shared/pipes';
import { getShortName } from '../../../../shared/utils/name-utils';

@Component({
  selector: 'app-task-card',
  imports: [RouterLink, CurrencyColombianPipe, SpanishDatePipe, CapitalizePipe],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css'
})
export class TaskCard implements OnInit {
  @Input() task?: Task;
  @Input() from: 'dashboard' | 'search' | 'applied-tasks' = 'dashboard';

  private taskService = inject(TaskService);
  
  currentUserId = signal<number | null>(null);
  isApplying = signal<boolean>(false);
  hasApplied = signal<boolean>(false);
  isHovering = signal<boolean>(false);
  isWithdrawing = signal<boolean>(false);

  ngOnInit() {
    this.loadCurrentUser();
    this.checkApplicationStatus();
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
    const taskId = this.displayTask.id;
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

  get displayTask() {
    if (this.task) {
      return this.task;
    }
    
    return {
      id: 1,
      creator_id: 1,
      title: 'Enchapador',
      description: 'Trabajo de enchape de baño completo',
      city: 'Bogotá',
      neighborhood: 'Centro',
      salary: 200000,
      duration_hours: 16,
      status: 'available',
      created_at: '2024-05-09',
      updated_at: '2024-05-09',
      creator: {
        id: 1,
        first_name: 'Jhon',
        last_name: 'Doe',
        photo_url: '/images/WebP/avatar.png'
      }
    };
  }

  get creatorName(): string {
    const task = this.displayTask;
    return getShortName(task.creator.first_name, task.creator.last_name);
  }

  get creatorAvatar(): string {
    const task = this.displayTask;
    if (!task.creator.photo_url) {
      return '/images/WebP/profile_mock.webp';
    }
    return `${environment.supabaseStorageUrl}/${task.creator.photo_url}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== '/images/WebP/profile_mock.webp') {
      img.src = '/images/WebP/profile_mock.webp';
    }
  }



  get durationText(): string {
    const task = this.displayTask;
    return task.duration_hours === 1 ? '1 hora' : `${task.duration_hours} horas`;
  }

  get locationText(): string {
    const task = this.displayTask;
    if (task.city && task.neighborhood) {
      return `${task.city}, ${task.neighborhood}`;
    }
    return task.city || 'Sin ubicación';
  }

  get taskDetailLink(): string {
    return `/task/${this.displayTask.id}`;
  }

  get queryParams(): any {
    return { from: this.from };
  }

  get isOwner(): boolean {
    const userId = this.currentUserId();
    const task = this.displayTask;
    return userId !== null && userId === task.creator_id;
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
    const baseClass = "cursor-pointer px-6 xl:px-8 h-[35px] xl:h-[40px] rounded-full text-sm border border-black whitespace-nowrap font-medium transition-colors";
    
    if (this.isOwner) {
      return baseClass + " bg-gray-300 text-gray-600 cursor-not-allowed";
    }
    if (this.isWithdrawing()) {
      return baseClass + " bg-gray-400 text-white cursor-not-allowed";
    }
    if (this.hasApplied() && this.isHovering()) {
      return baseClass + " bg-main-blue text-white hover:bg-blue-600";
    }
    if (this.hasApplied()) {
      return baseClass + " bg-yellow-400 text-black hover:bg-main-blue hover:text-white";
    }
    if (this.isApplying()) {
      return baseClass + " bg-gray-400 text-white cursor-not-allowed";
    }
    return baseClass + " bg-main-blue text-white hover:bg-blue-600";
  }

  get mobileApplyButtonClass(): string {
    const baseClass = "flex-1 h-9 sm:h-10 md:h-9 rounded-lg text-xs sm:text-sm font-medium border border-black transition-colors";
    
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
    return baseClass + " bg-main-blue text-white hover:bg-blue-600 cursor-pointer";
  }

  applyToTask() {
    if (!this.canApply && !this.canWithdraw) return;

    const taskId = this.displayTask.id;

    if (this.hasApplied()) {
      this.isWithdrawing.set(true);
      this.taskService.withdrawApplication(taskId).subscribe({
        next: (response) => {
          if (response.success) {
            this.hasApplied.set(false);
            this.taskService.markAsWithdrawn(taskId);
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
          console.error('Error withdrawing application:', error);
          
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
      this.taskService.applyToTask(taskId).subscribe({
        next: (response) => {
          console.log('TaskCard: Apply response:', response);
          if (response.success) {
            this.hasApplied.set(true);
            this.taskService.markAsApplied(taskId);
            this.taskService.taskNotification.set(true);
            this.taskService.taskNotificationMessage.set('Te postulaste correctamente');
            
            setTimeout(() => {
              this.taskService.taskNotification.set(false);
            }, 5000);
          } else {
            console.error('Error applying to task:', response.message);
          }
          this.isApplying.set(false);
        },
        error: (error) => {
          console.error('Error applying to task:', error);
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
