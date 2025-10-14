import { Component, Input } from '@angular/core';
import { Task } from '../../interfaces/SearchTasks';
import { environment } from '../../../../../environments/environment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-card',
  imports: [RouterLink],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css'
})
export class TaskCard {
  @Input() task?: Task;
  @Input() from: 'dashboard' | 'search' = 'dashboard';

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
}
