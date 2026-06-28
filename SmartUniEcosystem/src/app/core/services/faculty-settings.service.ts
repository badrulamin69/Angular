import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export interface FacultySettings {
  id: string;
  userId: string;
  theme: string;
  sidebarCollapsed: boolean;
  emailNotifications: boolean;
  assignmentNotifications: boolean;
  examNotifications: boolean;
  messageNotifications: boolean;
  profileVisibility: boolean;
  phoneVisibility: boolean;
  lastUpdated: string;
}

export interface Session {
  id: string;
  userId: string;
  device: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  current: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FacultySettingsService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080';

  // Fetch Settings for a specific user
  getSettings(userId: string): Observable<FacultySettings> {
    return this.http
      .get<FacultySettings[]>(`${this.baseUrl}/facultySettings?userId=${userId}`)
      .pipe(
        map((settings) => {
          if (settings && settings.length > 0) {
            return settings[0];
          }
          // Fallback default settings object
          return {
            id: '1',
            userId: userId,
            theme: 'light',
            sidebarCollapsed: false,
            emailNotifications: true,
            assignmentNotifications: true,
            examNotifications: true,
            messageNotifications: true,
            profileVisibility: true,
            phoneVisibility: false,
            lastUpdated: new Date().toISOString(),
          };
        }),
      );
  }

  // Update Settings in both collections to keep db.json consistent
  updateSettings(id: string, settings: Partial<FacultySettings>): Observable<any> {
    const p1 = this.http.patch(`${this.baseUrl}/facultySettings/${id}`, settings);
    const p2 = this.http.patch(`${this.baseUrl}/facultySettings/${id}`, settings);
    return forkJoin([p1, p2]);
  }

  // Fetch Session List
  getSessions(userId: string): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}/sessions?userId=${userId}`);
  }

  // Delete/Terminate a session
  deleteSession(sessionId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/sessions/${sessionId}`);
  }

  // Terminate all sessions except current one
  deleteOtherSessions(userId: string, currentSessionId: string): Observable<any> {
    return this.getSessions(userId).pipe(
      map((sessions) => {
        const deleteRequests = sessions
          .filter((s) => s.id !== currentSessionId)
          .map((s) => this.deleteSession(s.id));
        return forkJoin(deleteRequests);
      }),
    );
  }

  // Update User profile details (Full name, phone, designation, employeeId, profilePhoto)
  updateUserProfile(userId: string, profileData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/users/${userId}`, profileData);
  }

  // Change password endpoint
  updatePassword(userId: string, newPassword: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/users/${userId}`, { password: newPassword });
  }
}
