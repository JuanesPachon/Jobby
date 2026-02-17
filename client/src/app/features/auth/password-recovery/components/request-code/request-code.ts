import { Component, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordRecoveryService } from '../../services/password-recovery.service';
import { CodeRequest } from './interfaces/requestCode.interface';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-request-code',
    imports: [ReactiveFormsModule, NgClass],
    templateUrl: './request-code.html',
    styleUrl: './request-code.css',
})
export class RequestCode {
    private requestCodeService = inject(passwordRecoveryService);

    requestCodeForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
    });

    isLoading = signal<boolean>(false);
    authError = signal<boolean>(false);
    authErrorMessage = signal<string>('');

    onNextStep = output<number>();

    attemptRequestCode(event: Event) {
        event.preventDefault();

        if (this.requestCodeForm.valid) {
            this.isLoading.set(true);

            const formData = this.requestCodeForm.value;

            const requestCode: CodeRequest = {
                email: formData.email!,
            };

            this.requestCodeService.attemptRequestCode(requestCode).subscribe({
                next: (response) => {
                    this.isLoading.set(false);
                    this.onNextStep.emit(2);
                },
                error: (error) => {
                    this.authErrorMessage.set(
                        error.status === 400
                            ? 'Correo no registrado, vuelve a intentarlo'
                            : error.status === 429
                              ? 'Demasiados intentos de recuperación. Por favor, intenta más tarde.'
                              : 'Error al procesar la solicitud, vuelve a intentarlo mas tarde'
                    );
                    this.authError.set(true);
                    this.isLoading.set(false);
                },
            });
        } else {
            this.authErrorMessage.set('Por favor, ingresa un correo válido.');
            this.authError.set(true);
        }
    }
}
