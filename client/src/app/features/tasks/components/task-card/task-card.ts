import { Component, Input, inject, signal, OnInit } from '@angular/core';
import { Task } from '../../interfaces/SearchTasks';
import { environment } from '../../../../../environments/environment';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-card',
  imports: [RouterLink],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css'
})
export class TaskCard implements OnInit {
  @Input() task?: Task;
  @Input() from: 'dashboard' | 'search' = 'dashboard';

  private taskService = inject(TaskService);
  
  currentUserId = signal<number | null>(null);
  isApplying = signal<boolean>(false);
  hasApplied = signal<boolean>(false);

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
      duration_days: 2,
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
    return `${task.creator.first_name} ${task.creator.last_name}`;
  }

  get creatorAvatar(): string {
    const task = this.displayTask;
    return environment.supabaseStorageUrl + task.creator.photo_url || '/images/WebP/avatar.png';
  }

  get formattedDate(): string {
    const task = this.displayTask;
    const date = new Date(task.created_at);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'long'
    });
  }

  get formattedSalary(): string {
    const task = this.displayTask;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(task.salary);
  }

  get durationText(): string {
    const task = this.displayTask;
    return task.duration_days === 1 ? '1 día' : `${task.duration_days} días`;
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
    return !this.isOwner && !this.hasApplied() && !this.isApplying();
  }

  get applyButtonText(): string {
    if (this.isOwner) return 'Tu tarea';
    if (this.hasApplied()) return 'Postulado';
    if (this.isApplying()) return 'Postulando...';
    return 'Postularme';
  }

  get applyButtonClass(): string {
    const baseClass = "cursor-pointer px-6 xl:px-8 h-[35px] xl:h-[40px] rounded-full text-sm border border-black whitespace-nowrap font-medium transition-colors";
    
    if (this.isOwner) {
      return baseClass + " bg-gray-300 text-gray-600 cursor-not-allowed";
    }
    if (this.hasApplied()) {
      return baseClass + " bg-yellow-400 text-black hover:bg-yellow-500";
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
    if (this.hasApplied()) {
      return baseClass + " bg-yellow-400 text-black hover:bg-yellow-500 cursor-pointer";
    }
    if (this.isApplying()) {
      return baseClass + " bg-gray-400 text-white cursor-not-allowed";
    }
    return baseClass + " bg-main-blue text-white hover:bg-blue-600 cursor-pointer";
  }

  applyToTask() {
    if (!this.canApply) return;

    this.isApplying.set(true);
    const taskId = this.displayTask.id;

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
