import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { RouterModule } from '@angular/router';
import { PdfService } from '../../core/services/pdf.service';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-8 animate-fade-in-up pb-12">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Command Center</h1>
          <p class="text-slate-500 mt-2 font-medium">Academic Year 2026-27 • Institutional Performance Overview</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2 shadow-sm">
            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span class="text-xs font-bold text-slate-600 dark:text-slate-400">System Live</span>
          </div>
          <button (click)="quickAction()" class="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-xl hover:-translate-y-0.5 transition-all font-bold text-sm">
            Quick Action
          </button>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="glass-panel p-6 bg-gradient-to-br from-indigo-500/5 to-transparent border-indigo-500/10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span class="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Students</p>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{{ stats().totalStudents }}</h3>
        </div>

        <div class="glass-panel p-6 bg-gradient-to-br from-mit-red/5 to-transparent border-mit-red/10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-lg bg-mit-red/20 text-mit-red flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
            </div>
            <span class="text-[10px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Pending Apps</p>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{{ stats().pendingApps }}</h3>
        </div>

        <div class="glass-panel p-6 bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <span class="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">Target 95%</span>
          </div>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Fee Collection</p>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">$2.4M</h3>
        </div>

        <div class="glass-panel p-6 bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <span class="text-[10px] font-black text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-full">88% Capacity</span>
          </div>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Hostel Status</p>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">412/500</h3>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Recent Applications -->
        <div class="lg:col-span-2 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Applications</h3>
            <button routerLink="/staff/admissions" class="text-xs font-black text-mit-red uppercase tracking-widest hover:underline">View Pipeline</button>
          </div>
          <div class="glass-panel overflow-hidden">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Applicant</th>
                  <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Program</th>
                  <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">GPA</th>
                  <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr *ngFor="let app of recentApps()" class="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td class="px-6 py-4">
                     <div class="font-bold text-slate-900 dark:text-white">{{ app.fullName }}</div>
                    <div class="text-[10px] text-slate-500 font-medium">{{ app.appliedDate | date:'mediumDate' }}</div>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{{ app.programId }}</td>
                  <td class="px-6 py-4">
                    <span class="font-bold text-slate-900 dark:text-white">{{ app.hscGpa }}</span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button routerLink="/staff/admissions" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-mit-red hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sidebar Activity -->
        <div class="space-y-8">
          <div class="glass-panel p-6">
            <h4 class="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Campus Activity Log</h4>
            <div class="space-y-6">
              <div *ngFor="let log of logs()" class="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-mit-red/50">
                <p class="text-sm font-bold text-slate-900 dark:text-white">{{ log.title }}</p>
                <p class="text-xs text-slate-500">{{ log.time }}</p>
              </div>
            </div>
          </div>

          <div class="glass-card p-6 bg-slate-900 text-white relative overflow-hidden group">
            <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-mit-red/20 rounded-full blur-3xl transition-all group-hover:scale-150"></div>
            <h4 class="font-black text-xl mb-2 relative z-10">Institutional Reports</h4>
            <p class="text-xs text-slate-400 mb-6 relative z-10 leading-relaxed">Download complete financial and academic performance metrics for Q2 2026.</p>
            <button (click)="downloadReport()" class="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-xs relative z-10 hover:scale-105 transition-transform">Download PDF</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StaffDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private pdfService = inject(PdfService);
  
  user = computed(() => this.authService.currentUser());
  
  stats = signal({
    totalStudents: 12450,
    pendingApps: 86,
    feeStatus: '92%',
    hostelOccupancy: '412/500'
  });

  recentApps = signal<any[]>([]);
  logs = signal([
    { title: 'New admission approved by Registrar', time: '2 mins ago' },
    { title: 'Semester fee invoice generated for 400 students', time: '1 hour ago' },
    { title: 'Library inventory updated: 12 new titles', time: '3 hours ago' },
    { title: 'Bus Route B schedule changed for exams', time: '5 hours ago' }
  ]);

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/applications').subscribe(apps => {
      this.recentApps.set(apps.slice(-5).reverse());
      this.stats.update(s => ({ ...s, pendingApps: apps.filter(a => a.status === 'Pending').length }));
    });

    this.http.get<any[]>('http://localhost:3000/students').subscribe(students => {
      this.stats.update(s => ({ ...s, totalStudents: students.length }));
    });
  }

  quickAction() {
    alert('System Quick Action: Database backup and cache clearing initiated.');
  }

  downloadReport() {
    this.pdfService.generateStaffInstitutionalReport(this.stats(), this.recentApps(), this.logs());
  }
}

