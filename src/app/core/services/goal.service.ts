import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Goal } from '../models/models';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class GoalService {
  private url = `${API_CONFIG.BASE_URL}/metas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Goal[]> {
    return this.http.get<Goal[]>(this.url);
  }

  getById(id: number): Observable<Goal> {
    return this.http.get<Goal>(`${this.url}/${id}`);
  }

  create(goal: Goal): Observable<Goal> {
    return this.http.post<Goal>(this.url, goal);
  }

  update(id: number, goal: Goal): Observable<Goal> {
    return this.http.put<Goal>(`${this.url}/${id}`, goal);
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}
