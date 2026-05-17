import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../models/models';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class PersonService {
  private url = `${API_CONFIG.BASE_URL}/persons`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Person[]> {
    return this.http.get<Person[]>(this.url);
  }

  getById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.url}/${id}`);
  }

  create(person: Person): Observable<Person> {
    return this.http.post<Person>(this.url, person);
  }

  update(id: number, person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.url}/${id}`, person);
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}
