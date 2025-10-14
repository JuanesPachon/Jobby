import { Component, inject, OnInit, OnDestroy, computed } from '@angular/core';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-published-tasks',
  imports: [],
  templateUrl: './published-tasks.html',
  styleUrl: './published-tasks.css'
})
export default class PublishedTasks implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  private timeoutId?: number;

  taskNotification = computed(() => this.taskService.taskNotification());
  taskNotificationMessage = computed(() => this.taskService.taskNotificationMessage());

  ngOnInit() {
    if (this.taskNotification()) {
      this.timeoutId = window.setTimeout(() => {
        this.taskService.taskNotification.set(false);
      }, 5000);
    }
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
