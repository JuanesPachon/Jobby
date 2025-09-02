import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { UserData, Experience, Skill, Document } from '../interfaces/userData.interface';
import { UserProfileSkeletonComponent } from './components/user-profile-skeleton';
import { UserProfileErrorComponent } from './components/user-profile-error';
import { EditExperiences } from './components/edit-experiences/edit-experiences';
import { EditSkills } from './components/edit-skills/edit-skills';
import { EditDocuments } from './components/edit-documents/edit-documents';
import { DeleteConfirmationModal } from './components/delete-confirmation-modal/delete-confirmation-modal';
import { EditPhoto } from "./components/edit-photo/edit-photo";
import { EditBasicInfo } from './components/edit-basic-info/edit-basic-info';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    DashboardNavbar,
    RouterLink,
    CommonModule,
    UserProfileSkeletonComponent,
    UserProfileErrorComponent,
    EditExperiences,
    EditSkills,
    EditDocuments,
    DeleteConfirmationModal,
    EditPhoto,
    EditBasicInfo
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

  // Skills Modal

  isSkillsModalOpen = signal<boolean>(false);

  openSkillsModal(): void {
    this.isSkillsModalOpen.set(true);
  }

  closeSkillsModal(): void {
    this.isSkillsModalOpen.set(false);
  }

  // Documents Modal

  isDocumentsModalOpen = signal<boolean>(false);

  openDocumentsModal(): void {
    this.isDocumentsModalOpen.set(true);
  }

  closeDocumentsModal(): void {
    this.isDocumentsModalOpen.set(false);
  }

  // Photo Modal
  isPhotoModalOpen = signal<boolean>(false);

  openPhotoModal(): void {
    this.isPhotoModalOpen.set(true);
  }

  closePhotoModal(): void {
    this.isPhotoModalOpen.set(false);
  }

  // Basic Info Modal
  isBasicInfoModalOpen = signal<boolean>(false);

  openBasicInfoModal(): void {
    this.isBasicInfoModalOpen.set(true);
  }

  closeBasicInfoModal(): void {
    this.isBasicInfoModalOpen.set(false);
  }

  // Delete Confirmation Modal

  isDeleteModalOpen = signal<boolean>(false);
  deleteResourceType = signal<string>('');
  deleteResourceName = signal<string>('');
  deleteResourceId = signal<number | null>(null);
  pendingDeleteAction = signal<'experience' | 'skill' | 'document' | null>(null);

  openDeleteModal(type: 'experience' | 'skill' | 'document', resourceName: string, resourceId: number): void {
    const typeNames = {
      'experience': 'la experiencia',
      'skill': 'la habilidad',
      'document': 'el documento'
    };
    
    this.deleteResourceType.set(typeNames[type]);
    this.deleteResourceName.set(resourceName);
    this.deleteResourceId.set(resourceId);
    this.pendingDeleteAction.set(type);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.deleteResourceType.set('');
    this.deleteResourceName.set('');
    this.deleteResourceId.set(null);
    this.pendingDeleteAction.set(null);
  }

}