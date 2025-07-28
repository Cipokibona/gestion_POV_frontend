import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { jwtDecode as jwt_decode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class Service {
  private http = inject(HttpClient);

  private token: string | null = null;

  private url = 'http://127.0.0.1:8000/api/';
  // private url = 'https://jph.bi/api/';

  private tokenUrl = `${this.url}token/`;
  private refreshUrl = `${this.url}token/refresh/`;

  // URL pour les utilisateurs
  private usersUrl = `${this.url}user/`;

  // URL pour les points de vente
  private povUrl = `${this.url}point-de-vente/`;

  // URL pour les clients
  private clientsUrl = `${this.url}client/`;

  constructor(private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<{ access: string; refresh: string }>(this.tokenUrl, { username, password })
      .pipe(tap(response => {
        this.token = response.access;
        localStorage.setItem('token', this.token);
        localStorage.setItem('refresh_token', response.refresh);
      }));
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }

  // token getter
  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  getRefreshToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
  }

  // Récupérer l'utilisateur actuel à partir du token
  getUser(): Observable<any> {
  const token = this.getToken();
  if (!token) return throwError(() => new Error('No token found'));

  let decoded: any;
  try {
    decoded = jwt_decode(token);
  } catch {
    return throwError(() => new Error('Invalid token'));
  }

  const userId = decoded.user_id; // ou selon le champ de ton token
  if (!userId) return throwError(() => new Error('User ID not found in token'));

  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  return this.http.get(`${this.usersUrl}${userId}/`, { headers }).pipe(
    catchError(error => {
      if (error.status === 401) {
        return this.refreshToken().pipe(
          switchMap(() => {
            const newToken = this.getToken();
            if (!newToken) return throwError(() => new Error('Token refresh failed'));
            const newHeaders = new HttpHeaders({ Authorization: `Bearer ${newToken}` });
            return this.http.get(`${this.usersUrl}${userId}/`, { headers: newHeaders });
          })
        );
      }
      return throwError(() => error);
    })
  );
}

  getAllUser(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.usersUrl}`, {headers});
  }

  getUserById(userId: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.usersUrl}${userId}/`, { headers }).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.refreshToken().pipe(
            switchMap(() => {
              const newToken = this.getToken();
              if (!newToken) return throwError(() => new Error('Token refresh failed'));
              const newHeaders = new HttpHeaders({ Authorization: `Bearer ${newToken}` });
              return this.http.get<any>(`${this.usersUrl}${userId}/`, { headers: newHeaders });
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  updateUser(userId: string, data: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.usersUrl}${userId}/`, data, { headers }).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.refreshToken().pipe(
            switchMap(() => {
              const newToken = this.getToken();
              if (!newToken) return throwError(() => new Error('Token refresh failed'));
              const newHeaders = new HttpHeaders({ Authorization: `Bearer ${newToken}` });
              return this.http.put<any>(`${this.usersUrl}${userId}/`, data, { headers: newHeaders });
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  refreshToken(): Observable<void> {
  const refreshToken = this.getRefreshToken();
  if (!refreshToken) return throwError(() => new Error('No refresh token found'));

  return this.http.post<{ access: string }>(`${this.url}token/refresh/`, { refresh: refreshToken }).pipe(
    tap(response => {
      localStorage.setItem('token', response.access);
    }),
    map(() => {}) // transforme en Observable<void>
  );
}

  deleteUser(userId: number): Observable<void> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.usersUrl}${userId}/`, { headers }).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.refreshToken().pipe(
            switchMap(() => {
              const newToken = this.getToken();
              if (!newToken) return throwError(() => new Error('Token refresh failed'));
              const newHeaders = new HttpHeaders({ Authorization: `Bearer ${newToken}` });
              return this.http.delete<void>(`${this.usersUrl}${userId}/`, { headers: newHeaders });
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  createUser(data: any){
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(this.usersUrl, data, { headers });
  }

  // Méthode pour récupérer les points de vente
  getAllPov(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.povUrl}`, { headers });
  }

  createPov(data: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.povUrl, data, { headers }).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.refreshToken().pipe(
            switchMap(() => {
              const newToken = this.getToken();
              if (!newToken) return throwError(() => new Error('Token refresh failed'));
              const newHeaders = new HttpHeaders({ Authorization: `Bearer ${newToken}` });
              return this.http.post<any>(this.povUrl, data, { headers: newHeaders });
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  getPovById(povId: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.povUrl}${povId}/`, { headers }).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.refreshToken().pipe(
            switchMap(() => {
              const newToken = this.getToken();
              if (!newToken) return throwError(() => new Error('Token refresh failed'));
              const newHeaders = new HttpHeaders({ Authorization: `Bearer ${newToken}` });
              return this.http.get<any>(`${this.povUrl}${povId}/`, { headers: newHeaders });
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  updatePov(povId: string, data: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.povUrl}${povId}/`, data, { headers }).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.refreshToken().pipe(
            switchMap(() => {
              const newToken = this.getToken();
              if (!newToken) return throwError(() => new Error('Token refresh failed'));
              const newHeaders = new HttpHeaders({ Authorization: `Bearer ${newToken}` });
              return this.http.put<any>(`${this.povUrl}${povId}/`, data, { headers: newHeaders });
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  // Methode pour client
  getClients(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.clientsUrl, { headers }).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.refreshToken().pipe(
            switchMap(() => {
              const newToken = this.getToken();
              if (!newToken) return throwError(() => new Error('Token refresh failed'));
              const newHeaders = new HttpHeaders({ Authorization: `Bearer ${newToken}` });
              return this.http.get<any>(this.clientsUrl, { headers: newHeaders });
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

}
