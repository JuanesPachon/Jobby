import { Component, input, output, computed } from '@angular/core';
import { Experience } from '../../../interfaces/userData.interface';

@Component({
  selector: 'app-edit-experiences',
  imports: [],
  templateUrl: './edit-experiences.html',
  styleUrl: './edit-experiences.css'
})
export class EditExperiences {

  close = output();
  experienceData = input<Experience | null>(null);

  isEditing = computed(() => this.experienceData() !== null);

  getDateValue(date?: string): string {
    return date ? date.split('T')[0] : '';
  }

  closeModal(): void {
    this.close.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

}
