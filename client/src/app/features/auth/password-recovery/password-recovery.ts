import { Component, signal } from '@angular/core';
import { RequestCode } from "./components/request-code/request-code";
import { VerifyCode } from "./components/verify-code/verify-code";
import { ResetPassword } from "./components/reset-password/reset-password";

@Component({
  selector: 'app-password-recovery',
  imports: [RequestCode, VerifyCode, ResetPassword],
  templateUrl: './password-recovery.html',
  styleUrl: './password-recovery.css'
})
export default class PasswordRecovery {
  step = signal<number>(1)

  onNextStep(step: number) {
    this.step.set(step)
  }
}