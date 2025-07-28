import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { RegisterRequest } from "../../features/auth/register/models/RegisterRequest";
import { LoginRequest } from "../../features/auth/login/interfaces/LoginRequest";

@Injectable({providedIn: 'root'})
export class AuthService {
  private http = inject(HttpClient);

  attemptSignUp(formData: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/register`, formData)
  }

  attemptLogin(formData: LoginRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, formData, {
      withCredentials: true
    });
  }

  validateToken(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/auth/validate`, {
      withCredentials: true
    });
  }
}