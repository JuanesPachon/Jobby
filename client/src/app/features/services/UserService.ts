import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { RegisterRequest } from "../auth/register/models/RegisterRequest";

@Injectable({providedIn: 'root'})
export class UserService {
  private http = inject(HttpClient);

  attemptSignUp(formData: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/register`, formData)
  }
}