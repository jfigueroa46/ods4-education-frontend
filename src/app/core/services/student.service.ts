import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/models';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private url = `${API_CONFIG.BASE_URL}/students`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.url);
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.url}/${id}`);
  }

  create(student: Student): Observable<Student> {
    return this.http.post<Student>(this.url, student);
  }

  update(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.url}/${id}`, student);
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}
