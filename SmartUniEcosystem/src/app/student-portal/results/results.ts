import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { PdfService } from '../../core/services/pdf.service';

@Component({
  selector: 'app-student-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8 animate-fade-in-up">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Semester Results
          </h1>
          <p class="text-slate-500 mt-1">
            Track your detailed marks breakdown, term GPA, and course performance.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Semester Selector -->
          <div class="relative">
            <select
              [(ngModel)]="selectedSemester"
              (change)="onSemesterChange()"
              class="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-mit-red transition-all cursor-pointer"
            >
              <option *ngFor="let sem of semesters()" [value]="sem">{{ sem }}</option>
            </select>
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

          <!-- Download Button -->
          <button
            (click)="downloadPdf()"
            [disabled]="filteredResults().length === 0"
            class="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-lg hover:scale-[1.03] transition-all font-bold flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
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
            Download Marksheet
          </button>
        </div>
      </div>

      <!-- KPI Metrics -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="glass-card p-6 border-t-4 border-t-mit-red">
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Term GPA</p>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white">{{ termGPA() }}</h3>
          <p class="text-[10px] text-slate-400 mt-2 font-semibold uppercase tracking-wider">
            For {{ selectedSemester() }}
          </p>
        </div>

        <div class="glass-card p-6 border-t-4 border-t-blue-500">
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Credits Earned
          </p>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white">{{ termCredits() }}</h3>
          <p class="text-[10px] text-slate-400 mt-2 font-semibold uppercase tracking-wider">
            Total Credits Registered
          </p>
        </div>

        <div class="glass-card p-6 border-t-4 border-t-emerald-500">
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Passed Courses
          </p>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white">
            {{ passedCoursesCount() }} / {{ filteredResults().length }}
          </h3>
          <p class="text-[10px] text-slate-400 mt-2 font-semibold uppercase tracking-wider">
            No Failures Recorded
          </p>
        </div>

        <div class="glass-card p-6 border-t-4 border-t-amber-500">
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Academic Standing
          </p>
          <h3
            class="text-3xl font-black"
            [ngClass]="{
              'text-emerald-600': parseFloat(termGPA()) >= 3.5,
              'text-indigo-600': parseFloat(termGPA()) >= 3.0 && parseFloat(termGPA()) < 3.5,
              'text-amber-600': parseFloat(termGPA()) < 3.0,
            }"
          >
            {{ standing() }}
          </h3>
          <p class="text-[10px] text-slate-400 mt-2 font-semibold uppercase tracking-wider">
            Merit Classification
          </p>
        </div>
      </div>

      <!-- Results Table -->
      <div class="glass-panel overflow-hidden">
        <div
          class="p-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex justify-between items-center"
        >
          <h3 class="font-black text-slate-900 dark:text-white text-lg">
            Course-wise Marks Breakdown
          </h3>
          <span
            class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg border border-slate-200/50 dark:border-slate-800/50"
          >
            Active Semester: {{ selectedSemester() }}
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                <th class="px-6 py-4">Course</th>
                <th class="px-6 py-4 text-center">Credits</th>
                <th class="px-6 py-4 text-center">Mid (30)</th>
                <th class="px-6 py-4 text-center">Quizzes (15)</th>
                <th class="px-6 py-4 text-center">Asg (15)</th>
                <th class="px-6 py-4 text-center">Final (40)</th>
                <th class="px-6 py-4 text-center">Total (100)</th>
                <th class="px-6 py-4 text-center">Grade</th>
                <th class="px-6 py-4 text-center">GP</th>
                <th class="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr
                *ngFor="let r of filteredResults()"
                class="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all duration-200 group"
              >
                <td class="px-6 py-4">
                  <span
                    class="font-mono font-bold text-slate-900 dark:text-white text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md"
                    >{{ r.courseCode }}</span
                  >
                  <div
                    class="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1.5 group-hover:text-mit-red transition-colors"
                  >
                    {{ r.courseTitle }}
                  </div>
                </td>
                <td class="px-6 py-4 text-center text-slate-700 dark:text-slate-300 font-bold">
                  {{ r.credits }}
                </td>
                <td class="px-6 py-4 text-center text-slate-600 dark:text-slate-400 font-medium">
                  {{ r.midterm ?? '-' }}
                </td>
                <td class="px-6 py-4 text-center text-slate-600 dark:text-slate-400 font-medium">
                  {{ r.quizzes ?? '-' }}
                </td>
                <td class="px-6 py-4 text-center text-slate-600 dark:text-slate-400 font-medium">
                  {{ r.assignments ?? '-' }}
                </td>
                <td class="px-6 py-4 text-center text-slate-600 dark:text-slate-400 font-medium">
                  {{ r.final ?? '-' }}
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="font-extrabold text-slate-900 dark:text-white">{{
                    r.total ?? '-'
                  }}</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    class="px-2.5 py-0.5 text-xs font-black rounded-md border"
                    [ngClass]="{
                      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900':
                        !r.grade.startsWith('F'),
                      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900':
                        r.grade.startsWith('F'),
                    }"
                  >
                    {{ r.grade }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center text-slate-700 dark:text-slate-300 font-extrabold">
                  {{ r.gp | number: '1.2-2' }}
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    class="inline-flex items-center gap-1 text-xs font-bold"
                    [ngClass]="{
                      'text-green-600 dark:text-green-400': !r.grade.startsWith('F'),
                      'text-rose-600 dark:text-rose-400': r.grade.startsWith('F'),
                    }"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      [ngClass]="{
                        'bg-green-600 dark:bg-green-400': !r.grade.startsWith('F'),
                        'bg-rose-600 dark:bg-rose-400': r.grade.startsWith('F'),
                      }"
                    ></span>
                    {{ r.grade.startsWith('F') ? 'Failed' : 'Passed' }}
                  </span>
                </td>
              </tr>
              <tr *ngIf="filteredResults().length === 0">
                <td
                  colspan="10"
                  class="px-6 py-12 text-center text-slate-500 font-semibold italic bg-slate-50/50 dark:bg-slate-900/50"
                >
                  No academic records found for the selected semester.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class StudentResultsComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private pdfService = inject(PdfService);

  student = signal<any>(null);
  allResults = signal<any[]>([]);
  semesters = signal<string[]>([]);
  selectedSemester = signal<string>('Fall 2026');

  // Computed properties
  filteredResults = computed(() => {
    return this.allResults().filter((r) => r.semester === this.selectedSemester());
  });

  termGPA = computed(() => {
    const results = this.filteredResults();
    if (results.length === 0) return '0.00';
    const totalGP = results.reduce((acc, r) => acc + r.gp * r.credits, 0);
    const totalCredits = results.reduce((acc, r) => acc + r.credits, 0);
    return totalCredits > 0 ? (totalGP / totalCredits).toFixed(2) : '0.00';
  });

  termCredits = computed(() => {
    return this.filteredResults().reduce((acc, r) => acc + r.credits, 0);
  });

  passedCoursesCount = computed(() => {
    return this.filteredResults().filter((r) => !r.grade.startsWith('F')).length;
  });

  standing = computed(() => {
    const gpa = parseFloat(this.termGPA());
    if (gpa >= 3.5) return 'Excellent';
    if (gpa >= 3.0) return 'Good';
    return 'Satisfactory';
  });

  ngOnInit() {
    this.loadData();
  }

  parseFloat(val: string): number {
    return Number(val) || 0;
  }

  loadData() {
    const currentUser = this.authService.currentUser();
    const studentId = currentUser?.id || '3';

    // 1. Fetch Student Profile details
    this.http.get<any[]>('http://localhost:8080/students').subscribe((students) => {
      const match = students.find((s) => String(s.id) === String(studentId));
      if (match) {
        this.student.set(match);
      } else {
        this.student.set({
          id: studentId,
          name: currentUser?.name || 'Emon Sarker',
          email: currentUser?.email || 'student@smartuni.edu',
          program: 'Department of Computer Science and Engineering (CSE)',
          status: 'Active',
          gpa: 3.8,
        });
      }
    });

    // 2. Fetch Detailed Results
    this.http.get<any[]>('http://localhost:8080/studentResults').subscribe((data) => {
      const studentData = data.filter((r) => String(r.studentId) === String(studentId));
      this.allResults.set(studentData);

      // Extract unique semesters list
      const uniqueSemesters = Array.from(new Set(studentData.map((r) => r.semester)));

      // Sort semesters if any, make sure Fall 2026 is default if present
      if (uniqueSemesters.length > 0) {
        this.semesters.set(uniqueSemesters);
        if (uniqueSemesters.includes('Fall 2026')) {
          this.selectedSemester.set('Fall 2026');
        } else {
          this.selectedSemester.set(uniqueSemesters[0]);
        }
      } else {
        // Fallback default semesters
        this.semesters.set(['Fall 2026', 'Spring 2026']);
        this.selectedSemester.set('Fall 2026');
      }
    });
  }

  onSemesterChange() {
    // Dropdown change triggers computed updates
  }

  downloadPdf() {
    if (this.student() && this.filteredResults().length > 0) {
      this.pdfService.generateSemesterMarksheet(
        this.student(),
        this.filteredResults(),
        this.selectedSemester(),
      );
    } else {
      alert('Cannot download marksheet. No records are loaded.');
    }
  }
}
