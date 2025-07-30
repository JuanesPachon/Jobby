import { Component, inject, signal } from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from './models/RegisterRequest';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private userService = inject(AuthService);
  private router = inject(Router);
  
  signUpForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]),
    lastName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]),
    birthDay: new FormControl('', [Validators.required]),
    idType: new FormControl('', [Validators.required]),
    idNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,}$')]),
    termsAndConditions: new FormControl(false, [Validators.requiredTrue])
  });

  authError = signal<Boolean>(false);
  authErrorMessage = signal<string>('');
  isLoading = signal<Boolean>(false);

  attemptSignUp(event: Event) {

    event.preventDefault();
    this.isLoading.update(value => !value);

    if (this.signUpForm.valid) {
      const formData = this.signUpForm.value
      const registerRequest : RegisterRequest = {
        first_name: formData.firstName!,
        last_name: formData.lastName!,
        birth_date: formData.birthDay!,
        doc_type: formData.idType!,
        doc_number: formData.idNumber!,
        email: formData.email!,
        phone: formData.phone!,
        password: formData.password!,
        accepted_terms: formData.termsAndConditions!
      }
      this.userService.attemptSignUp(registerRequest).subscribe({
        next: (response) => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.authErrorMessage.set(error.status === 400 ? 'Algo fallo en el formulario, vuelve a intentarlo.' : 
          error.status === 409 ? 'Ya fue creado un usuario con este correo electrónico o este numero de identificación.' : 'Error en el servidor, por favor intenta más tarde.');

          this.authError.update(value => !value);
          this.isLoading.update(value => !value);
        }
      });
    } else {
      this.isLoading.update(value => !value);
    }
  }

}
