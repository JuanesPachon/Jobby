import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  
  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/profile` ,
    { withCredentials: true });
  }

  getPhotoUrl(photoPath: string | null | undefined): string {
    if (!photoPath) {
      return '/icons/male_user.svg';
    }
    return `${environment.supabaseStorageUrl}/${photoPath}`;
  }
}

