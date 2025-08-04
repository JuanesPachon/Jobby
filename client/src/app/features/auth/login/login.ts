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
  styleUrl: './login.css'
})

export default class Login implements OnInit, OnDestroy {

  private authService = inject(AuthService);
  private router = inject(Router);
  private timeoutId?: number;

  registerNotification = computed(() => this.authService.registerNotification());
  notificationMessage = signal<string>(this.authService.notificationMessage());

  ngOnInit() {
    if (this.registerNotification()) {
      this.timeoutId = window.setTimeout(() => {
        this.authService.registerNotification.set(false);
      }, 4000);
    }
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  isLoading = signal<Boolean>(false);
  authError = signal<Boolean>(false);
  authErrorMessage = signal<string>('');
  
  showPassword = signal<Boolean>(false);

  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }

  attemptLogin(event: Event) {
    event.preventDefault();

    if (this.loginForm.valid) {

      this.isLoading.update(value => !value);

      const formData = this.loginForm.value;

      const loginRequest: LoginRequest = {
        email: formData.email!,
        password: formData.password!
      };

      this.authService.attemptLogin(loginRequest).subscribe({
        next: (response) => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.authErrorMessage.set(error.status === 401 ? 'Credenciales incorrectas, vuelve a intentarlo' : 'Error del servidor, vuelve a intentarlo mas tarde');
          this.authError.update(value => !value);
          this.isLoading.update(value => !value);
        }
      });

    } else {
      this.authErrorMessage.set('Por favor, completa todos los campos requeridos correctamente.');
      this.authError.update(value => !value);
      this.isLoading.update(value => !value);
    }
  }
}
