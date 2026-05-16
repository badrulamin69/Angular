import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faculty-advising',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Student Advising</h1>
          <p class="text-slate-500 mt-1">Approve course registrations and monitor advisee performance.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Registration Approvals -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Pending Course Approvals</h3>
          <div class="glass-panel overflow-hidden">
            <div class="divide-y divide-slate-200 dark:divide-slate-800">
              
              <div class="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div class="flex justify-between items-start mb-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="Avatar" class="w-full h-full">
                    </div>
                    <div>
                      <p class="font-bold text-slate-900 dark:text-white">John Doe</p>
                      <p class="text-xs text-slate-500 font-mono">Current CGPA: 3.85</p>
                    </div>
                  </div>
                  <span class="px-2.5 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-md text-xs font-bold border border-amber-200 dark:border-amber-800/50">Needs Approval</span>
                </div>
                <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 mb-4">
                  <p class="text-xs font-bold text-slate-500 mb-2 uppercase">Requested Courses (14 Credits)</p>
                  <div class="flex flex-wrap gap-2">
                    <span class="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-xs font-bold text-slate-700 dark:text-slate-300">CS-301</span>
                    <span class="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-xs font-bold text-slate-700 dark:text-slate-300">CS-305</span>
                    <span class="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-xs font-bold text-slate-700 dark:text-slate-300">MTH-205</span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button class="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors text-sm">Approve Selection</button>
                  <button class="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-colors text-sm hover:bg-slate-50 dark:hover:bg-slate-800">Request Changes</button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Advisee Performance Tracking -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            At-Risk Advisees
          </h3>
          <div class="glass-panel p-5">
            <p class="text-sm text-slate-500 mb-4">The following students have fallen below the 2.50 CGPA threshold or have critical attendance issues.</p>
            
            <div class="space-y-3">
              <div class="p-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 rounded-xl flex items-start justify-between">
                <div>
                  <h4 class="font-bold text-slate-900 dark:text-white">Emily Davis</h4>
                  <p class="text-xs text-red-600 dark:text-red-400 font-bold mt-1">CGPA: 2.10 &bull; Attendance: 65%</p>
                </div>
                <button class="px-3 py-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-bold text-xs rounded-lg hover:bg-red-200 transition-colors">Schedule Meeting</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FacultyAdvisingComponent {}
