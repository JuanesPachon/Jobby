import { Component } from '@angular/core';
import { DashboardNavbar } from '../../shared/dashboard-navbar/dashboard-navbar';
import { TaskCard } from '../tasks/components/task-card/task-card';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  imports: [DashboardNavbar, TaskCard,RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export default class Dashboard {
  
}