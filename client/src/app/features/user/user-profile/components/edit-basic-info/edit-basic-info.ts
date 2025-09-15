import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { UserData } from '../../../interfaces/userData.interface';
import { UserService } from '../../../services/user.service';
import { NgClass } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-basic-info',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './edit-basic-info.html',
  styleUrl: './edit-basic-info.css',
})
export class EditBasicInfo implements OnInit {
  close = output();
  userData = input<UserData>();

  private userService = inject(UserService);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  hasError = signal<boolean>(false);

  basicInfoForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.basicInfoForm = new FormGroup({
      email: new FormControl(this.userData()?.email || '', [
        Validators.email,
        Validators.maxLength(100),
      ]),
      phone: new FormControl(this.userData()?.phone || '', [
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      occupation: new FormControl(this.userData()?.profile?.occupation || '', [
        Validators.maxLength(100),
      ]),
      current_location: new FormControl(
        this.userData()?.profile?.current_location || '',
        [Validators.maxLength(100)]
      ),
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.basicInfoForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      this.hasError.set(false);
      this.errorMessage.set('');

      const formValue = this.basicInfoForm.value;
      const updateData = {
        email: formValue.email || '',
        phone: formValue.phone || '',
        occupation: formValue.occupation || '',
        current_location: formValue.current_location || ''
      };

      this.userService.editUserProfile(updateData).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.closeModal();
        },
        error: (error) => {
          this.errorMessage.set('Error al actualizar la información, intentelo nuevamente más tarde.');
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
    } else {
      this.basicInfoForm.markAllAsTouched();
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
