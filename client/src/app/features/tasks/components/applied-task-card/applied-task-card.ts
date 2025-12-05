import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyColombianPipe, SpanishDatePipe, CapitalizePipe } from '../../../../shared/pipes';
import { environment } from '../../../../../environments/environment';
import { AppliedTask } from '../../interfaces';

@Component({
  selector: 'app-applied-task-card',
  standalone: true,
  imports: [RouterLink, CurrencyColombianPipe, SpanishDatePipe, CapitalizePipe],
  templateUrl: './applied-task-card.html',
  styleUrl: './applied-task-card.css'
})
export class AppliedTaskCard {
  @Input() task?: AppliedTask;

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
      },
      application_status: 'applied',
      user_relation_status: 'applied' as 'applied' | 'selected' | 'in_progress' | 'completed' | 'cancelled'
    };
  }

  get creatorName(): string {
    const task = this.displayTask;
    return `${task.creator.first_name} ${task.creator.last_name}`;
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

  get statusConfig() {
    const status = this.displayTask.user_relation_status;
    
    const configs: Record<string, { text: string; bgColor: string; textColor: string; borderColor: string }> = {
      'applied': {
        text: 'Postulado',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-300'
      },
      'selected': {
        text: 'Seleccionado',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-300'
      },
      'in_progress': {
        text: 'En progreso',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-300'
      },
      'completed': {
        text: 'Completada',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-300'
      },
      'cancelled': {
        text: 'Cancelada',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-300'
      }
    };
    
    return configs[status || 'applied'] || configs['applied'];
  }

  get taskDetailLink(): string {
    return `/task/${this.displayTask.id}`;
  }

  get queryParams(): any {
    return { from: 'applied-tasks' };
  }

  get isTaskCancelled(): boolean {
    return this.displayTask.user_relation_status === 'cancelled';
  }
}
