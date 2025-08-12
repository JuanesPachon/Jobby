import { Component, inject, output, signal } from '@angular/core';
import { passwordRecoveryService } from '../../services/password-recovery.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { verifyCodeRequest } from './interfaces/verifyCode.interface';

@Component({
  selector: 'app-verify-code',
  imports: [ReactiveFormsModule],
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

      this.isLoading.update(value => !value);

      const formData = this.verifyCodeForm.value;

      const resetCode:verifyCodeRequest = {
        resetCode: formData.resetCode!,
      };

      this.passwordRecoveryService.attemptVerifyCode(resetCode).subscribe({
        next: (response) => {
          this.onNextStep.emit(3)
        },
        error: (error) => {
          this.authErrorMessage.set(error.status === 400 ? 'EL codio es invalido o ya expiró' : 'Error al procesar la solicitud, vuelve a intentarlo mas tarde');
          this.authError.update(value => !value);
          this.isLoading.update(value => !value);
        }
      });

    } else {
      this.authErrorMessage.set('Por favor, Completa el campo de código de verifiación');
      this.authError.update(value => !value);
      this.isLoading.update(value => !value);
    }
  }

  resendCode(){
    this.onNextStep.emit(1)
  }
}

