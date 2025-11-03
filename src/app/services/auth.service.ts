import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: number;
    email: string;
    customerId?: number;
    role?: string;
  };
  // extend with any additional fields your API returns
}

export interface CurrentUser {
  id: number;
  email: string;
  customerId?: number;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorageKey = 'auth_token';

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const url = `${environment.apiUrl}/users/login`;
    return this.http.post<LoginResponse>(url, credentials).pipe(
      tap((response) => {
        if (response?.token) {
          localStorage.setItem(this.tokenStorageKey, response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenStorageKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  getCurrentUser(): Observable<CurrentUser> {
    const url = `${environment.apiUrl}/users/me`;
    return this.http.get<CurrentUser>(url);
  }

  // Método auxiliar para decodificar el token JWT y obtener el email
  getEmailFromToken(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    
    try {
      // Decodificar el payload del JWT (base64)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email || null;
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }
}


