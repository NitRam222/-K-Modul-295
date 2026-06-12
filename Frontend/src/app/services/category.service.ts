import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.backendBaseUrl}categories`;

  getAll(userId?: number) {
    let params = new HttpParams();

    if (userId !== undefined && userId !== null) {
      params = params.set('userId', userId);
    }

    return this.http.get<Category[]>(this.url, { params });
  }

  create(category: Category) {
    return this.http.post<Category>(this.url, category);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
