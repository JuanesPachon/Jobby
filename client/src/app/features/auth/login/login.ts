import { Component, inject, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from './interfaces/LoginRequest';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, RouterLink, NgClass],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export default class Login implements OnInit, OnDestroy {
    private authService = inject(AuthService);
    private router = inject(Router);
    private timeoutId?: number;

    authNotification = computed(() => this.authService.authNotification());
    notificationMessage = signal<string>(this.authService.notificationMessage());

    ngOnInit() {
        if (this.authNotification()) {
            this.timeoutId = window.setTimeout(() => {
                this.authService.authNotification.set(false);
            }, 5000);
        }
    }

    ngOnDestroy() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });

    isLoading = signal<boolean>(false);
    authError = signal<boolean>(false);
    authErrorMessage = signal<string>('');

    showPassword = signal<boolean>(false);

    togglePasswordVisibility() {
        this.showPassword.update((value) => !value);
    }

    attemptLogin(event: Event) {
        event.preventDefault();

        if (this.loginForm.valid) {
            this.isLoading.set(true);

            const formData = this.loginForm.value;

            const loginRequest: LoginRequest = {
                email: formData.email!,
                password: formData.password!,
            };

            this.authService.attemptLogin(loginRequest).subscribe({
                next: (response) => {
                    this.authService.clearTokenCache();
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    this.authErrorMessage.set(
                        error.status === 401
                            ? 'Credenciales incorrectas, vuelve a intentarlo'
                            : error.status === 429
                              ? 'Demasiados intentos de inicio de sesión. Por favor, intenta más tarde.'
                              : 'Error del servidor, vuelve a intentarlo mas tarde'
                    );
                    this.authError.set(true);
                    this.isLoading.set(false);
                },
            });
        } else {
            this.authErrorMessage.set(
                'Por favor, completa todos los campos requeridos correctamente.'
            );
            this.authError.set(true);
            this.isLoading.set(false);
        }
    }
}
