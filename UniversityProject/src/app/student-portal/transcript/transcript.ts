import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-transcript',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Academic Transcript</h1>
          <p class="text-slate-500 mt-1">View your official semester results and academic history.</p>
        </div>
        <button class="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-lg hover:scale-105 transition-transform font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Download PDF
        </button>
      </div>

      <!-- Overview Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="glass-panel p-4 text-center">
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cumulative GPA</p>
          <p class="text-2xl font-black text-slate-900 dark:text-white">3.85</p>
        </div>
        <div class="glass-panel p-4 text-center">
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Credits</p>
          <p class="text-2xl font-black text-slate-900 dark:text-white">85</p>
        </div>
        <div class="glass-panel p-4 text-center">
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Major Standing</p>
          <p class="text-2xl font-black text-slate-900 dark:text-white">Junior</p>
        </div>
        <div class="glass-panel p-4 text-center">
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Academic Status</p>
          <p class="text-2xl font-black text-green-600">Excellent</p>
        </div>
      </div>

      <!-- Semester History -->
      <div class="space-y-6">
        <!-- Spring 2026 -->
        <div class="glass-panel overflow-hidden">
          <div class="bg-slate-100 dark:bg-slate-800/80 px-6 py-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
            <h3 class="font-bold text-slate-900 dark:text-white text-lg">Spring 2026</h3>
            <div class="flex gap-4">
              <span class="text-sm font-medium text-slate-500">Credits Earned: <span class="font-bold text-slate-900 dark:text-white">14</span></span>
              <span class="text-sm font-medium text-slate-500">Term GPA: <span class="font-bold text-slate-900 dark:text-white">3.90</span></span>
            </div>
          </div>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-700">
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Course Code</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Credits</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Grade</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td class="px-6 py-3 font-bold text-slate-700 dark:text-slate-300">CS-201</td>
                <td class="px-6 py-3 text-slate-600 dark:text-slate-400">Object Oriented Programming</td>
                <td class="px-6 py-3 text-center text-slate-600 dark:text-slate-400">4</td>
                <td class="px-6 py-3 text-center font-bold text-green-600">A</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td class="px-6 py-3 font-bold text-slate-700 dark:text-slate-300">MTH-102</td>
                <td class="px-6 py-3 text-slate-600 dark:text-slate-400">Calculus II</td>
                <td class="px-6 py-3 text-center text-slate-600 dark:text-slate-400">4</td>
                <td class="px-6 py-3 text-center font-bold text-blue-600">A-</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td class="px-6 py-3 font-bold text-slate-700 dark:text-slate-300">PHY-101</td>
                <td class="px-6 py-3 text-slate-600 dark:text-slate-400">Physics for Engineers</td>
                <td class="px-6 py-3 text-center text-slate-600 dark:text-slate-400">3</td>
                <td class="px-6 py-3 text-center font-bold text-green-600">A</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td class="px-6 py-3 font-bold text-slate-700 dark:text-slate-300">ENG-101</td>
                <td class="px-6 py-3 text-slate-600 dark:text-slate-400">English Composition</td>
                <td class="px-6 py-3 text-center text-slate-600 dark:text-slate-400">3</td>
                <td class="px-6 py-3 text-center font-bold text-blue-600">A-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class StudentTranscriptComponent {}
