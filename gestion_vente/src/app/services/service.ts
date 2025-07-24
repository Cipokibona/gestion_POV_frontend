import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Service {
  private http = inject(HttpClient);

  private token: string | null = null;

  private url = 'http://127.0.0.1:8000/api/';
  // private url = 'https://jph.bi/api/';

  private tokenUrl = `${this.url}token/`;

  private usersUrl = `${this.url}user/`;

  constructor(private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<{ access: string }>(this.tokenUrl, { username, password })
      .pipe(tap(response => {
        this.token = response.access;
        localStorage.setItem('token', this.token);
      }));
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
