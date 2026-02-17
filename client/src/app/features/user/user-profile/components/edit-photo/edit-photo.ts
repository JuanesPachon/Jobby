import { Component, output, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-edit-photo',
    imports: [ReactiveFormsModule],
    templateUrl: './edit-photo.html',
    styleUrl: './edit-photo.css',
})
export class EditPhoto {
    private userService = inject(UserService);

    close = output();

    isLoading = signal<boolean>(false);
    hasError = signal<boolean>(false);
    errorMessage = signal<string>('');

    photoControl = new FormControl<File | null>(null, [Validators.required]);

    selectedFileName = signal<string>('');
    previewUrl = signal<string | null>(null);

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
            if (!file.type.startsWith('image/')) {
                this.errorMessage.set('Solo se permiten archivos de imagen (PNG, JPG, JPEG, WEBP)');
                this.hasError.set(true);
                this.photoControl.setValue(null);
                this.selectedFileName.set('');
                this.previewUrl.set(null);
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                this.errorMessage.set('El archivo no puede superar los 10MB');
                this.hasError.set(true);
                this.photoControl.setValue(null);
                this.selectedFileName.set('');
                this.previewUrl.set(null);
                return;
            }

            this.photoControl.setValue(file);
            this.selectedFileName.set(file.name);
            this.hasError.set(false);
            this.errorMessage.set('');

            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewUrl.set(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    cancelPreview(): void {
        this.photoControl.setValue(null);
        this.selectedFileName.set('');
        this.previewUrl.set(null);
        this.hasError.set(false);
        this.errorMessage.set('');

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    }

    onSubmit(): void {
        if (this.photoControl.valid && !this.isLoading()) {
            this.isLoading.set(true);
            this.hasError.set(false);
            this.errorMessage.set('');

            const file = this.photoControl.value!;

            const formData = new FormData();
            formData.append('photoUrl', file);

            this.userService.editUserProfile(formData).subscribe({
                next: () => {
                    this.isLoading.set(false);
                    this.closeModal();
                },
                error: (error) => {
                    this.errorMessage.set(
                        'Error al subir la foto, inténtelo nuevamente más tarde.'
                    );
                    this.hasError.set(true);
                    this.isLoading.set(false);
                },
            });
        } else {
            this.photoControl.markAsTouched();
            this.errorMessage.set('Por favor, selecciona una imagen válida.');
            this.hasError.set(true);
        }
    }
}
