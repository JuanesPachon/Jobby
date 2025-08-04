import { Router } from '@angular/router';
import { AuthService } from './../../core/services/auth.service';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-navbar.html',
  styleUrl: './dashboard-navbar.css'
})
export class DashboardNavbar {
  private authService = inject(AuthService)
  private router = inject(Router)
  isDropdownOpen = signal<boolean>(false);

  toggleDropdown(): void {
    this.isDropdownOpen.update(value => !value);
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