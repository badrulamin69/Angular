import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-finance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Financial Gateway</h1>
          <p class="text-slate-500 mt-1">Manage tuition fees, view invoices, and make secure payments.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Payment Area -->
        <div class="lg:col-span-2 space-y-6">
          <div class="glass-card p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden border-none shadow-2xl">
            <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <p class="text-slate-400 font-medium uppercase tracking-wider text-sm mb-2">Total Outstanding Balance</p>
                <h2 class="text-5xl font-black mb-1">$1,250<span class="text-2xl text-slate-400 font-bold">.00</span></h2>
                <p class="text-sm text-amber-400 font-bold flex items-center gap-1 mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Due in 15 days
                </p>
              </div>
              <button (click)="openPaymentModal()" class="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold shadow-lg hover:shadow-white/20 transition-all hover:-translate-y-1 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                Pay Now
              </button>
            </div>
          </div>

          <h3 class="text-lg font-bold text-slate-900 dark:text-white mt-8 mb-4">Invoice History</h3>
          <div class="glass-panel overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Semester</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700/50">
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">INV-2026-F01</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-300">Fall 2026</td>
                  <td class="px-6 py-4 font-mono text-slate-700 dark:text-slate-300">$1,250.00</td>
                  <td class="px-6 py-4"><span class="px-2.5 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-md text-xs font-bold">Unpaid</span></td>
                  <td class="px-6 py-4 text-right">
                    <button class="text-blue-600 dark:text-blue-400 hover:underline font-bold text-sm">Download PDF</button>
                  </td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">INV-2026-S01</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-300">Spring 2026</td>
                  <td class="px-6 py-4 font-mono text-slate-700 dark:text-slate-300">$2,400.00</td>
                  <td class="px-6 py-4"><span class="px-2.5 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md text-xs font-bold">Paid</span></td>
                  <td class="px-6 py-4 text-right">
                    <button class="text-blue-600 dark:text-blue-400 hover:underline font-bold text-sm">Download PDF</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Scholarship & Grants -->
        <div class="space-y-6">
          <div class="glass-card p-6 border-t-4 border-t-emerald-500">
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-bold text-slate-900 dark:text-white">Active Scholarship</h3>
              <span class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </span>
            </div>
            <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-1">25% Waiver</p>
            <p class="text-sm text-slate-500">Merit Based Scholarship</p>
            <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p class="text-xs text-slate-400 leading-relaxed">Must maintain a minimum CGPA of 3.50 to retain this waiver for the next semester.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Modal -->
      <div *ngIf="isModalOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closePaymentModal()"></div>
        <div class="glass-panel w-full max-w-md p-0 relative z-10 animate-fade-in-up overflow-hidden">
          <div class="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">Select Payment Gateway</h3>
            <button (click)="closePaymentModal()" class="text-slate-400 hover:text-slate-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
            </button>
          </div>
          
          <div class="p-6 space-y-4">
            <button (click)="processPayment('SSLCommerz')" class="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group">
              <span class="font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">SSLCommerz (Credit/Debit Card)</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400 group-hover:text-blue-500"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            </button>
            <button (click)="processPayment('bKash')" class="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all group">
              <span class="font-bold text-slate-700 dark:text-slate-300 group-hover:text-pink-600 dark:group-hover:text-pink-400">bKash Mobile Banking</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400 group-hover:text-pink-500"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentFinanceComponent {
  isModalOpen = signal(false);

  openPaymentModal() {
    this.isModalOpen.set(true);
  }

  closePaymentModal() {
    this.isModalOpen.set(false);
  }

  processPayment(method: string) {
    alert(`Redirecting to ${method} payment gateway simulation...`);
    this.closePaymentModal();
  }
}
