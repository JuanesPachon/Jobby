import { Component, output, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-edit-skills',
    imports: [ReactiveFormsModule, NgClass],
    templateUrl: './edit-skills.html',
    styleUrl: './edit-skills.css',
})
export class EditSkills {
    private userService = inject(UserService);

    close = output();

    isLoading = signal<boolean>(false);
    hasError = signal<boolean>(false);
    errorMessage = signal<string>('');

    skillNameControl = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[\p{L}0-9 ]+$/u),
    ]);

    closeModal(): void {
        this.close.emit();
    }

    onOverlayClick(event: Event): void {
        if (event.target === event.currentTarget) {
            this.closeModal();
        }
    }

    onSubmit(): void {
        if (this.skillNameControl.valid && !this.isLoading()) {
            this.isLoading.set(true);
            this.hasError.set(false);
            this.errorMessage.set('');

            const skillData = {
                skills: [
                    {
                        action: 'add' as const,
                        skill_name: this.skillNameControl.value!.trim(),
                    },
                ],
            };

            this.userService.editUserProfile(skillData).subscribe({
                next: () => {
                    this.isLoading.set(false);
                    this.closeModal();
                },
                error: (error) => {
                    this.errorMessage.set(
                        'Error al agregar la habilidad, inténtelo nuevamente más tarde.'
                    );
                    this.hasError.set(true);
                    this.isLoading.set(false);
                },
            });
        } else {
            this.skillNameControl.markAsTouched();
            this.errorMessage.set('Por favor, completa el campo correctamente.');
            this.hasError.set(true);
        }
    }
}
