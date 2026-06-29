import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-staff-admissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Admissions Handling
          </h1>
          <p class="text-slate-500 mt-1">
            Review, approve, and manage incoming university applications.
          </p>
        </div>
        <button
          (click)="openNewSession()"
          class="px-5 py-2.5 bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2"
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" x2="19" y1="8" y2="14" />
            <line x1="22" x2="16" y1="11" y2="11" />
          </svg>
          Open New Session
        </button>
      </div>

      <!-- Applicant Pipeline KPIs from real data -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="glass-card p-6 border-b-4 border-b-blue-500">
          <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
            New Applications
          </p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">{{ stats().new }}</h3>
        </div>
        <div class="glass-card p-6 border-b-4 border-b-amber-500">
          <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">In Review</p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">{{ stats().review }}</h3>
        </div>
        <div class="glass-card p-6 border-b-4 border-b-teal-500">
          <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Accepted</p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">{{ stats().accepted }}</h3>
        </div>
        <div class="glass-card p-6 border-b-4 border-b-red-500">
          <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Rejected</p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">{{ stats().rejected }}</h3>
        </div>
      </div>

      <!-- Applications Table -->
      <div class="glass-panel overflow-hidden">
        <div
          class="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50"
        >
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-slate-900 dark:text-white">Application Pipeline</h3>
            <span
              class="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-full"
              >{{ currentSemester }}</span
            >
          </div>
          <div class="flex gap-3">
            <!-- Program filter from DB -->
            <select
              [(ngModel)]="selectedProgram"
              (change)="applyFilters()"
              class="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              <option value="">All Programs</option>
              <option *ngFor="let p of programs()" [value]="p.id">{{ p.name }}</option>
            </select>
            <div class="relative w-64">
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
                class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (ngModelChange)="applyFilters()"
                placeholder="Search applicant..."
                class="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                App ID
              </th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Applicant Name
              </th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Program
              </th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Prior GPA
              </th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th
                class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr
              *ngFor="let app of filteredApplications()"
              class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
            >
              <td class="px-6 py-4 font-mono text-sm text-slate-600 dark:text-slate-400">
                {{ app.id }}
              </td>
              <td class="px-6 py-4">
                <div class="font-bold text-slate-900 dark:text-white leading-tight">
                  {{ app.fullName }}
                </div>
                <div class="text-[10px] text-slate-500 uppercase font-bold">
                  {{ app.appliedDate | date: 'medium' }}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                {{ app.programId }}
              </td>
              <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ app.hscGpa }}</td>
              <td class="px-6 py-4">
                <span
                  [ngClass]="{
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400':
                      app.status === 'Pending',
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400':
                      app.status === 'Under Review',
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                      app.status === 'Approved',
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400':
                      app.status === 'Rejected',
                  }"
                  class="px-2.5 py-1 rounded-md text-xs font-bold"
                  >{{ app.status }}</span
                >
              </td>
              <td class="px-6 py-4 text-right flex justify-end gap-2">
                <button
                  *ngIf="app.status === 'Pending'"
                  (click)="updateStatus(app.id, 'Under Review')"
                  class="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                >
                  Start Review
                </button>

                <ng-container *ngIf="app.status === 'Under Review'">
                  <button
                    (click)="updateStatus(app.id, 'Approved')"
                    class="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 flex items-center justify-center hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                    title="Approve"
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
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </button>
                  <button
                    (click)="updateStatus(app.id, 'Rejected')"
                    class="w-8 h-8 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    title="Reject"
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
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </ng-container>

                <button
                  *ngIf="app.status === 'Approved'"
                  (click)="enrollStudent(app)"
                  class="px-3 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Enroll Student
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredApplications().length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-slate-500">
                No applications found for the current criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- New Session Modal -->
    <div
      *ngIf="isSessionModalOpen()"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        (click)="closeSessionModal()"
      ></div>
      <div class="glass-panel w-full max-w-md p-6 relative z-10 animate-fade-in-up">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">
            Open New Admission Session
          </h3>
          <button
            (click)="closeSessionModal()"
            class="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2"
              >Session Name</label
            >
            <input
              type="text"
              [(ngModel)]="newSessionName"
              placeholder="e.g. Spring 2027 Admissions"
              class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-teal-500 text-sm font-medium text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Start Date</label>
            <input
              type="date"
              [(ngModel)]="sessionStartDate"
              class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-teal-500 text-sm text-slate-700 dark:text-slate-300"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">End Date</label>
            <input
              type="date"
              [(ngModel)]="sessionEndDate"
              class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-teal-500 text-sm text-slate-700 dark:text-slate-300"
            />
          </div>
        </div>
        <div
          class="pt-5 mt-5 border-t border-slate-200 dark:border-slate-700 flex gap-3 justify-end"
        >
          <button
            (click)="closeSessionModal()"
            class="px-5 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            (click)="saveSession()"
            class="px-5 py-2 bg-teal-600 text-white rounded-xl font-bold shadow-lg hover:bg-teal-700 transition-colors"
          >
            Open Session
          </button>
        </div>
      </div>
    </div>

    <!-- Enroll Student Modal -->
    <div *ngIf="enrollingApp()" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        (click)="closeEnrollModal()"
      ></div>
      <div class="glass-panel w-full max-w-md p-6 relative z-10 animate-fade-in-up">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">Enroll Student</h3>
          <button
            (click)="closeEnrollModal()"
            class="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>
        <div
          class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 mb-5"
        >
          <p class="text-xs text-slate-400 uppercase font-bold mb-1">Applicant</p>
          <p class="font-bold text-slate-900 dark:text-white">{{ enrollingApp()?.fullName }}</p>
          <p class="text-xs text-slate-500 mt-1">Program: {{ enrollingApp()?.programId }}</p>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2"
              >Assign University</label
            >
            <select
              [(ngModel)]="enrollUniversityId"
              class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-teal-500 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              <option *ngFor="let u of universities()" [value]="u.id">{{ u.name }}</option>
            </select>
          </div>
        </div>
        <div
          class="pt-5 mt-5 border-t border-slate-200 dark:border-slate-700 flex gap-3 justify-end"
        >
          <button
            (click)="closeEnrollModal()"
            class="px-5 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            (click)="confirmEnroll()"
            class="px-5 py-2 bg-teal-600 text-white rounded-xl font-bold shadow-lg hover:bg-teal-700 transition-colors"
          >
            Confirm Enrollment
          </button>
        </div>
      </div>
    </div>
  `,
})
export class StaffAdmissionsComponent implements OnInit {
  private http = inject(HttpClient);

  applications = signal<any[]>([]);
  programs = signal<any[]>([]);
  universities = signal<any[]>([]);
  searchQuery = '';
  selectedProgram = '';

  isSessionModalOpen = signal(false);
  newSessionName = '';
  sessionStartDate = '';
  sessionEndDate = '';

  enrollingApp = signal<any | null>(null);
  enrollUniversityId = '';

  currentSemester = this.getCurrentSemester();

  stats = computed(() => {
    const apps = this.applications();
    return {
      new: apps.filter((a) => a.status === 'Pending').length,
      review: apps.filter((a) => a.status === 'Under Review').length,
      accepted: apps.filter((a) => a.status === 'Approved').length,
      rejected: apps.filter((a) => a.status === 'Rejected').length,
      total: apps.length,
    };
  });

  filteredApplications = computed(() => {
    let apps = this.applications();
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      apps = apps.filter(
        (a) =>
          (a.fullName || '').toLowerCase().includes(q) || (a.id || '').toLowerCase().includes(q),
      );
    }
    if (this.selectedProgram) {
      apps = apps.filter((a) => a.programId === this.selectedProgram);
    }
    return apps;
  });

  ngOnInit() {
    this.loadApplications();
    this.http
      .get<any[]>(`${environment.apiUrl}/programs`)
      .subscribe((data) => this.programs.set(data));
    this.http.get<any[]>(`${environment.apiUrl}/universities`).subscribe((data) => {
      this.universities.set(data);
      if (data.length) this.enrollUniversityId = data[0].id;
    });
  }

  loadApplications() {
    this.http.get<any[]>(`${environment.apiUrl}/applications`).subscribe((data) => {
      this.applications.set(data);
    });
  }

  applyFilters() {
    // Triggers computed signal re-evaluation automatically
  }

  updateStatus(id: string, status: string) {
    this.http.patch(`${environment.apiUrl}/applications/${id}`, { status }).subscribe(() => {
      this.applications.update((apps) => apps.map((a) => (a.id === id ? { ...a, status } : a)));
    });
  }

  openNewSession() {
    this.newSessionName = '';
    this.sessionStartDate = new Date().toISOString().split('T')[0];
    this.sessionEndDate = '';
    this.isSessionModalOpen.set(true);
  }

  closeSessionModal() {
    this.isSessionModalOpen.set(false);
  }

  saveSession() {
    if (!this.newSessionName.trim()) return;
    this.currentSemester = this.newSessionName;
    this.closeSessionModal();
  }

  enrollStudent(app: any) {
    this.enrollingApp.set(app);
  }

  closeEnrollModal() {
    this.enrollingApp.set(null);
  }

  confirmEnroll() {
    const app = this.enrollingApp();
    if (!app) return;
    const studentId =
      'STU-' +
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
    const newStudent = {
      id: studentId,
      name: app.fullName,
      email: app.applicantId + '@student.academy.edu',
      program: app.programId,
      status: 'Active',
      gpa: 0.0,
    };
    const newUser = {
      id: studentId,
      name: app.fullName,
      email: app.applicantId + '@student.smartuni.edu',
      password: 'password',
      role: 'Student',
      universityId: this.enrollUniversityId,
    };
    this.http.post(`${environment.apiUrl}/students`, newStudent).subscribe(() => {
      this.http.post(`${environment.apiUrl}/users`, newUser).subscribe(() => {
        this.closeEnrollModal();
      });
    });
  }

  private getCurrentSemester(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    if (month < 5) return `Spring ${year}`;
    if (month < 8) return `Summer ${year}`;
    return `Fall ${year}`;
  }
}
