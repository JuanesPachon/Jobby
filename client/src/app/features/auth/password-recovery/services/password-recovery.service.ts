import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CodeRequest } from '../components/request-code/interfaces/request.code.interface';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class passwordRecoveryService {
  
  private http = inject(HttpClient);

  step = signal<number>(1)

  onNextStep(step: number) {
    this.step.set(step)
  }

  attemptRequestCode(codeRequest: CodeRequest): Observable<any> {
  return this.http.post<any>(`${environment}/recoveryotp`, codeRequest, {
    withCredentials: true
  })
}
}