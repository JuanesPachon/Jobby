import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CodeRequest } from '../interfaces/request.code.interface';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestCodeService {
  
  private http = inject(HttpClient);

    attemptRequestCode(codeRequest: CodeRequest): Observable<any> {
    return this.http.post<any>(`${environment}/recoveryotp`, codeRequest, {
      withCredentials: true
    })
}
}