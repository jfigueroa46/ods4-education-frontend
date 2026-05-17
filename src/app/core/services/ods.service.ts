import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ods } from '../models/models';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class OdsService {
  private url = `${API_CONFIG.BASE_URL}/ods`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ods[]> {
    return this.http.get<Ods[]>(this.url);
  }

  getById(id: number): Observable<Ods> {
    return this.http.get<Ods>(`${this.url}/${id}`);
  }

  create(ods: Ods): Observable<Ods> {
    return this.http.post<Ods>(this.url, ods);
  }

  update(id: number, ods: Ods): Observable<Ods> {
    return this.http.put<Ods>(`${this.url}/${id}`, ods);
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}
