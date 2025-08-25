import { Component } from '@angular/core';
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [DashboardNavbar, RouterLink],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export default class UserProfile {

}
