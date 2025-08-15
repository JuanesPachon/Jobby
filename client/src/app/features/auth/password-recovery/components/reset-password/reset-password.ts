import { Component, inject, output, signal } from '@angular/core';
import { passwordRecoveryService } from '../../services/password-recovery.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NewPasswordRequest } from './interfaces/newPassword.interface';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const newPassword = control.get('newPassword')
    const confirmPassword = control.get('confirmPassword')

    if (!newPassword || !confirmPassword) {
      return null
    }
    return control.value.newPassword === control.value.confirmPassword ? null : { PasswordNoMatch: true };
};

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule,NgClass],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {

  private passwordRecoveryService = inject(passwordRecoveryService);
  private router = inject(Router)

  newPasswordForm = new FormGroup ({
    newPassword : new FormControl(``, [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,}$')]),
    confirmPassword : new FormControl("",[Validators.required]),
  }, {validators: [confirmPasswordValidator]})

  showPassword = signal<Boolean>(false);

  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }
  
  isLoading = signal<Boolean>(false);
  authError = signal<Boolean>(false)
  authErrorMessage = signal<string>('');
  onNextStep = output<number>()

  attemptResetPassword(event: Event) {
    event.preventDefault();

    if (this.newPasswordForm.valid) {

      this.isLoading.update(value => !value);

      const formData = this.newPasswordForm.value;

      const NewPassword:NewPasswordRequest = {
        newPassword: formData.newPassword!,
      };

      this.passwordRecoveryService.attemptResetPassword(NewPassword).subscribe({
        next: (response) => {
          this.router.navigate([`/login`])
        },
        error: (error) => {

          if(error.error.errors){
            this.authErrorMessage.set("La contraseña tiene un formato inválido ");
            this.authError.update(value => !value);
            this.isLoading.update(value => !value);
          }
          else{
             this.authErrorMessage.set(error.status === 400 ?"No se ha validado ningún código,intentalo de nuevo" :"Error interno al procesar la solicitud, vuelve a intentarlo mas tarde " );
            this.authError.update(value => !value);
            this.isLoading.update(value => !value);

          }
        }
      });

    } else {
      this.authErrorMessage.set('Por favor, Completa el campo de código de verifiación');
      this.authError.update(value => !value);
      this.isLoading.update(value => !value);
    }
  }
  
}
