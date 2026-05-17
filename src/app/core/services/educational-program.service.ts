import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EducationalProgram } from '../models/models';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class EducationalProgramService {
  private url = `${API_CONFIG.BASE_URL}/educational-programs`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<EducationalProgram[]> {
    return this.http.get<EducationalProgram[]>(this.url);
  }

  getById(id: number): Observable<EducationalProgram> {
    return this.http.get<EducationalProgram>(`${this.url}/${id}`);
  }

  create(program: EducationalProgram): Observable<EducationalProgram> {
    return this.http.post<EducationalProgram>(this.url, program);
  }

  update(id: number, program: EducationalProgram): Observable<EducationalProgram> {
    return this.http.put<EducationalProgram>(`${this.url}/${id}`, program);
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}
