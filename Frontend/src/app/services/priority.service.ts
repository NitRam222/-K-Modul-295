import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Priority } from '../models/priority.model';

@Injectable({ providedIn: 'root' })
export class PriorityService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.backendBaseUrl}priorities`;

  getAll(userId?: number) {
    let params = new HttpParams();

    if (userId !== undefined && userId !== null) {
      params = params.set('userId', userId);
    }

    return this.http.get<Priority[]>(this.url, { params });
  }

  create(priority: Priority) {
    return this.http.post<Priority>(this.url, priority);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
