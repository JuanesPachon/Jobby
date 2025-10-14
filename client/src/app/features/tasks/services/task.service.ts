import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateTaskRequest } from '../post-task/interfaces/CreateTaskRequest';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);

  taskNotification = signal<Boolean>(false);
  taskNotificationMessage = signal<string>('');

  createTask(taskData: CreateTaskRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/tasks`, taskData, {
      withCredentials: true
    });
  }
}
