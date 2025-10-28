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
  totalTasks = signal<number>(0);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  currentPage = signal<number>(1);
  itemsPerPage = 10;
  totalPages = computed(() => Math.ceil(this.totalTasks() / this.itemsPerPage));

  selectedStatus = signal<string>('all');
  statusOptions = [
    { value: 'all', label: 'Todas las tareas', color: 'bg-gray-100 text-gray-800' },
    { value: 'available', label: 'Disponibles', color: 'bg-green-100 text-blue-800' },
    { value: 'in_progress', label: 'En progreso', color: 'bg-blue-100 text-yellow-800' },
    { value: 'completed', label: 'Completadas', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Canceladas', color: 'bg-red-100 text-red-800' }
  ];

  ngOnInit() {
    if (this.taskNotification()) {
      this.timeoutId = window.setTimeout(() => {
        this.taskService.taskNotification.set(false);
      }, 5000);
    }
    
    this.loadPublishedTasks();
  }

  loadPublishedTasks(): void {
    this.loadTasksWithPage(this.currentPage());
  }

  private loadTasksWithPage(page: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    const filters = {
      page,
      limit: this.itemsPerPage,
      status: this.selectedStatus() === 'all' ? undefined : this.selectedStatus()
    };

    console.log('Filtros enviados:', filters); // Debug log

    this.taskService.getMyPublishedTasks(filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.publishedTasks.set(response.data.tasks);
          this.totalTasks.set(response.data.total);
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

  getRangeStart(): number {
    return (this.currentPage() - 1) * this.itemsPerPage + 1;
  }

  getRangeEnd(): number {
    return Math.min(this.currentPage() * this.itemsPerPage, this.totalTasks());
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.currentPage.set(page);
      this.loadTasksWithPage(page);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 1) {
      pages.push(1);
    } else if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push(-1);
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(total);
      }
    }

    return pages;
  }

  onStatusFilterChange(status: string): void {
    console.log('Cambiando filtro a:', status); // Debug log
    this.selectedStatus.set(status);
    this.currentPage.set(1); // Reset to first page
    this.loadTasksWithPage(1);
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
