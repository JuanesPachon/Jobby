import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Observable, of, shareReplay, tap, catchError, timeout, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { RegisterRequest } from "../../features/auth/register/models/RegisterRequest";
import { LoginRequest } from "../../features/auth/login/interfaces/LoginRequest";

@Injectable({providedIn: 'root'})
export class AuthService {
  private http = inject(HttpClient);
  
  private tokenValidationCache: Observable<any> | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  hasLocalToken(): boolean {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const accessTokenCookie = cookies.find(cookie => 
        cookie.trim().startsWith('access_token=')
      );
      
      if (accessTokenCookie) {
        const tokenValue = accessTokenCookie.split('=')[1];
        return !!(tokenValue && tokenValue.trim() !== '');
      }
    }
    return false;
  }

  isAuthenticated(): Observable<boolean> {
    return this.validateToken().pipe(
      timeout(2000),
      map((response) => response.success),
      catchError(() => of(false))
    );
  }

  attemptSignUp(formData: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/register`, formData)
  }

  authNotification = signal<Boolean>(false);
  notificationMessage = signal<string>('');

  attemptLogin(formData: LoginRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, formData, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.clearTokenCache();
      })
    );
  }

  validateToken(): Observable<any> {
    const now = Date.now();
    
    if (this.tokenValidationCache && now < this.cacheExpiry) {
      return this.tokenValidationCache;
    }

    this.tokenValidationCache = this.http.get<any>(`${environment.apiUrl}/auth/validate`, {
      withCredentials: true
    }).pipe(
      shareReplay(1),
      tap(() => {
        this.cacheExpiry = now + this.CACHE_DURATION;
      }),
      catchError((error) => {
        this.clearTokenCache();
        throw error;
      })
    );

    return this.tokenValidationCache;
  }
  
  attemptSignOut(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.clearTokenCache();
      })
    );
  }

  clearTokenCache(): void {
    this.tokenValidationCache = null;
    this.cacheExpiry = 0;
  }
}