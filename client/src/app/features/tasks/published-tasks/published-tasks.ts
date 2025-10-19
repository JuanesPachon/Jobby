import { Component, inject, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskService } from '../services/task.service';
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';
import { PublishedTaskCard } from '../components/published-task-card/published-task-card';
import { PublishedTask } from '../interfaces';

@Component({
  selector: 'app-published-tasks',
  imports: [DashboardNavbar, RouterLink, PublishedTaskCard],
  templateUrl: './published-tasks.html',
  styleUrl: './published-tasks.css'
})
export default class PublishedTasks implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  private timeoutId?: number;

  taskNotification = computed(() => this.taskService.taskNotification());
  taskNotificationMessage = computed(() => this.taskService.taskNotificationMessage());
  
  publishedTasks = signal<PublishedTask[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit() {
    if (this.taskNotification()) {
      this.timeoutId = window.setTimeout(() => {
        this.taskService.taskNotification.set(false);
      }, 5000);
    }
    
    this.loadPublishedTasks();
  }

  loadPublishedTasks(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.taskService.getMyPublishedTasks().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.publishedTasks.set(response.data);
        } else {
          this.error.set('Error al cargar las tareas publicadas');
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set('Error al cargar las tareas publicadas');
        this.isLoading.set(false);
      }
    });
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
