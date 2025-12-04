import { Component, inject, OnInit, signal, OnDestroy, ViewChild } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelpButtonComponent } from '../../../shared/help-button/help-button';

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
    EditBasicInfo,
    ReactiveFormsModule,
    HelpButtonComponent
],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export default class UserProfile implements OnInit, OnDestroy {

  private userService = inject(UserService);
  @ViewChild(DeleteConfirmationModal) deleteModal?: DeleteConfirmationModal;

  userData: UserData = {};
  loading = signal<boolean>(true);
  error = signal<string>('');
  private userDataSubscription?: Subscription;

  get userNotification() { return this.userService.userNotification; }
  get notificationMessage() { return this.userService.notificationMessage; }

  descriptionControl = new FormControl('', [Validators.maxLength(500)]);
  isLoadingDescription = signal<boolean>(false);
  hasErrorDescription = signal<boolean>(false);
  errorMessageDescription = signal<string>('');

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

  loadUserProfile() {
    const cachedData = this.userService.getCurrentUserData();
    if (cachedData) {
      this.userData = cachedData;
      this.loading.set(false);
      this.descriptionControl.setValue(cachedData.profile?.description || '');
    }

    this.userDataSubscription = this.userService.userData$.subscribe({
      next: (data) => {
        if (data) {
          this.userData = data;
          this.loading.set(false);
          this.descriptionControl.setValue(data.profile?.description || '');
        }
      }
    });

    if (!cachedData) {
      this.userService.getUserProfile().subscribe({
        next: (response) => {
        },
        error: (error) => {
          this.loading.set(false);
          this.error.set('Error al cargar el perfil');
        },
      });
    }
  }

  getPhotoUrl(photoPath: string | null | undefined): string {
    return this.userService.getPhotoUrl(photoPath);
  }

  viewDocument(fileUrl: string): void {
    const fullUrl = this.userService.getDocumentUrl(fileUrl);
    window.open(fullUrl, '_blank');
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== '/images/WebP/profile_mock.webp') {
      img.src = '/images/WebP/profile_mock.webp';
    }
  }

  formatDate(dateString: string): string {
    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-');
    return `${day}-${month}-${year}`;
  }
  
  //Description

  isEditingDescription = signal<boolean>(false);

  toggleEditDescription(): void {
    this.isEditingDescription.update((value) => !value);
  }

  saveDescription(): void {
    if (this.descriptionControl.valid && !this.isLoadingDescription()) {
      this.isLoadingDescription.set(true);
      this.hasErrorDescription.set(false);
      this.errorMessageDescription.set('');

      const descriptionValue = this.descriptionControl.value || '';
      const updateData = {
        description: descriptionValue
      };

      this.userService.editUserProfile(updateData).subscribe({
        next: (response) => {
          this.isLoadingDescription.set(false);
          this.isEditingDescription.set(false);
        },
        error: (error) => {
          this.errorMessageDescription.set('Error al actualizar la descripción, inténtelo nuevamente más tarde.');
          this.hasErrorDescription.set(true);
          this.isLoadingDescription.set(false);
        },
      });
    } else {
      this.descriptionControl.markAsTouched();
      this.errorMessageDescription.set('Por favor, completa el campo correctamente.');
      this.hasErrorDescription.set(true);
    }
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
    if (this.deleteModal) {
      this.deleteModal.isDeleting.set(false);
    }
  }

  confirmDelete(): void {
    const resourceId = this.deleteResourceId();
    const action = this.pendingDeleteAction();
    
    if (!resourceId || !action) return;

    let updateData: any = {};

    switch (action) {
      case 'experience':
        updateData = {
          experiences: [{
            action: 'delete',
            id: resourceId
          }]
        };
        break;
      case 'skill':
        updateData = {
          skills: [{
            action: 'delete',
            id: resourceId
          }]
        };
        break;
      case 'document':
        updateData = {
          documents: [{
            action: 'delete',
            id: resourceId
          }]
        };
        break;
    }

    this.userService.editUserProfile(updateData).subscribe({
      next: (response) => {
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Error deleting resource:', error);
        this.closeDeleteModal();
      }
    });
  }

}