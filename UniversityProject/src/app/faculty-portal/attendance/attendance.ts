import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faculty-attendance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Attendance Register</h1>
          <p class="text-slate-500 mt-1">Take daily attendance and track student engagement.</p>
        </div>
        <button class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Save Register
        </button>
      </div>

      <div class="glass-panel overflow-hidden">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex gap-4 items-center">
            <select class="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-bold text-slate-900 dark:text-white">
              <option>CS-101: Algorithms</option>
              <option>CS-205: Data Structures</option>
            </select>
            <input type="date" class="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-medium text-slate-700 dark:text-slate-300" [value]="today">
          </div>
          <div class="flex gap-2">
            <button class="px-4 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-sm font-bold hover:bg-green-200 transition-colors">Mark All Present</button>
          </div>
        </div>

        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Info</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Overall %</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status (Today)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <!-- Student Row -->
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="Avatar" class="w-full h-full">
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 dark:text-white">John Doe</p>
                    <p class="text-xs text-slate-500 font-mono">STU-2026-001</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="inline-flex items-center justify-center px-2.5 py-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-md text-xs font-bold border border-green-200 dark:border-green-800/50">92%</span>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="inline-flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button class="px-4 py-1.5 rounded-md text-sm font-bold bg-green-500 text-white shadow-sm transition-all">P</button>
                  <button class="px-4 py-1.5 rounded-md text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all">A</button>
                  <button class="px-4 py-1.5 rounded-md text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all">L</button>
                </div>
              </td>
            </tr>

            <!-- Student Row -->
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emily" alt="Avatar" class="w-full h-full">
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 dark:text-white">Emily Davis</p>
                    <p class="text-xs text-slate-500 font-mono">STU-2026-004</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="inline-flex items-center justify-center px-2.5 py-1 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-md text-xs font-bold border border-red-200 dark:border-red-800/50">65%</span>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="inline-flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button class="px-4 py-1.5 rounded-md text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all">P</button>
                  <button class="px-4 py-1.5 rounded-md text-sm font-bold bg-red-500 text-white shadow-sm transition-all">A</button>
                  <button class="px-4 py-1.5 rounded-md text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all">L</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class FacultyAttendanceComponent {
  today = new Date().toISOString().split('T')[0];
}
