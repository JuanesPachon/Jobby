import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateTaskRequest } from '../post-task/interfaces/CreateTaskRequest';
import { SearchFilters, PublishedTasksResponse, TaskWithApplicationsResponse } from '../interfaces';

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
  
  private appliedTasksCache = signal<Map<number, boolean>>(new Map());

  createTask(taskData: CreateTaskRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/tasks`, taskData, {
      withCredentials: true
    });
  }

  searchTasks(filters: { position?: string; city?: string; limit?: number; page?: number; excludeOwnTasks?: boolean }): Observable<any> {
    let params = new URLSearchParams();
    
    if (filters.position && filters.position.trim()) {
      params.append('position', filters.position.trim());
    }
    
    if (filters.city && filters.city.trim()) {
      params.append('city', filters.city.trim());
    }
    
    params.append('limit', (filters.limit || 10).toString());
    params.append('page', (filters.page || 1).toString());
    
    if (filters.excludeOwnTasks) {
      params.append('excludeOwnTasks', 'true');
    }

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
    
    return this.searchTasks({
      ...filters,
      excludeOwnTasks: true
    });
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
    return this.searchTasks({ 
      limit, 
      page: 1, 
      excludeOwnTasks: true 
    });
  }

  applyToTask(taskId: number): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/tasks/apply/${taskId}`, {}, {
      withCredentials: true
    });
  }

  withdrawApplication(taskId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/tasks/withdraw/${taskId}`, {
      withCredentials: true
    });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/profile`, {
      withCredentials: true
    });
  }

  checkApplicationStatus(taskId: number): Observable<any> {
    const cachedValue = this.loadFromLocalStorage(taskId);
    if (cachedValue !== null) {
      const currentCache = this.appliedTasksCache();
      const newCache = new Map(currentCache);
      newCache.set(taskId, cachedValue);
      this.appliedTasksCache.set(newCache);
      
      return new Observable(observer => {
        observer.next({
          success: true,
          data: { hasApplied: cachedValue }
        });
        observer.complete();
      });
    }

    return this.http.get<any>(`${environment.apiUrl}/tasks/${taskId}/check-application`, {
      withCredentials: true
    }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.saveToLocalStorage(taskId, response.data.hasApplied);
          const currentCache = this.appliedTasksCache();
          const newCache = new Map(currentCache);
          newCache.set(taskId, response.data.hasApplied);
          this.appliedTasksCache.set(newCache);
        }
      })
    );
  }

  hasAppliedToTask(taskId: number): boolean {
    return this.appliedTasksCache().get(taskId) || false;
  }

  markAsApplied(taskId: number): void {
    const currentCache = this.appliedTasksCache();
    const newCache = new Map(currentCache);
    newCache.set(taskId, true);
    this.appliedTasksCache.set(newCache);
    
    this.saveToLocalStorage(taskId, true);
  }

  markAsWithdrawn(taskId: number): void {
    const currentCache = this.appliedTasksCache();
    const newCache = new Map(currentCache);
    newCache.set(taskId, false);
    this.appliedTasksCache.set(newCache);
    
    this.saveToLocalStorage(taskId, false);
  }

  private saveToLocalStorage(taskId: number, hasApplied: boolean): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = `applied_task_${taskId}`;
        localStorage.setItem(key, JSON.stringify(hasApplied));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }

  private loadFromLocalStorage(taskId: number): boolean | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = `applied_task_${taskId}`;
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
      }
    }
    return null;
  }

  clearAppliedTasks(): void {
    this.appliedTasksCache.set(new Map());
  }


  getMyPublishedTasks(filters?: { limit?: number; page?: number }): Observable<PublishedTasksResponse> {
    let params = new URLSearchParams();
    
    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }
    
    if (filters?.page) {
      params.append('page', filters.page.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `${environment.apiUrl}/my-tasks?${queryString}` : `${environment.apiUrl}/my-tasks`;

    return this.http.get<PublishedTasksResponse>(url, {
      withCredentials: true
    });
  }

  getPublishedTaskWithApplications(taskId: number): Observable<TaskWithApplicationsResponse> {
    return this.http.get<TaskWithApplicationsResponse>(`${environment.apiUrl}/my-tasks/applications/${taskId}`, {
      withCredentials: true
    });
  }

  selectApplicant(taskId: number, applicantId: number): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/my-tasks/select/${taskId}`, {
      applicant_id: applicantId
    }, {
      withCredentials: true
    });
  }
}
