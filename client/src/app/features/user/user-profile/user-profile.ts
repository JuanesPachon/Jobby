import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { UserData, Experience } from '../interfaces/userData.interface';
import { UserProfileSkeletonComponent } from './components/user-profile-skeleton';
import { UserProfileErrorComponent } from './components/user-profile-error';
import { EditExperiences } from './components/edit-experiences/edit-experiences';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    DashboardNavbar,
    RouterLink,
    CommonModule,
    UserProfileSkeletonComponent,
    UserProfileErrorComponent,
    EditExperiences
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export default class UserProfile implements OnInit {
  
  private userService = inject(UserService);

  userData: UserData = {};
  loading = signal<boolean>(true);
  error = signal<string>('');

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        this.userData = response.data;
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  getPhotoUrl(photoPath: string | null | undefined): string {
    return this.userService.getPhotoUrl(photoPath);
  }
  
  //Description
  isEditingDescription = signal<boolean>(false);

  toggleEditDescription(): void {
    this.isEditingDescription.update((value) => !value);
  }

  //Experiences Modal
  isExperienceModalOpen = signal<boolean>(false);
  selectedExperience = signal<Experience | null>(null);

  openExperienceModal(experience?: Experience): void {
    this.selectedExperience.set(experience || null);
    this.isExperienceModalOpen.set(true);
  }

  closeExperienceModal(): void {
    this.isExperienceModalOpen.set(false);
    this.selectedExperience.set(null);
  }
}