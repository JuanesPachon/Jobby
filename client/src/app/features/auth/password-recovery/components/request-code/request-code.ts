import { Component, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestCodeService } from './services/request-code.service';
import { CodeRequest } from './interfaces/request.code.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-request-code',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './request-code.html',
  styleUrl: './request-code.css'
})
export class RequestCode {

   private requestCodeService = inject(RequestCodeService);

  requestCodeForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  isLoading = signal<Boolean>(false);
  authError = signal<Boolean>(false);
  authErrorMessage = signal<string>('');

  onNextStep = output<number>()

  attemptRequestCode(event: Event) {
    event.preventDefault();

    if (this.requestCodeForm.valid) {

      this.isLoading.update(value => !value);

      const formData = this.requestCodeForm.value;

      const requestCode: CodeRequest = {
        email: formData.email!,
      };

      this.requestCodeService.attemptRequestCode(requestCode).subscribe({
        next: (response) => {
          this.onNextStep.emit(2)
        },
        error: (error) => {
          this.authErrorMessage.set(error.status === 400 ? 'Credenciales incorrectas, vuelve a intentarlo' : 'Error al procesar la solicitud, vuelve a intentarlo mas tarde');
          this.authError.update(value => !value);
          this.isLoading.update(value => !value);
        }
      });

    } else {
      this.authErrorMessage.set('Por favor, ingresa un correo válido.');
      this.authError.update(value => !value);
      this.isLoading.update(value => !value);
    }
  }
}
