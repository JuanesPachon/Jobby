import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { RegisterRequest } from "../../features/auth/register/models/RegisterRequest";

@Injectable({providedIn: 'root'})
export class AuthService {
  private http = inject(HttpClient);

  attemptSignUp(formData: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/register`, formData)
  }
}