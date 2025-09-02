import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { UserData } from '../interfaces/userData.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  
  private userDataSubject = new BehaviorSubject<UserData | null>(null);
  public userData$ = this.userDataSubject.asObservable();
  
  private isLoading = false;
  
  getUserProfile(): Observable<any> {
    if (this.userDataSubject.value) {
      return of({ data: this.userDataSubject.value });
    }
    
    this.isLoading = true;
    return this.http.get<any>(`${this.apiUrl}/user/profile`, { withCredentials: true }).pipe(
      tap(response => {
        this.userDataSubject.next(response.data);
        this.isLoading = false;
      }),
      catchError(error => {
        this.isLoading = false;
        throw error;
      })
    );
  }

  getCurrentUserData(): UserData | null {
    return this.userDataSubject.value;
  }

  clearUserData(): void {
    this.userDataSubject.next(null);
  }
  
  editUserProfile(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/profile` ,
    { withCredentials: true });
  }

  getPhotoUrl(photoPath: string | null | undefined): string {
    if (!photoPath) {
      return '/icons/male_user.svg';
    }
    return `${environment.supabaseStorageUrl}/${photoPath}`;
  }
}
