import { Component, inject, signal } from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from './models/RegisterRequest';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export default class Register {

  private userService = inject(AuthService);
  private router = inject(Router);

  private ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const inputDate = control.value;
    const [year, month, day] = inputDate.split('-').map(Number);
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    
    let age = currentYear - year;
    
    if (month > currentMonth || (month === currentMonth && day > currentDay)) {
      age--;
    }
    
    return age >= 18 ? null : { underAge: true };
  }

  private emailDomainValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const email = control.value.toLowerCase();
    const allowedDomains = [
      'gmail.com',
      'hotmail.com',
      'outlook.com',
      'yahoo.com',
      'yahoo.es',
      'icloud.com',
      'live.com',
      'msn.com',
      'hotmail.es',
      'outlook.es'
    ];
    
    const emailParts = email.split('@');
    if (emailParts.length !== 2) return { invalidDomain: true };
    
    const domain = emailParts[1];
    
    if (!allowedDomains.includes(domain)) {
      return { invalidDomain: true };
    }
    
    return null;
  }
  
  signUpForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+(?:\s[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/)]),
    lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+(?:\s[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/)]),
    birthDay: new FormControl('', [Validators.required, this.ageValidator.bind(this)]),
    idType: new FormControl('', [Validators.required]),
    idNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    email: new FormControl('', [Validators.required, Validators.email, this.emailDomainValidator.bind(this)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,}$')]),
    termsAndConditions: new FormControl(false, [Validators.requiredTrue])
  });

  authError = signal<Boolean>(false);
  authErrorMessage = signal<string>('');
  isLoading = signal<Boolean>(false);
  
  showPassword = signal<Boolean>(false);

  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }

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
          this.userService.authNotification.update(value => !value);
          this.userService.notificationMessage.set('Registro exitoso! Tu cuenta ha sido creada correctamente.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.authErrorMessage.set(
            error.status === 400 ? 'Algo fallo en el formulario, vuelve a intentarlo.' : 
            error.status === 409 ? 'Ya fue creado un usuario con este correo electrónico o este numero de identificación.' :
            error.status === 429 ? 'Demasiados intentos de registro. Por favor, intenta más tarde.' :
            'Error en el servidor, por favor intenta más tarde.'
          );

          this.authError.update(value => !value);
          this.isLoading.update(value => !value);
        }
      });
    } else {
      this.isLoading.update(value => !value);
    }
  }

}
