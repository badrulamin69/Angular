import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Finance Center</h1>
          <p class="text-slate-500 mt-1">Real-time revenue, invoices, and scholarship analytics.</p>
        </div>
        <button class="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Download Report
        </button>
      </div>

      <!-- KPI Widgets -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in delay-100">
        <div class="glass-card p-6 border-l-4 border-l-green-500 hover:-translate-y-1 transition-transform cursor-pointer">
          <div class="flex justify-between items-start">
            <p class="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
            <div class="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
          </div>
          <h2 class="text-3xl font-black text-slate-900 dark:text-white mt-4">{{ (stats()?.totalRevenue || 0) | currency:'USD':'symbol':'1.0-0' }}</h2>
          <p class="text-sm text-green-600 dark:text-green-400 mt-2 font-bold flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
            +14.5% from last semester
          </p>
        </div>
        
        <div class="glass-card p-6 border-l-4 border-l-amber-500 hover:-translate-y-1 transition-transform cursor-pointer">
          <div class="flex justify-between items-start">
            <p class="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Dues</p>
            <div class="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          </div>
          <h2 class="text-3xl font-black text-slate-900 dark:text-white mt-4">{{ pendingDues() | currency:'USD':'symbol':'1.0-0' }}</h2>
          <p class="text-sm text-amber-600 dark:text-amber-400 mt-2 font-bold flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            -2.4% from last semester
          </p>
        </div>

        <div class="glass-card p-6 border-l-4 border-l-blue-500 hover:-translate-y-1 transition-transform cursor-pointer">
          <div class="flex justify-between items-start">
            <p class="text-sm font-bold text-slate-500 uppercase tracking-wider">Scholarships Awarded</p>
            <div class="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
          </div>
          <h2 class="text-3xl font-black text-slate-900 dark:text-white mt-4">$1.2M</h2>
          <p class="text-sm text-blue-600 dark:text-blue-400 mt-2 font-bold flex items-center gap-1">
            350 students receiving aid
          </p>
        </div>
      </div>

      <!-- Recent Invoices Table -->
      <div class="glass-panel overflow-hidden animate-fade-in delay-200 mt-8">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
          <a href="#" class="text-mit-red font-bold text-sm hover:underline">View All</a>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/50">
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700/50">
              <tr *ngFor="let i of invoices()" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">{{ i.id }}</td>
                <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ i.student }}</td>
                <td class="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm font-medium">{{ i.date }}</td>
                <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ i.amount | currency }}</td>
                <td class="px-6 py-4">
                  <span [ngClass]="{
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': i.status === 'Paid',
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400': i.status === 'Pending',
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': i.status === 'Overdue'
                  }" class="px-2.5 py-1 rounded text-xs font-bold">
                    {{ i.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class FinanceDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  
  invoices = signal<any[]>([]);
  stats = signal<any>(null);
  pendingDues = signal<number>(0);

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/systemStats').subscribe(data => {
      this.stats.set(data);
    });

    this.http.get<any[]>('http://localhost:3000/invoices').subscribe(data => {
      this.invoices.set(data);
      const pending = data.filter(i => i.status === 'Pending' || i.status === 'Overdue')
                          .reduce((sum, i) => sum + i.amount, 0);
      this.pendingDues.set(pending);
    });
  }
}
