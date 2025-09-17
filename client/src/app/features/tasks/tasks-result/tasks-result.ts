import { Component } from '@angular/core';
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';
import { TaskCard } from '../components/task-card/task-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasks-result',
  imports: [DashboardNavbar, TaskCard, RouterLink],
  templateUrl: './tasks-result.html'
})
export default class TasksResult {

}
