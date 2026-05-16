import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lms-courses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Course Catalog & Player</h1>
          <p class="text-slate-500 mt-1">Browse your enrolled modules and stream video lectures.</p>
        </div>
      </div>

      <div *ngIf="!isPlaying()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Course Card 1 -->
        <div class="glass-panel overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all flex flex-col" (click)="openPlayer()">
          <div class="h-40 bg-gradient-to-br from-slate-800 to-slate-900 relative">
            <div class="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style="background-image: url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800')"></div>
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
              <div class="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center pl-1 shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
            </div>
          </div>
          <div class="p-5 flex-1 flex flex-col">
            <div class="flex justify-between items-start mb-2">
              <span class="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Web Development</span>
            </div>
            <h3 class="font-black text-slate-900 dark:text-white text-lg mb-2 leading-tight">Fullstack Angular & Node.js Mastery</h3>
            <p class="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">Learn to build scalable enterprise web applications from scratch using Angular 19 and Node.js microservices.</p>
            
            <div class="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div class="flex justify-between text-xs mb-1 font-bold">
                <span class="text-slate-600 dark:text-slate-400">12 / 48 Modules</span>
                <span class="text-violet-600 dark:text-violet-400">25%</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div class="bg-violet-600 h-full rounded-full" style="width: 25%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Course Card 2 -->
        <div class="glass-panel overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all flex flex-col">
          <div class="h-40 bg-gradient-to-br from-fuchsia-800 to-fuchsia-900 relative">
            <div class="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style="background-image: url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800')"></div>
          </div>
          <div class="p-5 flex-1 flex flex-col">
            <div class="flex justify-between items-start mb-2">
              <span class="text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wider">Cybersecurity</span>
            </div>
            <h3 class="font-black text-slate-900 dark:text-white text-lg mb-2 leading-tight">Ethical Hacking & Network Defense</h3>
            <p class="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">Master penetration testing and secure your infrastructure against modern cyber threats.</p>
            
            <div class="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div class="flex justify-between text-xs mb-1 font-bold">
                <span class="text-slate-600 dark:text-slate-400">Completed</span>
                <span class="text-emerald-500">100%</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full rounded-full" style="width: 100%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Video Player View -->
      <div *ngIf="isPlaying()" class="animate-fade-in">
        <button (click)="closePlayer()" class="mb-4 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Courses
        </button>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-4">
            <!-- Simulated Video Player -->
            <div class="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden relative shadow-2xl flex items-center justify-center">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none"></div>
              
              <!-- Video Placeholder Info -->
              <div class="z-0 text-slate-500 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mb-4 opacity-50"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M12 12h.01"/></svg>
                <p>Simulated Video Stream: 1080p</p>
              </div>

              <!-- Video Controls UI -->
              <div class="absolute bottom-0 inset-x-0 p-4 z-20 flex flex-col gap-2">
                <!-- Seek Bar -->
                <div class="w-full h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer">
                  <div class="bg-violet-500 h-full w-1/3"></div>
                </div>
                <!-- Controls -->
                <div class="flex justify-between items-center text-white mt-1">
                  <div class="flex items-center gap-4">
                    <button class="hover:text-violet-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </button>
                    <button class="hover:text-violet-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                    </button>
                    <span class="text-xs font-mono font-bold">12:34 / 45:20</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <button class="text-xs font-bold hover:text-violet-400 transition-colors border border-white/40 px-2 py-0.5 rounded">1x</button>
                    <button class="hover:text-violet-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-4">Module 4: Building Responsive Layouts</h2>
            <p class="text-slate-500 leading-relaxed">In this module, we explore modern CSS techniques including Flexbox, CSS Grid, and Tailwind CSS to build fluid interfaces that adapt perfectly to any device screen size.</p>
          </div>

          <!-- Course Modules Sidebar -->
          <div class="glass-panel overflow-hidden flex flex-col h-[500px]">
            <div class="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <h3 class="font-bold text-slate-900 dark:text-white">Course Modules</h3>
              <p class="text-xs text-slate-500 mt-1">12 / 48 Completed</p>
            </div>
            <div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              <!-- Module Items -->
              <button class="w-full text-left p-3 rounded-lg flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500 mt-0.5 shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <div>
                  <p class="text-sm font-bold line-clamp-1">Module 1: Introduction</p>
                  <p class="text-[10px] font-bold uppercase mt-0.5">15:20</p>
                </div>
              </button>
              
              <button class="w-full text-left p-3 rounded-lg flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500 mt-0.5 shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <div>
                  <p class="text-sm font-bold line-clamp-1">Module 2: Setting up Angular</p>
                  <p class="text-[10px] font-bold uppercase mt-0.5">25:40</p>
                </div>
              </button>

              <button class="w-full text-left p-3 rounded-lg flex items-start gap-3 bg-violet-50 dark:bg-violet-900/20 text-violet-900 dark:text-violet-100 border border-violet-200 dark:border-violet-800/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-500 mt-0.5 shrink-0"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <div>
                  <p class="text-sm font-bold line-clamp-1 text-violet-700 dark:text-violet-300">Module 4: Building Responsive Layouts</p>
                  <p class="text-[10px] font-bold uppercase text-violet-500 mt-0.5">Playing</p>
                </div>
              </button>

              <button class="w-full text-left p-3 rounded-lg flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 12h6"/></svg>
                <div>
                  <p class="text-sm font-bold line-clamp-1 text-slate-700 dark:text-slate-300">Module 5: State Management</p>
                  <p class="text-[10px] font-bold uppercase mt-0.5">35:10</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LmsCoursesComponent {
  isPlaying = signal(false);

  openPlayer() {
    this.isPlaying.set(true);
  }

  closePlayer() {
    this.isPlaying.set(false);
  }
}
