import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { UserData } from '../interfaces/userData.interface';
import { UserProfileSkeletonComponent } from '../user-profile/components/user-profile-skeleton';
import { UserProfileErrorComponent } from '../user-profile/components/user-profile-error';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [
    DashboardNavbar,
    RouterLink,
    CommonModule,
    UserProfileSkeletonComponent,
    UserProfileErrorComponent
  ],
  templateUrl: './public-profile.html',
  styleUrl: './public-profile.css',
})
export default class PublicProfile implements OnInit {

  private userService = inject(UserService);
  private route = inject(ActivatedRoute);

  userData: UserData = {};
  loading = signal<boolean>(true);
  error = signal<string>('');
  userId: string | null = null;

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.loadPublicProfile(this.userId);
    } else {
      this.error.set('ID de usuario no válido');
      this.loading.set(false);
    }
  }

  loadPublicProfile(userId: string) {
    this.loading.set(true);
    this.userService.getPublicProfile(userId).subscribe({
      next: (response) => {
        this.userData = response.data;
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.error.set('Error al cargar el perfil del usuario');
      },
    });
  }

  getPhotoUrl(photoPath: string | null | undefined): string {
    return this.userService.getPhotoUrl(photoPath);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== '/images/WebP/profile_mock.png') {
      img.src = '/images/WebP/profile_mock.png';
    }
  }
}
