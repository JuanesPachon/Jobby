import { Component, inject, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../services/task.service';
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';
import { AppliedTaskCard } from '../components/applied-task-card/applied-task-card';
import { AppliedTask } from '../interfaces';
import { HelpButtonComponent } from '../../../shared/help-button/help-button';

@Component({
  selector: 'app-applied-tasks',
  imports: [DashboardNavbar, RouterLink, AppliedTaskCard, HelpButtonComponent],
  templateUrl: './applied-tasks.html',
  styleUrl: './applied-tasks.css'
})
export default class AppliedTasks implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);
  private timeoutId?: number;

  taskNotification = computed(() => this.taskService.taskNotification());
  taskNotificationMessage = computed(() => this.taskService.taskNotificationMessage());
  
  appliedTasks = signal<AppliedTask[]>([]);
  totalTasks = signal<number>(0);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  fromOrigin = signal<'my-tasks' | 'profile'>('my-tasks');
  
  currentPage = signal<number>(1);
  itemsPerPage = 10;
  totalPages = computed(() => Math.ceil(this.totalTasks() / this.itemsPerPage));

  selectedStatus = signal<string>('applied');
  statusOptions = [
    { value: 'applied', label: 'Postulado', color: 'bg-blue-100 text-blue-800' },
    { value: 'selected', label: 'Seleccionado', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'in_progress', label: 'En Progreso', color: 'bg-orange-100 text-orange-800' },
    { value: 'completed', label: 'Completadas', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Canceladas', color: 'bg-red-100 text-red-800' }
  ];

  ngOnInit() {

    const from = this.route.snapshot.queryParamMap.get('from');
    
    if (from === 'profile') {
      this.fromOrigin.set('profile');
    } else {
      this.fromOrigin.set('my-tasks');
    }

    if (this.taskNotification()) {
      this.timeoutId = window.setTimeout(() => {
        this.taskService.taskNotification.set(false);
      }, 5000);
    }
    
    this.loadAppliedTasks();
  }

  loadAppliedTasks(): void {
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


    this.taskService.getMyAppliedTasks(filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.appliedTasks.set(response.data.tasks);
          this.totalTasks.set(response.data.total);
        } else {
          this.error.set('Error al cargar las tareas aplicadas');
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set('Error al cargar las tareas aplicadas');
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
    console.log('Cambiando filtro a:', status);
    this.selectedStatus.set(status);
    this.currentPage.set(1);
    this.loadTasksWithPage(1);
  }

  getEmptyStateMessage(): { title: string; description: string } {
    const status = this.selectedStatus();
    
    switch (status) {
      case 'applied':
        return {
          title: 'No tienes aplicaciones pendientes',
          description: 'Las tareas donde te postulaste pero aún no has sido seleccionado aparecerán aquí.'
        };
      case 'selected':
        return {
          title: 'No has sido seleccionado en ninguna tarea',
          description: 'Las tareas donde fuiste elegido pero aún no han comenzado aparecerán aquí.'
        };
      case 'in_progress':
        return {
          title: 'No tienes tareas en progreso',
          description: 'Las tareas donde fuiste seleccionado y ya están en ejecución aparecerán aquí.'
        };
      case 'completed':
        return {
          title: 'No has completado ninguna tarea',
          description: 'Las tareas que hayas terminado exitosamente aparecerán aquí.'
        };
      case 'cancelled':
        return {
          title: 'No tienes tareas canceladas recientes',
          description: 'Las tareas donde fuiste seleccionado pero fueron canceladas en los últimos 7 días aparecerán aquí.'
        };
      default:
        return {
          title: 'No te has postulado a ninguna tarea',
          description: 'Explora oportunidades laborales y postúlate a las tareas que te interesen.'
        };
    }
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}