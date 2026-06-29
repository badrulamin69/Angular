import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { PdfService } from '../../core/services/pdf.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-student-transcript',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Academic Transcript
          </h1>
          <p class="text-slate-500 mt-1">
            View your official semester results and academic history.
          </p>
        </div>
        <button
          (click)="downloadPdf()"
          class="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-lg hover:scale-105 transition-transform font-bold flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          Download PDF
        </button>
      </div>

      <!-- Overview Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="glass-panel p-4 text-center">
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Cumulative GPA
          </p>
          <p class="text-2xl font-black text-slate-900 dark:text-white">
            {{ student()?.gpa || '3.85' }}
          </p>
        </div>
        <div class="glass-panel p-4 text-center">
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Total Credits
          </p>
          <p class="text-2xl font-black text-slate-900 dark:text-white">85</p>
        </div>
        <div class="glass-panel p-4 text-center">
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Major Standing
          </p>
          <p class="text-2xl font-black text-slate-900 dark:text-white">Junior</p>
        </div>
        <div class="glass-panel p-4 text-center">
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Academic Status
          </p>
          <p class="text-2xl font-black text-green-600">Excellent</p>
        </div>
      </div>

      <!-- Semester History -->
      <div class="space-y-6">
        <!-- Spring 2026 -->
        <div class="glass-panel overflow-hidden">
          <div
            class="bg-slate-100 dark:bg-slate-800/80 px-6 py-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700"
          >
            <h3 class="font-bold text-slate-900 dark:text-white text-lg">Spring 2026</h3>
            <div class="flex gap-4">
              <span class="text-sm font-medium text-slate-500"
                >Credits Earned:
                <span class="font-bold text-slate-900 dark:text-white">14</span></span
              >
              <span class="text-sm font-medium text-slate-500"
                >Term GPA: <span class="font-bold text-slate-900 dark:text-white">3.90</span></span
              >
            </div>
          </div>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-700">
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Course Code
                </th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Title
                </th>
                <th
                  class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center"
                >
                  Credits
                </th>
                <th
                  class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center"
                >
                  Grade
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr
                *ngFor="let g of grades()"
                class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td class="px-6 py-3 font-bold text-slate-700 dark:text-slate-300">
                  {{ g.courseId }}
                </td>
                <td class="px-6 py-3 text-slate-600 dark:text-slate-400">
                  {{ getCourseName(g.courseId) }}
                </td>
                <td class="px-6 py-3 text-center text-slate-600 dark:text-slate-400">
                  {{ g.credits }}
                </td>
                <td
                  class="px-6 py-3 text-center font-bold text-green-600"
                  [ngClass]="{ 'text-blue-600': g.grade.includes('-') || g.grade.includes('B') }"
                >
                  {{ g.grade }}
                </td>
              </tr>
              <tr *ngIf="grades().length === 0">
                <td colspan="4" class="px-6 py-8 text-center text-slate-500 font-medium">
                  No active academic grades loaded.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class StudentTranscriptComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private pdfService = inject(PdfService);

  student = signal<any>(null);
  grades = signal<any[]>([]);
  courses = signal<any[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const user = this.authService.currentUser();
    const studentId = user?.id || '3'; // Default to Emon Sarker (ID: 3)

    // Load student profile
    this.http.get<any[]>(`${environment.apiUrl}/students`).subscribe((students) => {
      const match = students.find((s) => s.id === studentId);
      if (match) {
        this.student.set(match);
      } else {
        // Fallback profile
        this.student.set({
          id: studentId,
          name: user?.name || 'Emon Sarker',
          email: user?.email || 'student@smartuni.edu',
          program: 'Department of Computer Science and Engineering (CSE)',
          status: 'Active',
          gpa: 3.8,
        });
      }
    });

    // Load courses
    this.http.get<any[]>(`${environment.apiUrl}/courses`).subscribe((data) => {
      this.courses.set(data);
    });

    // Load grades
    this.http.get<any[]>(`${environment.apiUrl}/studentGrades`).subscribe((data) => {
      const filtered = data.filter((g) => g.studentId === studentId);
      if (filtered.length > 0) {
        this.grades.set(filtered);
      } else {
        // Fallback default list if no grades recorded yet
        this.grades.set([
          {
            courseId: 'CS-201',
            grade: 'A',
            gp: 4.0,
            credits: 4,
            title: 'Object Oriented Programming',
          },
          { courseId: 'MTH-102', grade: 'A-', gp: 3.7, credits: 4, title: 'Calculus II' },
          { courseId: 'PHY-101', grade: 'A', gp: 4.0, credits: 3, title: 'Physics for Engineers' },
          { courseId: 'ENG-101', grade: 'A-', gp: 3.7, credits: 3, title: 'English Composition' },
        ]);
      }
    });
  }

  getCourseName(courseId: string): string {
    const match = this.courses().find((c) => c.code === courseId || c.id === courseId);
    return match?.title || 'Advanced Subject Study';
  }

  downloadPdf() {
    if (this.student()) {
      this.pdfService.generateOfficialTranscript(this.student(), this.grades(), this.courses());
    } else {
      alert('Unable to generate transcript. Student record is not loaded.');
    }
  }
}
