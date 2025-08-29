import { Component, inject, OnInit } from '@angular/core';
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { UserData } from '../interfaces/userData.interface';
import { UserProfileSkeletonComponent } from './components/user-profile-skeleton';
import { UserProfileErrorComponent } from './components/user-profile-error';

@Component({
  selector: 'app-user-profile', standalone: true,
  imports: [DashboardNavbar, RouterLink, CommonModule, UserProfileSkeletonComponent, UserProfileErrorComponent],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export default class UserProfile implements OnInit {
  userData: UserData = {};
  loading: boolean = true;
  error: string | null = null;
  private userService = inject(UserService);
  ngOnInit(): void {
    this.loadUserProfile();
  }
  loadUserProfile() {
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        this.userData = response.data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar el perfil';
        this.loading = false;
      },
    });
  }

}