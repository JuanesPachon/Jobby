import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DashboardNavbar } from '../../shared/dashboard-navbar/dashboard-navbar';
import { TaskCard } from '../tasks/components/task-card/task-card';
import { TaskService } from '../tasks/services/task.service';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardNavbar, TaskCard, RouterLink, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export default class Dashboard {
  private taskService = inject(TaskService);
  private router = inject(Router);

  searchForm = new FormGroup({
    position: new FormControl(''),
    city: new FormControl('')
  });

  isLoading = signal<Boolean>(false);

  searchTasks(event: Event) {
    event.preventDefault();

    const formData = this.searchForm.value;
    const filters = {
      position: formData.position || undefined,
      city: formData.city || undefined,
      limit: 10,
      page: 1
    };

    this.taskService.setSearchFilters(filters);

    this.router.navigate(['/task-result']);
  }
}