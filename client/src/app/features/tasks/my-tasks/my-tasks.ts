import { Component} from '@angular/core';
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [DashboardNavbar, RouterLink],
  templateUrl: './my-tasks.html',
  styleUrl: './my-tasks.css'
})
export default class MyTasksComponent {

}