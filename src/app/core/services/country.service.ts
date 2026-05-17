import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../models/models';
import { API_CONFIG } from './api.config';

/**
 * Service to manage Country CRUD operations via HTTP.
 */
@Injectable({ providedIn: 'root' })
export class CountryService {
  private url = `${API_CONFIG.BASE_URL}/countries`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Country[]> {
    return this.http.get<Country[]>(this.url);
  }

  getById(id: number): Observable<Country> {
    return this.http.get<Country>(`${this.url}/${id}`);
  }

  create(country: Country): Observable<Country> {
    return this.http.post<Country>(this.url, country);
  }

  update(id: number, country: Country): Observable<Country> {
    return this.http.put<Country>(`${this.url}/${id}`, country);
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}
