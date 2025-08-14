import { Component, inject, signal } from '@angular/core';
import { RequestCode } from "./components/request-code/request-code";
import { VerifyCode } from "./components/verify-code/verify-code";
import { ResetPassword } from "./components/reset-password/reset-password";
import { passwordRecoveryService } from './services/password-recovery.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-password-recovery',
  imports: [RequestCode, VerifyCode, ResetPassword, RouterLink],
  templateUrl: './password-recovery.html',
  styleUrl: './password-recovery.css'
})
export default class PasswordRecovery {
  
  private passwordRecoveryService = inject(passwordRecoveryService);

  step = this.passwordRecoveryService.step;

  onNextStep(step: number) {
    this.passwordRecoveryService.onNextStep(step);
  }

}