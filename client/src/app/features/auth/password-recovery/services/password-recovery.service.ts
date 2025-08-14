import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CodeRequest } from '../components/request-code/interfaces/requestCode.interface';
import { environment } from '../../../../../environments/environment';
import { verifyCodeRequest } from '../components/verify-code/interfaces/verifyCode.interface';
import { NewPasswordRequest } from '../components/reset-password/interfaces/newPassword.interface';

@Injectable({
  providedIn: 'root'
})
export class passwordRecoveryService {
  
  private http = inject(HttpClient);

  step = signal<number>(1)

  onNextStep(step: number): void {
    this.step.set(step)
  }

  attemptRequestCode(codeRequest: CodeRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/recoveryotp`, codeRequest, {
      withCredentials: true
    })
  }

   attemptVerifyCode(resetCode: verifyCodeRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/verify-code`, resetCode, {
      withCredentials: true
    })
  }

  attemptResetPassword(newPassword: NewPasswordRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/reset-passaword`, newPassword, {
      withCredentials: true
    })
  }
}