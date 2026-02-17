import { Component, inject, output, signal } from '@angular/core';
import { passwordRecoveryService } from '../../services/password-recovery.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { verifyCodeRequest } from './interfaces/verifyCode.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-verify-code',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './verify-code.html',
  styleUrl: './verify-code.css'
})
export class VerifyCode {
  private passwordRecoveryService = inject(passwordRecoveryService);

  verifyCodeForm = new FormGroup ({
    resetCode : new FormControl(``, {validators : [Validators.required]})
  })

  isLoading = signal<Boolean>(false);
  authError = signal<Boolean>(false);
  authErrorMessage = signal<string>('');

  onNextStep = output<number>()

  attemptVerifyCode(event: Event) {
    event.preventDefault();
    if (this.verifyCodeForm.valid) {

      this.isLoading.set(true);

      const formData = this.verifyCodeForm.value;

      const resetCode:verifyCodeRequest = {
        resetCode: formData.resetCode!,
      };

      this.passwordRecoveryService.attemptVerifyCode(resetCode).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.onNextStep.emit(3)
        },
        error: (error) => {
          this.authErrorMessage.set(
            error.status === 400 ? 'El código es inválido o ya expiró' :
            error.status === 429 ? 'Demasiados intentos de verificación. Por favor, intenta más tarde.' :
            'Error al procesar la solicitud, vuelve a intentarlo más tarde'
          );
          this.authError.set(true);
          this.isLoading.set(false);
        }
      });

    } else {
      this.authErrorMessage.set('Por favor, completa el campo de código de verificación');
      this.authError.set(true);
    }
  }

  resendCode(){
    this.onNextStep.emit(1)
  }
}

