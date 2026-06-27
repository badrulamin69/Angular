import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-hub',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Calendar & Activity
          </h1>
          <p class="text-slate-500 mt-1">
            Your unified schedule, universal notifications, and recent system logs.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Global Calendar Widget -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Upcoming Events</h3>
            <div class="flex gap-2">
              <button
                class="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <span class="font-bold text-sm text-slate-700 dark:text-slate-300">October 2026</span>
              <button
                class="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          <div class="glass-panel p-6">
            <div class="space-y-4">
              <div class="flex gap-4 group">
                <div
                  class="w-16 flex flex-col items-center justify-center shrink-0 border-r border-slate-200 dark:border-slate-800 pr-4 text-center"
                >
                  <span class="text-xs font-bold text-sky-500 uppercase">Oct</span>
                  <span class="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1"
                    >12</span
                  >
                </div>
                <div
                  class="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 group-hover:bg-sky-50 dark:group-hover:bg-sky-900/20 border border-transparent group-hover:border-sky-100 dark:group-hover:border-sky-800/50 transition-colors"
                >
                  <h4
                    class="font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors"
                  >
                    Midterm Registration Opens
                  </h4>
                  <p class="text-xs text-slate-500 mt-1">
                    University-wide event. All departments involved.
                  </p>
                  <p class="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    08:00 AM - 11:59 PM
                  </p>
                </div>
              </div>

              <div class="flex gap-4 group">
                <div
                  class="w-16 flex flex-col items-center justify-center shrink-0 border-r border-slate-200 dark:border-slate-800 pr-4 text-center opacity-50"
                >
                  <span class="text-xs font-bold text-amber-500 uppercase">Oct</span>
                  <span class="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1"
                    >15</span
                  >
                </div>
                <div
                  class="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 border border-transparent group-hover:border-amber-100 dark:group-hover:border-amber-800/50 transition-colors"
                >
                  <h4
                    class="font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors"
                  >
                    Financial Aid Deadline
                  </h4>
                  <p class="text-xs text-slate-500 mt-1">
                    Submit all waivers to the Treasury office.
                  </p>
                  <p class="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Due by 05:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Logs & Notifications -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
          <div class="glass-panel overflow-hidden">
            <div class="divide-y divide-slate-100 dark:divide-slate-800">
              <div
                class="p-4 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div
                  class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-900 dark:text-white">
                    Profile Updated successfully
                  </p>
                  <p class="text-xs text-slate-500 mt-0.5">
                    You changed your primary email address.
                  </p>
                  <p class="text-[10px] text-slate-400 font-bold mt-1">2 hours ago</p>
                </div>
              </div>

              <div
                class="p-4 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div
                  class="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 mt-0.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-900 dark:text-white">File Uploaded</p>
                  <p class="text-xs text-slate-500 mt-0.5">
                    'National_ID_Scan.pdf' was saved to secure storage.
                  </p>
                  <p class="text-[10px] text-slate-400 font-bold mt-1">Yesterday at 14:30</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SharedHubComponent {}
