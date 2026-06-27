import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

export interface ContentItem {
  id?: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080';

  getFeatures() {
    return this.http.get<ContentItem[]>(`${this.apiUrl}/features`).pipe(
      map((items) => (items?.length ? items : this.getFallbackFeatures())),
      catchError(() => of(this.getFallbackFeatures())),
    );
  }

  getHeroContent() {
    return this.http
      .get<{ eyebrow: string; title: string; description: string }>(`${this.apiUrl}/heroContent`)
      .pipe(
        map((content) => content || this.getFallbackHeroContent()),
        catchError(() => of(this.getFallbackHeroContent())),
      );
  }

  private getFallbackFeatures(): ContentItem[] {
    return [
      {
        title: 'University ERP',
        description:
          'Streamline administrative workflows, faculty management, and campus operations with a unified intelligent system.',
        icon: 'svg-erp',
        color: 'from-blue-500 to-cyan-400',
      },
      {
        title: 'Intelligent LMS',
        description:
          'Next-generation learning management with interactive courses, real-time collaboration, and automated assessments.',
        icon: 'svg-lms',
        color: 'from-mit-red to-orange-500',
      },
      {
        title: 'Examination Engine',
        description:
          'Secure, proctored digital examinations with automated grading and detailed performance analytics.',
        icon: 'svg-exam',
        color: 'from-emerald-500 to-teal-400',
      },
    ];
  }

  private getFallbackHeroContent() {
    return {
      eyebrow: 'Next-Gen Academic OS v2.0',
      title: 'Transform Universities Into Intelligent Digital Campuses',
      description:
        'Enterprise ERP + LMS ecosystem for modern higher education institutions. Unify data, automate workflows, and elevate the learning experience with AI-powered analytics.',
    };
  }
}
