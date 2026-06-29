import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-8 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Academic Dashboard
          </h1>
          <p class="text-slate-500 mt-1">
            Welcome back, {{ user()?.name }}! Here is your academic progress.
          </p>
        </div>
        <button
          routerLink="/student/registration"
          class="px-5 py-2.5 bg-gradient-to-r from-mit-red to-primary-600 text-white rounded-xl shadow-lg shadow-mit-red/30 hover:shadow-mit-red/50 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2"
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
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            <path d="M8 7h6" />
            <path d="M8 11h8" />
          </svg>
          Register Courses
        </button>
      </div>

      <!-- KPI Widgets -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          class="glass-card p-6 border-t-4 border-t-mit-red hover:-translate-y-1 transition-transform cursor-pointer group"
        >
          <p
            class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 group-hover:text-mit-red transition-colors"
          >
            Current CGPA
          </p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">
            {{ cgpa() | number: '1.2-2' }}
          </h3>
          <p class="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
            Overall Merit
          </p>
        </div>
        <div
          class="glass-card p-6 border-t-4 border-t-blue-500 hover:-translate-y-1 transition-transform cursor-pointer group"
        >
          <p
            class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 group-hover:text-blue-500 transition-colors"
          >
            Credits Completed
          </p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">
            {{ totalCredits() }}<span class="text-lg text-slate-400">/140</span>
          </h3>
          <div
            class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden"
          >
            <div
              class="bg-blue-500 h-full rounded-full"
              [style.width.%]="(totalCredits() / 140) * 100"
            ></div>
          </div>
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
          <p class="text-xs text-slate-500 mt-2 font-medium">Safe from academic probation</p>
        </div>
        <div
          class="glass-card p-6 border-t-4 border-t-amber-500 hover:-translate-y-1 transition-transform cursor-pointer group"
        >
          <p
            class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 group-hover:text-amber-500 transition-colors"
          >
            Active Courses
          </p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">
            {{ enrollments().length }}
          </h3>
          <p class="text-xs text-amber-600 font-bold mt-2">Currently enrolled</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Current Semester Courses -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">
              Current Semester Courses
            </h3>
            <a href="#" class="text-mit-red text-sm font-bold hover:underline">View Schedule</a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Dynamic Course Cards -->
            <div
              *ngFor="let enroll of enrollments()"
              class="glass-panel p-5 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div
                class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full -z-10 group-hover:from-blue-500/20 transition-colors"
              ></div>
              <div class="flex justify-between items-start mb-2">
                <span
                  class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs font-black tracking-wider rounded-md border border-slate-200 dark:border-slate-700"
                  >{{ enroll.courseId }}</span
                >
                <span class="text-xs font-bold text-slate-500">{{ enroll.semester }}</span>
              </div>
              <h4 class="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-4">
                {{ enroll.courseTitle || 'Loading Course...' }}
              </h4>

              <div class="space-y-3">
                <div>
                  <div class="flex justify-between text-xs mb-1 font-medium text-slate-500">
                    <span>Attendance</span>
                    <span class="text-slate-700 dark:text-slate-300 font-bold"
                      >{{ enroll.attendance }}%</span
                    >
                  </div>
                  <div
                    class="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden"
                  >
                    <div
                      class="bg-blue-500 h-full rounded-full"
                      [style.width.%]="enroll.attendance"
                    ></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs mb-1 font-medium text-slate-500">
                    <span>Course Progress</span>
                    <span class="text-slate-700 dark:text-slate-300 font-bold"
                      >{{ enroll.progress }}%</span
                    >
                  </div>
                  <div
                    class="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden"
                  >
                    <div
                      class="bg-emerald-500 h-full rounded-full"
                      [style.width.%]="enroll.progress"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div
              *ngIf="enrollments().length === 0"
              class="col-span-2 p-12 text-center text-slate-500 glass-panel"
            >
              No active enrollments found for this semester.
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Pending Deadlines -->
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
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Upcoming Deadlines
            </h3>
            <div class="glass-panel p-5 space-y-4">
              <div
                class="flex gap-3 items-start border-b border-slate-200 dark:border-slate-800 pb-3"
              >
                <div
                  class="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 flex flex-col items-center justify-center shrink-0"
                >
                  <span class="text-xs font-bold text-red-600 dark:text-red-400">OCT</span>
                  <span class="text-sm font-black text-red-700 dark:text-red-300">14</span>
                </div>
                <div>
                  <p class="font-bold text-slate-900 dark:text-white text-sm">
                    Data Structures Midterm
                  </p>
                  <p class="text-xs text-slate-500 mt-0.5">Online Exam Portal &bull; 10:00 AM</p>
                </div>
              </div>
              <div
                class="flex gap-3 items-start border-b border-slate-200 dark:border-slate-800 pb-3"
              >
                <div
                  class="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 flex flex-col items-center justify-center shrink-0"
                >
                  <span class="text-xs font-bold text-amber-600 dark:text-amber-400">OCT</span>
                  <span class="text-sm font-black text-amber-700 dark:text-amber-300">16</span>
                </div>
                <div>
                  <p class="font-bold text-slate-900 dark:text-white text-sm">
                    Algorithm Assignment 3
                  </p>
                  <p class="text-xs text-slate-500 mt-0.5">LMS Submission &bull; Due 11:59 PM</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Financial Status -->
          <div
            class="glass-card p-5 border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900"
          >
            <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              Financial Status
            </h3>
            <div class="flex justify-between items-end">
              <div>
                <p class="text-xs font-medium text-slate-500 mb-1">Due for Fall 2026</p>
                <p class="text-2xl font-black text-slate-900 dark:text-white">$0.00</p>
              </div>
              <span
                class="px-2.5 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md text-xs font-bold"
                >Fully Paid</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class StudentDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  user = computed(() => this.authService.currentUser());

  enrollments = signal<any[]>([]);
  grades = signal<any[]>([]);

  cgpa = computed(() => {
    const data = this.grades();
    if (data.length === 0) return 0;
    const totalGP = data.reduce((acc, g) => acc + g.gp * g.credits, 0);
    const totalCredits = data.reduce((acc, g) => acc + g.credits, 0);
    return totalCredits > 0 ? totalGP / totalCredits : 0;
  });

  totalCredits = computed(() => {
    return this.grades().reduce((acc, g) => acc + g.credits, 0);
  });

  avgAttendance = computed(() => {
    const enrolls = this.enrollments();
    if (enrolls.length === 0) return 0;
    return Math.round(enrolls.reduce((acc, e) => acc + e.attendance, 0) / enrolls.length);
  });

  ngOnInit() {
    const currentUser = this.user();
    if (!currentUser) return;

    // Fetch Enrollments and link with Course Titles
    this.http.get<any[]>(`${environment.apiUrl}/enrollments`).subscribe((enrolls) => {
      const studentEnrolls = enrolls.filter((e) => e.studentId === currentUser.id);

      this.http.get<any[]>(`${environment.apiUrl}/courses`).subscribe((courses) => {
        const enriched = studentEnrolls.map((e) => ({
          ...e,
          courseTitle: courses.find((c) => c.code === e.courseId)?.title || e.courseId,
        }));
        this.enrollments.set(enriched);
      });
    });

    // Fetch Grades
    this.http.get<any[]>(`${environment.apiUrl}/studentGrades`).subscribe((grades) => {
      this.grades.set(grades.filter((g) => g.studentId === currentUser.id));
    });
  }
}
