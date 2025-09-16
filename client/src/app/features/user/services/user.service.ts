import { inject, Injectable, signal } from '@angular/core';
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

  userNotification = signal<Boolean>(false);
  notificationMessage = signal<string>('');
  
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

  getPhotoUrl(photoPath: string | null | undefined): string {
    if (!photoPath) {
      return '/icons/male_user.svg';
    }
    return `${environment.supabaseStorageUrl}/${photoPath}`;
  }

  editUserProfile(updateData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/user/profile`, updateData, 
    { withCredentials: true }).pipe(
      tap(response => {
        if (response.success && response.data?.user) {
          this.userDataSubject.next(response.data.user);
          
          this.notificationMessage.set('La información se actualizó exitosamente');
          this.userNotification.set(true);
          
          setTimeout(() => {
            this.userNotification.set(false);
          }, 4000);
        }
      })
    );
  }

}
