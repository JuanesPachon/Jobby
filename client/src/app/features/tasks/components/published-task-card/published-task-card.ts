import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyColombianPipe, SpanishDatePipe, CapitalizePipe } from '../../../../shared/pipes';
import { PublishedTask } from '../../interfaces';

@Component({
    selector: 'app-published-task-card',
    imports: [CurrencyColombianPipe, SpanishDatePipe, CapitalizePipe],
    templateUrl: './published-task-card.html',
    styleUrl: './published-task-card.css',
})
export class PublishedTaskCard {
    @Input() task?: PublishedTask;
    @Input() from?: 'my-tasks' | 'profile' = 'my-tasks';

    private router = inject(Router);

    get displayTask(): PublishedTask {
        if (this.task) {
            return this.task;
        }

        return {
            id: 1,
            creator_id: 1,
            title: 'Enchapador de baño completo',
            description: 'Se requiere enchapador con experiencia para trabajo completo de baño',
            city: 'Bogotá',
            neighborhood: 'Chapinero',
            salary: 350000,
            duration_hours: 24,
            applications_count: 7,
            created_at: '2024-12-15',
            status: 'available',
        };
    }

    get durationText(): string {
        const hours = this.displayTask.duration_hours;
        return hours === 1 ? '1 hora' : `${hours} horas`;
    }

    get applicationsText(): string {
        const count = this.displayTask.applications_count;
        return count === 1 ? '1 postulado' : `${count} postulados`;
    }

    get statusText(): string {
        switch (this.displayTask.status) {
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
        switch (this.displayTask.status) {
            case 'available':
                return 'w-2 h-2 rounded-full bg-green-400';
            case 'in_progress':
                return 'w-2 h-2 rounded-full bg-blue-400';
            case 'completed':
                return 'w-2 h-2 rounded-full bg-gray-400';
            case 'cancelled':
                return 'w-2 h-2 rounded-full bg-red-400';
            default:
                return 'w-2 h-2 rounded-full bg-gray-300';
        }
    }

    getStatusTextClass(): string {
        switch (this.displayTask.status) {
            case 'available':
                return 'text-green-600';
            case 'in_progress':
                return 'text-blue-600';
            case 'completed':
                return 'text-gray-600';
            case 'cancelled':
                return 'text-red-600';
            default:
                return 'text-gray-500';
        }
    }

    onViewApplicants(): void {
        this.router.navigate(['/published-task', this.displayTask.id], {
            queryParams: { from: this.from },
        });
    }
}
