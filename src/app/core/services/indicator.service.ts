import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Indicator } from '../models/models';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class IndicatorService {
  private url = `${API_CONFIG.BASE_URL}/indicators`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Indicator[]> {
    return this.http.get<Indicator[]>(this.url);
  }

  getById(id: number): Observable<Indicator> {
    return this.http.get<Indicator>(`${this.url}/${id}`);
  }

  create(indicator: Indicator): Observable<Indicator> {
    return this.http.post<Indicator>(this.url, indicator);
  }

  update(id: number, indicator: Indicator): Observable<Indicator> {
    return this.http.put<Indicator>(`${this.url}/${id}`, indicator);
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}
