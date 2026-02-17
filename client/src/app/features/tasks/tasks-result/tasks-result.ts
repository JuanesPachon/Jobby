import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';
import { TaskCard } from '../components/task-card/task-card';
import { RouterLink } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../interfaces/SearchTasks';
import { HelpButtonComponent } from '../../../shared/help-button/help-button';

@Component({
    selector: 'app-tasks-result',
    imports: [DashboardNavbar, TaskCard, RouterLink, HelpButtonComponent],
    templateUrl: './tasks-result.html',
})
export default class TasksResult implements OnInit {
    private taskService = inject(TaskService);

    tasks = signal<Task[]>([]);
    totalTasks = signal<number>(0);
    isLoading = computed(() => this.taskService.isSearching());
    searchFilters = computed(() => this.taskService.searchFilters());

    searchError = signal<boolean>(false);
    searchErrorMessage = signal<string>('');

    currentPage = signal<number>(1);
    itemsPerPage = 10;
    totalPages = computed(() => Math.ceil(this.totalTasks() / this.itemsPerPage));

    taskNotification = this.taskService.taskNotification;
    taskNotificationMessage = this.taskService.taskNotificationMessage;

    ngOnInit() {
        const filters = this.searchFilters();
        if (filters.page) {
            this.currentPage.set(filters.page);
        }
        this.performSearch();
    }

    performSearch() {
        const filters = this.searchFilters();

        if (filters.page) {
            this.currentPage.set(filters.page);
        }

        this.taskService.performSearch().subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.tasks.set(response.data.tasks);
                    this.totalTasks.set(response.data.total);
                    this.taskService.setSearchResults(response.data);
                    this.searchError.set(false);
                } else {
                    this.tasks.set([]);
                    this.totalTasks.set(0);
                    this.searchError.set(true);
                    this.searchErrorMessage.set('No se pudieron cargar los resultados');
                }
            },
            error: (error) => {
                console.error('Error searching tasks:', error);
                this.tasks.set([]);
                this.totalTasks.set(0);
                this.searchError.set(true);
                this.searchErrorMessage.set(
                    'Error al buscar tareas. Por favor intenta nuevamente.'
                );
                this.taskService.setSearchResults(null);
            },
        });
    }

    getDisplayPosition(): string {
        return this.searchFilters().position || 'Todas las posiciones';
    }

    getDisplayCity(): string {
        return this.searchFilters().city || 'Todas las ubicaciones';
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
            this.searchWithPage(page);
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

    private searchWithPage(page: number) {
        const filters = this.searchFilters();
        const searchParams = {
            ...filters,
            page,
            limit: this.itemsPerPage,
            excludeOwnTasks: true,
        };

        this.taskService.setSearchFilters(searchParams);
        this.performSearch();
    }

    getPageNumbers(): number[] {
        const total = this.totalPages();
        const current = this.currentPage();
        const pages: number[] = [];

        if (total <= 7) {
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
}
