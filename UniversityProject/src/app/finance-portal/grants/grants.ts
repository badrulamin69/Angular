import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finance-grants',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Waivers & Grants</h1>
          <p class="text-slate-500 mt-1">Manage merit-based scholarships, financial aid, and sibling waivers.</p>
        </div>
        <button class="px-5 py-2.5 bg-emerald-500 text-white rounded-xl shadow-lg hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Add New Waiver
        </button>
      </div>

      <div class="glass-panel overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Waiver Type</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Discount (%)</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td class="px-6 py-4">
                <p class="font-bold text-slate-900 dark:text-white">John Doe</p>
                <p class="text-xs text-slate-500 mt-0.5">STU-123 &bull; CS Dept.</p>
              </td>
              <td class="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">Merit Scholarship (CGPA > 3.8)</td>
              <td class="px-6 py-4 text-center">
                <span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md text-sm font-black">50%</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs font-bold text-emerald-500">Active</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Edit</button>
              </td>
            </tr>
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td class="px-6 py-4">
                <p class="font-bold text-slate-900 dark:text-white">Sarah Jenkins</p>
                <p class="text-xs text-slate-500 mt-0.5">STU-144 &bull; BBA Dept.</p>
              </td>
              <td class="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">Sibling Waiver</td>
              <td class="px-6 py-4 text-center">
                <span class="px-2.5 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-md text-sm font-black">20%</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs font-bold text-emerald-500">Active</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class FinanceGrantsComponent {}
