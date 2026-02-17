import { Component, input, output, computed, inject, signal, OnInit } from '@angular/core';
import { Experience } from '../../../interfaces/userData.interface';
import { UserService } from '../../../services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-edit-experiences',
    imports: [ReactiveFormsModule, NgClass],
    templateUrl: './edit-experiences.html',
    styleUrl: './edit-experiences.css',
})
export class EditExperiences implements OnInit {
    close = output();
    experienceData = input<Experience | null>(null);

    private userService = inject(UserService);

    isEditing = computed(() => this.experienceData() !== null);
    isLoading = signal<boolean>(false);
    hasError = signal<boolean>(false);
    errorMessage = signal<string>('');
    currentlyWorking = signal<boolean>(false);

    experienceForm!: FormGroup;

    ngOnInit(): void {
        this.initializeForm();
    }

    private initializeForm(): void {
        const experience = this.experienceData();

        if (experience && !experience.end_date) {
            this.currentlyWorking.set(true);
        }

        this.experienceForm = new FormGroup({
            title: new FormControl(experience?.title || '', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]),
            company: new FormControl(experience?.company || '', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]),
            start_date: new FormControl(this.getDateValue(experience?.start_date), [
                Validators.required,
                this.pastDateValidator,
            ]),
            end_date: new FormControl(this.getDateValue(experience?.end_date), [
                this.pastDateValidator,
            ]),
        });
    }

    private pastDateValidator = (control: any) => {
        if (!control.value) return null;

        const inputDate = new Date(control.value);
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        return inputDate > today ? { futureDate: true } : null;
    };

    getDateValue(date?: string): string {
        return date ? date.split('T')[0] : '';
    }

    onCurrentlyWorkingChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.currentlyWorking.set(target.checked);

        if (target.checked) {
            this.experienceForm.get('end_date')?.setValue('');
            this.experienceForm.get('end_date')?.disable();
        } else {
            this.experienceForm.get('end_date')?.enable();
        }
    }

    onSubmit(): void {
        if (this.experienceForm.valid && !this.isLoading()) {
            this.isLoading.set(true);
            this.hasError.set(false);
            this.errorMessage.set('');

            const formValue = this.experienceForm.value;
            const experience = this.experienceData();

            const endDate = this.currentlyWorking() ? null : formValue.end_date;

            if (endDate && formValue.start_date) {
                const startDate = new Date(formValue.start_date);
                const endDateObj = new Date(endDate);

                if (endDateObj <= startDate) {
                    this.errorMessage.set(
                        'La fecha de fin debe ser posterior a la fecha de inicio.'
                    );
                    this.hasError.set(true);
                    this.isLoading.set(false);
                    return;
                }
            }

            let experienceOperation;

            if (this.isEditing()) {
                experienceOperation = {
                    action: 'update' as const,
                    id: experience!.id,
                    title: formValue.title,
                    company: formValue.company,
                    start_date: formValue.start_date,
                    end_date: endDate,
                };
            } else {
                experienceOperation = {
                    action: 'add' as const,
                    title: formValue.title,
                    company: formValue.company,
                    start_date: formValue.start_date,
                    end_date: endDate,
                };
            }

            const updateData = {
                experiences: [experienceOperation],
            };

            this.userService.editUserProfile(updateData).subscribe({
                next: (response) => {
                    this.isLoading.set(false);
                    this.closeModal();
                },
                error: (error) => {
                    this.errorMessage.set(
                        'Error al guardar la experiencia, inténtelo nuevamente más tarde.'
                    );
                    this.hasError.set(true);
                    this.isLoading.set(false);
                },
            });
        } else {
            this.experienceForm.markAllAsTouched();
            this.errorMessage.set('Por favor, completa todos los campos correctamente.');
            this.hasError.set(true);
        }
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
