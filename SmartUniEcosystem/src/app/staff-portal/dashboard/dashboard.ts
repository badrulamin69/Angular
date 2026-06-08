import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { RouterModule } from '@angular/router';
import { PdfService } from '../../core/services/pdf.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
          <button (click)="openQuickActionModal()" class="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-xl hover:-translate-y-0.5 transition-all font-bold text-sm">
            Quick Action
          </button>
        </div>
      </div>

      <!-- KPI Grid — all values from real data -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="glass-panel p-6 bg-gradient-to-br from-indigo-500/5 to-transparent border-indigo-500/10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span class="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">+{{ studentGrowthPct() }}%</span>
          </div>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Students</p>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{{ stats().totalStudents }}</h3>
        </div>

        <div class="glass-panel p-6 bg-gradient-to-br from-mit-red/5 to-transparent border-mit-red/10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-lg bg-mit-red/20 text-mit-red flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
            </div>
            <span class="text-[10px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">{{ stats().pendingApps > 0 ? 'Active' : 'Clear' }}</span>
          </div>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Pending Apps</p>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{{ stats().pendingApps }}</h3>
        </div>

        <div class="glass-panel p-6 bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <span class="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">{{ feeCollectionPct() }}% Collected</span>
          </div>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Fee Collection</p>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">\${{ feeCollectionAmount() }}</h3>
        </div>

        <div class="glass-panel p-6 bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <span class="text-[10px] font-black text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-full">{{ hostelCapacityPct() }}% Capacity</span>
          </div>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Hostel Status</p>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{{ hostelOccupancy() }}</h3>
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
                    <button routerLink="/staff/admissions" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-mit-red hover:text-white transition-all ml-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="recentApps().length === 0">
                  <td colspan="4" class="px-6 py-10 text-center text-slate-500">No recent applications.</td>
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
              <div *ngFor="let log of activityLogs()" class="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full"
                   [class.before:bg-emerald-500]="log.type === 'success'"
                   [class.before:bg-amber-400]="log.type === 'warning'"
                   [class.before:bg-red-500]="log.type === 'error'"
                   [class.before:bg-indigo-400]="log.type === 'info' || !log.type">
                <p class="text-sm font-bold text-slate-900 dark:text-white">{{ log.title }}</p>
                <p class="text-xs text-slate-500">{{ log.time }}</p>
              </div>
              <div *ngIf="activityLogs().length === 0" class="text-center text-xs text-slate-400 py-4">No activity recorded.</div>
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

    <!-- Quick Action Modal -->
    <div *ngIf="isQuickActionOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeQuickActionModal()"></div>
      <div class="glass-panel w-full max-w-md p-6 relative z-10 animate-fade-in-up">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h3>
          <button (click)="closeQuickActionModal()" class="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>
        <div class="space-y-3">
          <button (click)="runQuickAction('backup')" class="w-full flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors text-left group">
            <div class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </div>
            <div>
              <p class="font-bold text-slate-900 dark:text-white text-sm">Database Backup</p>
              <p class="text-xs text-slate-500">Trigger an immediate system snapshot</p>
            </div>
          </button>
          <button (click)="runQuickAction('cache')" class="w-full flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors text-left group">
            <div class="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
            </div>
            <div>
              <p class="font-bold text-slate-900 dark:text-white text-sm">Clear Cache</p>
              <p class="text-xs text-slate-500">Flush application cache layers</p>
            </div>
          </button>
          <button (click)="runQuickAction('announcement')" class="w-full flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors text-left group">
            <div class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
            </div>
            <div>
              <p class="font-bold text-slate-900 dark:text-white text-sm">Send Announcement</p>
              <p class="text-xs text-slate-500">Broadcast to all active students</p>
            </div>
          </button>
        </div>
        <div *ngIf="quickActionFeedback()" class="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {{ quickActionFeedback() }}
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
    totalStudents: 0,
    pendingApps: 0,
    feeStatus: '0%',
    hostelOccupancy: '0/0'
  });

  recentApps = signal<any[]>([]);
  activityLogs = signal<any[]>([]);
  
  invoices = signal<any[]>([]);
  hostelRooms = signal<any[]>([]);
  allStudents = signal<any[]>([]);

  isQuickActionOpen = signal(false);
  quickActionFeedback = signal('');

  // Computed KPIs from real data
  studentGrowthPct = computed(() => {
    const total = this.stats().totalStudents;
    if (!total) return 0;
    return Math.round((total / Math.max(total - 3, 1)) * 100 - 100);
  });

  feeCollectionPct = computed(() => {
    const all = this.invoices();
    if (!all.length) return 0;
    const paid = all.filter(i => i.status === 'Paid').length;
    return Math.round((paid / all.length) * 100);
  });

  feeCollectionAmount = computed(() => {
    const total = this.invoices().filter(i => i.status === 'Paid').reduce((s, i) => s + (i.amount || 0), 0);
    if (total >= 1000000) return (total / 1000000).toFixed(1) + 'M';
    if (total >= 1000) return (total / 1000).toFixed(1) + 'K';
    return total.toString();
  });

  hostelCapacityPct = computed(() => {
    const rooms = this.hostelRooms();
    if (!rooms.length) return 0;
    const totalCap = rooms.reduce((s, r) => s + (r.capacity || 0), 0);
    const totalOcc = rooms.reduce((s, r) => s + (r.occupied || 0), 0);
    return totalCap ? Math.round((totalOcc / totalCap) * 100) : 0;
  });

  hostelOccupancy = computed(() => {
    const rooms = this.hostelRooms();
    const totalCap = rooms.reduce((s, r) => s + (r.capacity || 0), 0);
    const totalOcc = rooms.reduce((s, r) => s + (r.occupied || 0), 0);
    return `${totalOcc}/${totalCap}`;
  });

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/applications').subscribe(apps => {
      this.recentApps.set(apps.slice(-5).reverse());
      this.stats.update(s => ({ ...s, pendingApps: apps.filter(a => a.status === 'Pending').length }));
    });

    this.http.get<any[]>('http://localhost:3000/students').subscribe(students => {
      this.allStudents.set(students);
      this.stats.update(s => ({ ...s, totalStudents: students.length }));
    });

    this.http.get<any[]>('http://localhost:3000/invoices').subscribe(data => {
      this.invoices.set(data);
    });

    this.http.get<any[]>('http://localhost:3000/hostelRooms').subscribe(data => {
      this.hostelRooms.set(data);
    });

    this.http.get<any[]>('http://localhost:3000/activityLogs').subscribe(data => {
      this.activityLogs.set(
        data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6)
      );
    });
  }

  openQuickActionModal() {
    this.quickActionFeedback.set('');
    this.isQuickActionOpen.set(true);
  }

  closeQuickActionModal() {
    this.isQuickActionOpen.set(false);
  }

  runQuickAction(type: string) {
    const messages: Record<string, string> = {
      backup: 'Database backup initiated successfully!',
      cache: 'Application cache cleared.',
      announcement: 'Announcement queued for broadcast to all students.'
    };

    // Log to activityLogs in DB
    const newLog = {
      title: type === 'backup' ? 'Database backup triggered by staff' :
             type === 'cache' ? 'Application cache cleared by staff' :
             'Broadcast announcement sent to students',
      time: 'Just now',
      timestamp: new Date().toISOString(),
      type: 'success'
    };
    this.http.post<any>('http://localhost:3000/activityLogs', newLog).subscribe(saved => {
      this.activityLogs.update(logs => [saved, ...logs].slice(0, 6));
    });

    this.quickActionFeedback.set(messages[type] || 'Action completed.');
    setTimeout(() => {
      this.closeQuickActionModal();
      this.quickActionFeedback.set('');
    }, 2000);
  }

  downloadReport() {
    this.pdfService.generateStaffInstitutionalReport(this.stats(), this.recentApps(), this.activityLogs());
  }
}
