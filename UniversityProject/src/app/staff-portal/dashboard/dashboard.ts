import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">Admin Dashboard: {{ user()?.name }}</h1>
          <p class="text-slate-500 mt-2">Oversee campus operations, manage institutional records, and track your daily tasks.</p>
        </div>
        <button class="px-5 py-2.5 bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Generate Report
        </button>
      </div>

      <!-- Employee Profile Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-card p-6 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border-teal-500/20">
          <p class="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-1">Designation</p>
          <h4 class="text-xl font-black text-slate-900 dark:text-white">{{ profile()?.designation || 'Staff Member' }}</h4>
          <p class="text-sm text-slate-500 mt-1">{{ profile()?.department }}</p>
        </div>
        <div class="glass-card p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20">
          <p class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Joining Date</p>
          <h4 class="text-xl font-black text-slate-900 dark:text-white">{{ profile()?.joiningDate | date:'mediumDate' }}</h4>
          <p class="text-sm text-slate-500 mt-1">Status: Active</p>
        </div>
        <div class="glass-card p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <p class="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Basic Salary</p>
          <h4 class="text-xl font-black text-slate-900 dark:text-white">{{ profile()?.salary | currency }}</h4>
          <p class="text-sm text-slate-500 mt-1">Next Payment: 1st {{ nextMonth() }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Daily Tasks -->
        <div class="lg:col-span-2 space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-teal-500"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Assigned Operations Tasks
          </h3>
          <div class="glass-panel overflow-hidden">
            <div class="divide-y divide-slate-200 dark:divide-slate-800">
              <div *ngFor="let task of tasks()" class="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-bold text-slate-900 dark:text-white text-lg group-hover:text-teal-600 transition-colors">{{ task.title }}</h4>
                  <span [ngClass]="{
                    'bg-red-100 text-red-700': task.priority === 'High',
                    'bg-amber-100 text-amber-700': task.priority === 'Medium',
                    'bg-slate-100 text-slate-700': task.priority === 'Low'
                  }" class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{{ task.priority }}</span>
                </div>
                <p class="text-sm text-slate-500 mb-4">{{ task.description }}</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <span class="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Due: {{ task.dueDate }}
                    </span>
                    <span class="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2 py-0.5 rounded">{{ task.status }}</span>
                  </div>
                  <button class="text-xs font-bold text-slate-900 dark:text-white hover:underline">Update Status</button>
                </div>
              </div>
              <div *ngIf="tasks().length === 0" class="p-10 text-center text-slate-500">No operations tasks assigned today.</div>
            </div>
          </div>
        </div>

        <!-- Attendance & Activity -->
        <div class="space-y-6">
          <div class="space-y-4">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Recent Attendance</h3>
            <div class="glass-panel p-5 space-y-4">
              <div *ngFor="let log of attendanceLogs()" class="flex items-center justify-between">
                <div>
                  <p class="font-bold text-slate-900 dark:text-white text-sm">{{ log.date }}</p>
                  <p class="text-[10px] text-slate-500 uppercase tracking-tighter">{{ log.checkIn }} - {{ log.checkOut }}</p>
                </div>
                <span class="px-2 py-1 bg-teal-100 text-teal-700 rounded-lg text-[10px] font-bold">{{ log.status }}</span>
              </div>
              <div *ngIf="attendanceLogs().length === 0" class="text-center py-4 text-slate-500 text-xs italic">No recent logs.</div>
            </div>
          </div>

          <div class="glass-card p-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900">
            <h4 class="font-black text-lg mb-2">Need Support?</h4>
            <p class="text-xs opacity-70 mb-4">Contact the IT Helpdesk for any technical issues with the staff portal.</p>
            <button class="w-full py-2 bg-teal-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-teal-500/30">Open Ticket</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StaffDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  user = computed(() => this.authService.currentUser());

  profile = signal<any>(null);
  tasks = signal<any[]>([]);
  attendanceLogs = signal<any[]>([]);
  
  nextMonth = signal(new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(new Date().setMonth(new Date().getMonth() + 1))));

  ngOnInit() {
    const currentUser = this.user();
    if (!currentUser) return;

    this.http.get<any[]>('http://localhost:3000/staffProfiles').subscribe(profiles => {
      this.profile.set(profiles.find(p => p.userId === currentUser.id));
    });

    this.http.get<any[]>('http://localhost:3000/tasks').subscribe(tasks => {
      this.tasks.set(tasks.filter(t => t.assignedTo === currentUser.id));
    });

    this.http.get<any[]>('http://localhost:3000/attendance').subscribe(logs => {
      this.attendanceLogs.set(logs.filter(l => l.userId === currentUser.id));
    });
  }
}
