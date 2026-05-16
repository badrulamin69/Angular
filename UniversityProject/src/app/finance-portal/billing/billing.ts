import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finance-billing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Billing & Invoices</h1>
          <p class="text-slate-500 mt-1">Manage per-credit billing, generate bulk invoices, and track payments.</p>
        </div>
        <button class="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/></svg>
          Generate Batch Invoices
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Controls -->
        <div class="space-y-4">
          <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider">Per Credit Rate System</h3>
          <div class="glass-panel p-5 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Undergraduate Rate ($)</label>
              <input type="number" value="150.00" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-bold text-slate-900 dark:text-white">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Postgraduate Rate ($)</label>
              <input type="number" value="250.00" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-bold text-slate-900 dark:text-white">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Lab/Facility Fee ($)</label>
              <input type="number" value="200.00" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-bold text-slate-900 dark:text-white">
            </div>
            <button class="w-full py-2 bg-emerald-500 text-white font-bold rounded-lg shadow-sm hover:bg-emerald-600 transition-colors text-sm">Update Global Rates</button>
          </div>
        </div>

        <!-- Invoices List -->
        <div class="lg:col-span-3 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Active Student Invoices</h3>
            <div class="flex gap-2">
              <span class="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-bold cursor-pointer">All</span>
              <span class="px-3 py-1 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded text-xs font-bold cursor-pointer">Unpaid</span>
              <span class="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded text-xs font-bold cursor-pointer">Paid</span>
            </div>
          </div>
          
          <div class="glass-panel overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice / Student</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Credits</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Amount</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="px-6 py-4">
                    <p class="font-bold text-slate-900 dark:text-white">INV-FA26-001</p>
                    <p class="text-xs text-slate-500 mt-0.5">John Doe (STU-123)</p>
                  </td>
                  <td class="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">14 Credits</td>
                  <td class="px-6 py-4 font-mono font-black text-slate-900 dark:text-white">$2,300.00</td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md text-xs font-bold">Paid via bKash</span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button class="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">View Receipt</button>
                  </td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="px-6 py-4">
                    <p class="font-bold text-slate-900 dark:text-white">INV-FA26-002</p>
                    <p class="text-xs text-slate-500 mt-0.5">Emily Davis (STU-124)</p>
                  </td>
                  <td class="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">18 Credits</td>
                  <td class="px-6 py-4 font-mono font-black text-slate-900 dark:text-white">$2,900.00</td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-md text-xs font-bold">Unpaid (Overdue)</span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Send Reminder</button>
                  </td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="px-6 py-4">
                    <p class="font-bold text-slate-900 dark:text-white">INV-FA26-003</p>
                    <p class="text-xs text-slate-500 mt-0.5">Michael Smith (STU-125)</p>
                  </td>
                  <td class="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">12 Credits</td>
                  <td class="px-6 py-4 font-mono font-black text-slate-900 dark:text-white">$2,000.00</td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-md text-xs font-bold">Partial (Installment)</span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Log Payment</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FinanceBillingComponent {}
