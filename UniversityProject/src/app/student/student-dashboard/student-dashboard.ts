import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Student Dashboard</h1>
          <p class="text-slate-500 mt-1">View courses, grades, attendance, and registration.</p>
        </div>
        <button class="px-4 py-2 bg-gradient-to-r from-mit-red to-primary-600 text-white rounded-xl shadow-lg shadow-mit-red/30 hover:shadow-mit-red/50 hover:-translate-y-0.5 transition-all font-bold">
          Register for Next Term
        </button>
      </div>

      <!-- Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in delay-100">
        <div class="glass-card p-6 border-l-4 border-l-mit-red">
          <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Enrolled Courses</p>
          <h2 class="text-3xl font-black text-slate-900 dark:text-white">{{ activeCourses() }}</h2>
          <p class="text-xs text-slate-500 mt-2 font-medium">Current Semester</p>
        </div>
        <div class="glass-card p-6 border-l-4 border-l-indigo-500">
          <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Current GPA</p>
          <h2 class="text-3xl font-black text-slate-900 dark:text-white">3.85</h2>
          <p class="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-bold">Top 15% of Class</p>
        </div>
        <div class="glass-card p-6 border-l-4 border-l-emerald-500">
          <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Credits</p>
          <h2 class="text-3xl font-black text-slate-900 dark:text-white">{{ totalCredits() }}</h2>
          <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-bold">Progress to Degree: 65%</p>
        </div>
      </div>

      <!-- Recent Notifications & Schedule -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 animate-fade-in delay-200">
        <!-- Notifications -->
        <div class="glass-panel p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Recent Notifications</h3>
            <span class="bg-mit-red text-white text-xs font-bold px-2 py-1 rounded-full">{{ notifications().length }} New</span>
          </div>
          <ul class="space-y-4">
            <li *ngFor="let n of notifications()" class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ n.message }}</p>
                  <p class="text-xs text-slate-500 mt-1">{{ n.timestamp | date:'short' }}</p>
                </div>
              </div>
            </li>
            <li *ngIf="notifications().length === 0" class="text-center text-slate-500 py-4">No new notifications.</li>
          </ul>
        </div>

        <!-- Enrolled Courses -->
        <div class="glass-panel p-6">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">Today's Schedule</h3>
          <div class="space-y-3">
            <div *ngFor="let c of courses().slice(0,3)" class="flex items-center justify-between p-3 border-l-4 border-slate-900 dark:border-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl">
              <div>
                <p class="font-bold text-slate-900 dark:text-white">{{ c.code }} - {{ c.title }}</p>
                <p class="text-xs text-slate-500">{{ c.department }} Department</p>
              </div>
              <span class="text-xs font-bold px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300">{{ c.credits }} Credits</span>
            </div>
            <div *ngIf="courses().length === 0" class="text-center text-slate-500 py-4">No classes scheduled today.</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  
  notifications = signal<any[]>([]);
  courses = signal<any[]>([]);
  activeCourses = signal<number>(0);
  totalCredits = signal<number>(0);

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/notifications?userId=3').subscribe(data => {
      this.notifications.set(data);
    });

    this.http.get<any[]>('http://localhost:3000/courses?status=Active').subscribe(data => {
      this.courses.set(data);
      this.activeCourses.set(data.length);
      const credits = data.reduce((sum, c) => sum + (c.credits || 0), 0);
      this.totalCredits.set(credits);
    });
  }
}
