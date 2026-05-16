import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Enterprise Analytics</h1>
          <p class="text-slate-500 mt-1">Comprehensive system data visualization and reporting.</p>
        </div>
        <button class="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Export Data
        </button>
      </div>

      <div *ngIf="stats()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in delay-100">
        <div class="glass-card p-6 border-t-4 border-t-indigo-500 hover:-translate-y-1 transition-transform cursor-pointer">
          <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Universities</p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">{{ stats().totalUniversities }}</h3>
          <p class="text-xs text-indigo-600 font-bold mt-2">Active Campuses</p>
        </div>
        
        <div class="glass-card p-6 border-t-4 border-t-emerald-500 hover:-translate-y-1 transition-transform cursor-pointer">
          <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Students</p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">{{ (stats().totalStudents / 1000000).toFixed(2) }}M</h3>
          <p class="text-xs text-emerald-600 font-bold mt-2">Enrolled Globally</p>
        </div>
        
        <div class="glass-card p-6 border-t-4 border-t-green-500 hover:-translate-y-1 transition-transform cursor-pointer">
          <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Revenue</p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">{{ (stats().totalRevenue / 1000000).toFixed(1) }}M</h3>
          <p class="text-xs text-green-600 font-bold mt-2">USD Generated</p>
        </div>
        
        <div class="glass-card p-6 border-t-4 border-t-blue-500 hover:-translate-y-1 transition-transform cursor-pointer">
          <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Active Users</p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">{{ (stats().activeUsers / 1000).toFixed(1) }}K</h3>
          <p class="text-xs text-blue-600 font-bold mt-2">Online Today</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 animate-fade-in delay-200">
        <div class="glass-panel p-6">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">User Growth Trend</h3>
          <div class="h-64 flex items-end justify-between gap-2 border-b border-l border-slate-200 dark:border-slate-700 pb-2 pl-2">
            <div class="w-full bg-indigo-500 hover:bg-indigo-400 transition-colors rounded-t-sm relative group" style="height: 40%">
              <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded">Jan</div>
            </div>
            <div class="w-full bg-indigo-500 hover:bg-indigo-400 transition-colors rounded-t-sm relative group" style="height: 55%">
              <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded">Feb</div>
            </div>
            <div class="w-full bg-indigo-500 hover:bg-indigo-400 transition-colors rounded-t-sm relative group" style="height: 45%">
              <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded">Mar</div>
            </div>
            <div class="w-full bg-indigo-500 hover:bg-indigo-400 transition-colors rounded-t-sm relative group" style="height: 70%">
              <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded">Apr</div>
            </div>
            <div class="w-full bg-mit-red hover:bg-primary-600 transition-colors rounded-t-sm relative group" style="height: 90%">
              <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded">May</div>
            </div>
          </div>
        </div>

        <div class="glass-panel p-6">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">Revenue Distribution</h3>
          <div class="flex items-center justify-center h-64">
            <div class="relative w-48 h-48 rounded-full border-[16px] border-emerald-500" style="border-top-color: #f59e0b; border-right-color: #3b82f6; transform: rotate(45deg);">
              <div class="absolute inset-0 m-auto w-32 h-32 bg-slate-50 dark:bg-slate-900 rounded-full flex flex-col items-center justify-center shadow-inner" style="transform: rotate(-45deg);">
                <span class="text-xs text-slate-500 font-bold uppercase tracking-widest">Total</span>
                <span class="text-xl font-black text-slate-900 dark:text-white">$4.5M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AnalyticsDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  stats = signal<any>(null);

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/systemStats').subscribe(data => {
      this.stats.set(data);
    });
  }
}
