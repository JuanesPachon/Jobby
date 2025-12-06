import { Component, output, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-edit-documents',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-documents.html',
  styleUrl: './edit-documents.css'
})
export class EditDocuments {

  private userService = inject(UserService);
  
  close = output();
  
  isLoading = signal<boolean>(false);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');
  
  documentControl = new FormControl<File | null>(null, [
    Validators.required
  ]);

  selectedFileName = signal<string>('');

  closeModal(): void {
    this.close.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      if (file.type !== 'application/pdf') {
        this.errorMessage.set('Solo se permiten archivos PDF');
        this.hasError.set(true);
        this.documentControl.setValue(null);
        this.selectedFileName.set('');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage.set('El archivo no puede superar los 10MB');
        this.hasError.set(true);
        this.documentControl.setValue(null);
        this.selectedFileName.set('');
        return;
      }
      
      this.documentControl.setValue(file);
      this.selectedFileName.set(file.name);
      this.hasError.set(false);
      this.errorMessage.set('');
    }
  }

  onSubmit(): void {
    if (this.documentControl.valid && !this.isLoading()) {
      this.isLoading.set(true);
      this.hasError.set(false);
      this.errorMessage.set('');

      const file = this.documentControl.value!;
      
      const formData = new FormData();
      formData.append('documents', file);

      this.userService.editUserProfile(formData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.closeModal();
        },
        error: (error) => {
          this.errorMessage.set('Error al subir el documento, inténtelo nuevamente más tarde.');
          this.hasError.set(true);
          this.isLoading.set(false);
        }
      });
    } else {
      this.documentControl.markAsTouched();
      this.errorMessage.set('Por favor, selecciona un archivo PDF válido.');
      this.hasError.set(true);
    }
  }

}
