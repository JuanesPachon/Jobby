import { Component, inject } from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { UserService } from '../../services/UserService';
import { RegisterRequest } from './models/RegisterRequest';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private userService = inject(UserService);

  nichille = 'NGAP'
  
  signUpForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    birthDay: new FormControl('', [Validators.required]),
    idType: new FormControl('', [Validators.required]),
    idNumber: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,}$')]),
    termsAndConditions: new FormControl(false, [Validators.requiredTrue])
  });

  attemptSignUp() {
    console.log('Form Data:', this.signUpForm.value);

    if (this.signUpForm.valid) {
      const formData = this.signUpForm.value as {
        firstName: string;
        lastName: string;
        birthDay: string;
        idType: string;
        idNumber: string;
        email: string;
        phone: string;
        password: string;
        termsAndConditions: boolean;
      };
      console.log('Form Data:', formData)
      const registerRequest : RegisterRequest = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        birth_date: formData.birthDay,
        doc_type: formData.idType,
        doc_number: formData.idNumber,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        accepted_terms: formData.termsAndConditions
      }
      this.userService.attemptSignUp(registerRequest).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response)
        },
        error: (error) => {
          console.error('Error al registrar:', error)
        }
      });
    } else {
      console.log('Formulario inválido')
    }
    this.signUpForm.reset();
  }
}
