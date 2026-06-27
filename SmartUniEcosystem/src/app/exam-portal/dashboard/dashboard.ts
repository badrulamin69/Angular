import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Controller Dashboard
          </h1>
          <p class="text-slate-500 mt-1">
            University-wide examination analytics and system health.
          </p>
        </div>
      </div>

      <!-- KPI Widgets -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="glass-card p-6 border-b-4 border-b-cyan-500">
          <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Exams Live</p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">14</h3>
          <p class="text-xs font-bold text-cyan-600 mt-2">Across 8 Departments</p>
        </div>
        <div class="glass-card p-6 border-b-4 border-b-indigo-500">
          <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
            Pending Results
          </p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">452</h3>
          <p class="text-xs font-bold text-slate-400 mt-2">Awaiting processing</p>
        </div>
        <div class="glass-card p-6 border-b-4 border-b-emerald-500">
          <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
            Avg. University CGPA
          </p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">3.12</h3>
          <p class="text-xs font-bold text-emerald-600 mt-2">+0.04 from last semester</p>
        </div>
        <div class="glass-card p-6 border-b-4 border-b-amber-500">
          <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
            Appeals / Retakes
          </p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">28</h3>
          <p class="text-xs font-bold text-amber-600 mt-2">Requires manual review</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Live Exam Monitor -->
        <div class="lg:col-span-2 space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">
            Live Exam Monitor (Online)
          </h3>

          <div class="glass-panel overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr
                  class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700"
                >
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Exam Code
                  </th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th
                    class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center"
                  >
                    Active Participants
                  </th>
                  <th
                    class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center"
                  >
                    System Flags
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">CS-101 Midterm</td>
                  <td
                    class="px-6 py-4 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded inline-flex mt-3 ml-6"
                  >
                    MCQ Auto-Graded
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span
                      class="inline-flex items-center gap-1.5 font-mono text-slate-700 dark:text-slate-300 font-bold"
                    >
                      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 145 /
                      150
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span class="text-xs font-bold text-slate-400">0 Flags</span>
                  </td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">ENG-201 Final</td>
                  <td
                    class="px-6 py-4 text-xs font-bold text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-900/30 px-2 py-1 rounded inline-flex mt-3 ml-6"
                  >
                    CQ Written
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span
                      class="inline-flex items-center gap-1.5 font-mono text-slate-700 dark:text-slate-300 font-bold"
                    >
                      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 89 /
                      90
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span
                      class="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded"
                      >2 Browser Flags</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Grade Distribution Analytics -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">
            University Grade Distribution
          </h3>
          <div class="glass-panel p-6 bg-slate-900 text-white border border-slate-800">
            <div class="space-y-4">
              <!-- Bar -->
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span>A (4.0)</span>
                  <span class="text-slate-400">18%</span>
                </div>
                <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div class="bg-cyan-500 h-full rounded-full" style="width: 18%"></div>
                </div>
              </div>
              <!-- Bar -->
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span>A- (3.7)</span>
                  <span class="text-slate-400">24%</span>
                </div>
                <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div class="bg-cyan-400 h-full rounded-full" style="width: 24%"></div>
                </div>
              </div>
              <!-- Bar -->
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span>B+ (3.3)</span>
                  <span class="text-slate-400">30%</span>
                </div>
                <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div class="bg-indigo-500 h-full rounded-full" style="width: 30%"></div>
                </div>
              </div>
              <!-- Bar -->
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span>B / B- (2.7 - 3.0)</span>
                  <span class="text-slate-400">20%</span>
                </div>
                <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div class="bg-indigo-400 h-full rounded-full" style="width: 20%"></div>
                </div>
              </div>
              <!-- Bar -->
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span>Below B-</span>
                  <span class="text-slate-400">8%</span>
                </div>
                <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div class="bg-amber-500 h-full rounded-full" style="width: 8%"></div>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-800 flex justify-center">
              <button
                class="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider"
              >
                Generate Full Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ExamDashboardComponent {}
