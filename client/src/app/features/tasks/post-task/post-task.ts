import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';
import { TaskService } from '../services/task.service';
import { CreateTaskRequest } from './interfaces/CreateTaskRequest';

@Component({
  selector: 'app-post-task',
  imports: [DashboardNavbar, RouterLink, ReactiveFormsModule],
  templateUrl: './post-task.html',
  styleUrl: './post-task.css'
})
export default class PostTaskComponent {
  
  private taskService = inject(TaskService);
  private router = inject(Router);

  taskForm = new FormGroup({
    title: new FormControl('', [
      Validators.required, 
      Validators.minLength(3), 
      Validators.maxLength(100)
    ]),
    description: new FormControl('', [
      Validators.required, 
      Validators.minLength(10), 
      Validators.maxLength(1000)
    ]),
    city: new FormControl('', [
      Validators.required, 
      Validators.minLength(2), 
      Validators.maxLength(100),
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-.,()]+$/)
    ]),
    neighborhood: new FormControl('', [
      Validators.maxLength(100),
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-.,()]*$/)
    ]),
    duration_days: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[1-9]\d*$/),
      Validators.min(1),
      Validators.max(365)
    ]),
    salary: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/),
      Validators.min(0)
    ])
  });

  isLoading = signal<Boolean>(false);
  taskError = signal<Boolean>(false);
  taskErrorMessage = signal<string>('');

  attemptCreateTask(event: Event) {
    event.preventDefault();

    if (this.taskForm.valid) {
      this.isLoading.set(true);
      this.taskError.set(false);

      const formData = this.taskForm.value;

      const createTaskRequest: CreateTaskRequest = {
        title: formData.title!,
        description: formData.description!,
        city: formData.city!,
        neighborhood: formData.neighborhood || undefined,
        duration_days: parseInt(formData.duration_days!, 10),
        salary: parseFloat(formData.salary!)
      };

      this.taskService.createTask(createTaskRequest).subscribe({
        next: (response) => {
          this.taskService.taskNotification.set(true);
          this.taskService.taskNotificationMessage.set('Se creó la tarea correctamente');
          this.router.navigate(['/published-tasks']);
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this.taskErrorMessage.set(
            error.status === 400 ? 'Algo falló en el formulario, vuelve a intentarlo.' :
            error.status === 401 ? 'No estás autorizado para realizar esta acción.' :
            'Error en el servidor, por favor intenta más tarde.'
          );
          this.taskError.set(true);
          this.isLoading.set(false);
        }
      });

    } else {
      this.taskErrorMessage.set('Por favor, completa todos los campos requeridos correctamente.');
      this.taskError.set(true);
    }
  }
}

