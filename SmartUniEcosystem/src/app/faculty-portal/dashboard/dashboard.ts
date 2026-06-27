import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { FacultyService } from '../../core/services/faculty.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-faculty-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-8 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none"
          >
            Welcome back, {{ user()?.name }}
          </h1>
          <p class="text-slate-500 mt-2">
            Manage your academic schedule and assigned institutional tasks.
          </p>
        </div>
        <button
          (click)="createNewAssignment()"
          class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2"
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
            <path d="M12 2v20" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          New Assignment
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          class="glass-card p-6 border-t-4 border-t-indigo-500 hover:-translate-y-1 transition-transform cursor-pointer group"
        >
          <p
            class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 group-hover:text-indigo-500 transition-colors"
          >
            Active Courses
          </p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">{{ activeCourses() }}</h3>
        </div>
        <div
          class="glass-card p-6 border-t-4 border-t-purple-500 hover:-translate-y-1 transition-transform cursor-pointer group"
        >
          <p
            class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 group-hover:text-purple-500 transition-colors"
          >
            Total Students
          </p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">{{ totalStudents() }}</h3>
        </div>
        <div
          class="glass-card p-6 border-t-4 border-t-emerald-500 hover:-translate-y-1 transition-transform cursor-pointer group"
        >
          <p
            class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 group-hover:text-emerald-500 transition-colors"
          >
            Avg Attendance
          </p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">{{ avgAttendance() }}%</h3>
        </div>
        <div
          class="glass-card p-6 border-t-4 border-t-amber-500 hover:-translate-y-1 transition-transform cursor-pointer group"
        >
          <p
            class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 group-hover:text-amber-500 transition-colors"
          >
            Pending Grading
          </p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">{{ pendingGrading() }}</h3>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Today's Schedule & Attendance -->
        <div class="lg:col-span-2 space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-indigo-500"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            Daily Attendance & Schedule
          </h3>
          <div class="glass-panel overflow-hidden">
            <div class="divide-y divide-slate-200 dark:divide-slate-800">
              <div
                *ngFor="let log of attendanceLogs()"
                class="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div
                  class="w-16 h-16 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex flex-col items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800"
                >
                  <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400">{{
                    log.checkIn
                  }}</span>
                  <span class="text-[10px] font-medium text-slate-500 uppercase">In</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-slate-900 dark:text-white text-lg">
                    Work Log: {{ log.date }}
                  </h4>
                  <p class="text-sm text-slate-500">
                    Status: {{ log.status }} &bull; Check-out: {{ log.checkOut }}
                  </p>
                </div>
                <span
                  class="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-bold"
                  >{{ log.status }}</span
                >
              </div>
              <div *ngIf="attendanceLogs().length === 0" class="p-8 text-center text-slate-500">
                No attendance records found.
              </div>
            </div>
          </div>
        </div>

        <!-- Assigned Tasks & Leave -->
        <div class="space-y-6">
          <div class="space-y-4">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-amber-500"
              >
                <path
                  d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
                />
                <line x1="12" x2="12" y1="9" y2="13" />
                <line x1="12" x2="12.01" y1="17" y2="17" />
              </svg>
              Assigned Tasks
            </h3>
            <div class="glass-panel p-5 space-y-4">
              <div
                *ngFor="let task of tasks()"
                class="flex gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0"
              >
                <div
                  [ngClass]="{
                    'bg-amber-500': task.priority === 'High',
                    'bg-blue-500': task.priority === 'Medium',
                    'bg-slate-400': task.priority === 'Low',
                  }"
                  class="w-2 h-2 rounded-full mt-2 shrink-0"
                ></div>
                <div>
                  <p class="font-bold text-slate-900 dark:text-white text-sm">{{ task.title }}</p>
                  <p class="text-xs text-slate-500 mt-0.5 line-clamp-2">{{ task.description }}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <span
                      class="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400"
                      >Due: {{ task.dueDate }}</span
                    >
                    <span
                      class="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter"
                      >{{ task.status }}</span
                    >
                  </div>
                </div>
              </div>
              <div
                *ngIf="tasks().length === 0"
                class="text-center py-4 text-slate-500 text-sm italic"
              >
                No pending tasks.
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-purple-500"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              My Leave Status
            </h3>
            <div class="glass-panel p-5">
              <div
                *ngFor="let leave of leaveRequests()"
                class="flex items-center justify-between mb-3 last:mb-0"
              >
                <div>
                  <p class="font-bold text-slate-900 dark:text-white text-sm">{{ leave.type }}</p>
                  <p class="text-xs text-slate-500">{{ leave.startDate }} to {{ leave.endDate }}</p>
                </div>
                <span
                  [ngClass]="{
                    'bg-amber-100 text-amber-700': leave.status === 'Pending',
                    'bg-emerald-100 text-emerald-700': leave.status === 'Approved',
                  }"
                  class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                  >{{ leave.status }}</span
                >
              </div>
              <div
                *ngIf="leaveRequests().length === 0"
                class="text-center text-slate-500 text-xs italic"
              >
                No leave history.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FacultyDashboardComponent implements OnInit {
  private facultyService = inject(FacultyService);
  private authService = inject(AuthService);
  user = computed(() => this.authService.currentUser());

  activeCourses = signal(0);
  totalStudents = signal(0);
  avgAttendance = signal(0);
  pendingGrading = signal(0);

  tasks = signal<any[]>([]);
  attendanceLogs = signal<any[]>([]);
  leaveRequests = signal<any[]>([]);

  ngOnInit() {
    const currentUser = this.user();
    if (!currentUser) return;

    const facultyId = currentUser.id;

    this.facultyService.getCourses(facultyId).subscribe((courses) => {
      this.activeCourses.set(courses.filter((c) => c.status === 'Active').length);
      const students = courses.reduce((acc, c) => acc + (c.enrolled || 0), 0);
      this.totalStudents.set(students);
    });

    this.facultyService.getSubmissions(facultyId).subscribe((submissions) => {
      this.pendingGrading.set(submissions.filter((s) => !s.grade).length);
    });

    this.facultyService.getTasks(facultyId).subscribe((tasks) => {
      this.tasks.set(tasks);
    });

    this.facultyService.getAttendance(facultyId).subscribe((logs) => {
      this.attendanceLogs.set(logs);
      if (logs.length > 0) {
        const present = logs.filter((l) => l.status === 'Present').length;
        this.avgAttendance.set(Math.round((present / logs.length) * 100));
      }
    });

    this.facultyService.getLeaveRequests(facultyId).subscribe((leaves) => {
      this.leaveRequests.set(leaves);
    });
  }

  createNewAssignment() {
    const title = prompt('Enter Assignment Title:');
    if (title) {
      alert(
        `Assignment "${title}" has been drafted. You can finalize it in the Course Management section.`,
      );
    }
  }
}
