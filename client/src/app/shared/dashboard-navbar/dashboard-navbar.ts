import { Router, RouterLink } from '@angular/router';
import { AuthService } from './../../core/services/auth.service';
import { UserService } from '../../features/user/services/user.service';
import { Component, inject, signal, OnInit } from '@angular/core';
import { UserData } from '../../features/user/interfaces/userData.interface';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-navbar.html',
  styleUrl: './dashboard-navbar.css'
})
export class DashboardNavbar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private userService = inject(UserService);
  
  isDropdownOpen = signal<boolean>(false);
  userData: UserData = {};

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        this.userData = response.data;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      }
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen.update(value => !value);
  }

  getPhotoUrl(photoPath: string | null | undefined): string {
    return this.userService.getPhotoUrl(photoPath);
  }

  getUserFullName(): string {
    return `${this.userData.first_name || ''} ${this.userData.last_name || ''}`.trim() || 'Usuario';
  }

  attemptSignOut(): void {
    this.authService.attemptSignOut().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Sign out failed');
      }
    });
  } 
}