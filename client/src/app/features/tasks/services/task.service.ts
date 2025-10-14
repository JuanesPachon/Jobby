import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateTaskRequest } from '../post-task/interfaces/CreateTaskRequest';
import { SearchFilters } from '../interfaces/SearchTasks';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);

  taskNotification = signal<Boolean>(false);
  taskNotificationMessage = signal<string>('');
  
  searchFilters = signal<SearchFilters>({});
  searchResults = signal<any>(null);
  isSearching = signal<Boolean>(false);

  createTask(taskData: CreateTaskRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/tasks`, taskData, {
      withCredentials: true
    });
  }

  searchTasks(filters: { position?: string; city?: string; limit?: number; page?: number }): Observable<any> {
    let params = new URLSearchParams();
    
    // Solo agregar parámetros si tienen valor
    if (filters.position && filters.position.trim()) {
      params.append('position', filters.position.trim());
    }
    
    if (filters.city && filters.city.trim()) {
      params.append('city', filters.city.trim());
    }
    
    params.append('limit', (filters.limit || 10).toString());
    params.append('page', (filters.page || 1).toString());

    const queryString = params.toString();
    const url = `${environment.apiUrl}/tasks?${queryString}`;

    return this.http.get<any>(url, {
      withCredentials: true
    });
  }

  setSearchFilters(filters: SearchFilters): void {
    this.searchFilters.set(filters);
  }

  performSearch(): Observable<any> {
    this.isSearching.set(true);
    const filters = this.searchFilters();
    
    return this.searchTasks(filters);
  }

  setSearchResults(results: any): void {
    this.searchResults.set(results);
    this.isSearching.set(false);
  }

  clearSearchResults(): void {
    this.searchResults.set(null);
    this.searchFilters.set({});
    this.isSearching.set(false);
  }

  getTaskById(taskId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/tasks/${taskId}`, {
      withCredentials: true
    });
  }

  getFeaturedTasks(limit: number = 4): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/tasks?limit=${limit}&page=1`, {
      withCredentials: true
    });
  }
}
