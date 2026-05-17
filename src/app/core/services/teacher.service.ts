import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from '../models/models';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private url = `${API_CONFIG.BASE_URL}/teachers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.url);
  }

  getById(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.url}/${id}`);
  }

  create(teacher: Teacher): Observable<Teacher> {
    return this.http.post<Teacher>(this.url, teacher);
  }

  update(id: number, teacher: Teacher): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.url}/${id}`, teacher);
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}
