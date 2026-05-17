import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EducationalInstitution } from '../models/models';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class EducationalInstitutionService {
  private url = `${API_CONFIG.BASE_URL}/educational-institutions`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<EducationalInstitution[]> {
    return this.http.get<EducationalInstitution[]>(this.url);
  }

  getById(id: number): Observable<EducationalInstitution> {
    return this.http.get<EducationalInstitution>(`${this.url}/${id}`);
  }

  create(inst: EducationalInstitution): Observable<EducationalInstitution> {
    return this.http.post<EducationalInstitution>(this.url, inst);
  }

  update(id: number, inst: EducationalInstitution): Observable<EducationalInstitution> {
    return this.http.put<EducationalInstitution>(`${this.url}/${id}`, inst);
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}
