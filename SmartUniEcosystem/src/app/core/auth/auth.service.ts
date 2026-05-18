import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  universityId?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  
  // Angular Signal for reactive state management
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const storedUser = localStorage.getItem('smartuni_user');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string) {
    // Fake login: query JSON server by email
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      tap(users => {
        // In a real app, password verification happens on the backend.
        // Here we simulate it by checking the password against the mock db user.
        const user = users.find(u => (u as any).password === password);
        
        if (user) {
          // Generate fake JWT token
          user.token = btoa(JSON.stringify({ id: user.id, role: user.role, timestamp: Date.now() }));
          this.currentUser.set(user);
          localStorage.setItem('smartuni_user', JSON.stringify(user));
        } else {
          throw new Error('Invalid credentials');
        }
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('smartuni_user');
    this.router.navigate(['/login']);
  }
  
  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
  
  hasRole(role: string): boolean {
    return this.currentUser()?.role === role;
  }
}
