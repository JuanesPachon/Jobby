import { Component, inject, signal, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DashboardNavbar } from '../../shared/dashboard-navbar/dashboard-navbar';
import { TaskCard } from '../tasks/components/task-card/task-card';
import { TaskService } from '../tasks/services/task.service';
import { Task } from '../tasks/interfaces/SearchTasks';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardNavbar, TaskCard, RouterLink, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export default class Dashboard implements OnInit {
  private taskService = inject(TaskService);
  private router = inject(Router);

  searchForm = new FormGroup({
    position: new FormControl(''),
    city: new FormControl('')
  });

  isLoading = signal<Boolean>(false);
  featuredTasks = signal<Task[]>([]);
  isFeaturedLoading = signal<Boolean>(true);
  
  taskNotification = this.taskService.taskNotification;
  taskNotificationMessage = this.taskService.taskNotificationMessage;

  ngOnInit() {
    this.loadFeaturedTasks();
  }

  searchTasks(event: Event) {
    event.preventDefault();

    const formData = this.searchForm.value;
    const filters = {
      position: formData.position || undefined,
      city: formData.city || undefined,
      limit: 10,
      page: 1,
      excludeOwnTasks: true
    };

    this.taskService.setSearchFilters(filters);

    this.router.navigate(['/task-result']);
  }

  private loadFeaturedTasks() {
    this.isFeaturedLoading.set(true);
    this.taskService.getFeaturedTasks(4).subscribe({
      next: (response) => {
        if (response.success && response.data && response.data.tasks) {
          this.featuredTasks.set(response.data.tasks);
        } else {
          this.featuredTasks.set([]);
        }
        this.isFeaturedLoading.set(false);
      },
      error: (error) => {
        this.featuredTasks.set([]);
        this.isFeaturedLoading.set(false);
      }
    });
  }
}