import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { DashboardNavbar } from '../../shared/dashboard-navbar/dashboard-navbar';
import { HomeNavbar } from '../../shared/home-navbar/home-navbar';
import { Location } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-help-view',
  standalone: true,
  imports: [RouterLink, RouterOutlet, DashboardNavbar, HomeNavbar],
  templateUrl: './help-view.html',
  styleUrl: './help-view.css'
})
export default class HelpView implements OnInit {
  private location = inject(Location);
  private router = inject(Router);
  private authService = inject(AuthService);

  isAuthenticated = signal<boolean>(false);

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe({
      next: (authenticated) => this.isAuthenticated.set(authenticated),
      error: () => this.isAuthenticated.set(false)
    });
  }

  goBack(): void {
    this.location.back();
  }

  hasActiveChild(): boolean {
    const url = this.router.url;
    return url !== '/help' && url.startsWith('/help/');
  }
}
