import { Component, signal, computed, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-exam-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex">
      <!-- Sidebar -->
      <aside
        [ngClass]="{ 'w-64': isSidebarOpen(), 'w-20': !isSidebarOpen() }"
        class="fixed md:static inset-y-0 left-0 z-40 bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col shadow-2xl md:shadow-none translate-x-0"
        [class.-translate-x-full]="!isMobileSidebarOpen() && isMobile()"
      >
        <!-- Logo -->
        <div class="h-20 flex items-center justify-center border-b border-slate-800 px-4 shrink-0">
          <div
            class="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-slate-900 font-bold text-xl shadow-lg shrink-0"
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
              <path d="m14 2-4 4" />
              <path d="M14 6 10 2" />
              <path
                d="M10.41 18.41 4 22l3.59-6.41a2 2 0 0 1-2.83-2.83l9.42-9.42a2 2 0 0 1 2.82 0l1.42 1.42a2 2 0 0 1 0 2.82l-9.42 9.42a2 2 0 0 1 1.41 1.41Z"
              />
            </svg>
          </div>
          <div
            *ngIf="isSidebarOpen()"
            class="ml-3 flex flex-col animate-fade-in whitespace-nowrap overflow-hidden text-white"
          >
            <span class="font-black text-lg leading-tight">Exam Center</span>
            <span class="text-[10px] uppercase tracking-widest text-cyan-400 font-semibold"
              >Controller Office</span
            >
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          <div class="space-y-8">
            <!-- MAIN -->
            <div>
              <p
                *ngIf="isSidebarOpen()"
                class="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3"
              >
                Overview
              </p>
              <ul class="space-y-1">
                <li>
                  <a
                    routerLink="/exam/dashboard"
                    routerLinkActive="bg-cyan-500/20 text-cyan-400 font-bold"
                    class="flex items-center px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all group"
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
                      class="shrink-0 group-hover:scale-110 transition-transform"
                    >
                      <rect width="7" height="9" x="3" y="3" rx="1" />
                      <rect width="7" height="5" x="14" y="3" rx="1" />
                      <rect width="7" height="9" x="14" y="12" rx="1" />
                      <rect width="7" height="5" x="3" y="16" rx="1" />
                    </svg>
                    <span *ngIf="isSidebarOpen()" class="ml-3">Dashboard</span>
                  </a>
                </li>
              </ul>
            </div>

            <!-- EXAM CONFIG -->
            <div>
              <p
                *ngIf="isSidebarOpen()"
                class="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3"
              >
                Exam Formats
              </p>
              <ul class="space-y-1">
                <li>
                  <a
                    href="#"
                    class="flex items-center px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all group"
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
                      class="shrink-0 group-hover:scale-110 transition-transform"
                    >
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                    <span *ngIf="isSidebarOpen()" class="ml-3">Types & Formats</span>
                  </a>
                </li>
              </ul>
            </div>

            <!-- PROCESSING -->
            <div>
              <p
                *ngIf="isSidebarOpen()"
                class="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3"
              >
                Processing
              </p>
              <ul class="space-y-1">
                <li>
                  <a
                    routerLink="/exam/processing"
                    routerLinkActive="bg-cyan-500/20 text-cyan-400 font-bold"
                    class="flex items-center px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all group"
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
                      class="shrink-0 group-hover:scale-110 transition-transform"
                    >
                      <path d="M12 2v20" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    <span *ngIf="isSidebarOpen()" class="ml-3">Results & Transcripts</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Wrapper -->
      <div
        class="flex-1 flex flex-col min-w-0 transition-all duration-300"
        [class.ml-0]="!isSidebarOpen()"
      >
        <!-- Topbar -->
        <header
          class="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30"
        >
          <div class="flex items-center gap-4">
            <button
              (click)="toggleSidebar()"
              class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors hidden md:block"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
            <button
              (click)="toggleMobileSidebar()"
              class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors md:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>

          <div class="flex items-center gap-4">
            <!-- Exam Profile Dropdown -->
            <div class="relative pl-4 border-l border-slate-200 dark:border-slate-800">
              <div
                (click)="toggleDropdown($event)"
                class="flex items-center gap-3 cursor-pointer p-1 pr-4 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent"
              >
                <div class="text-right hidden sm:block">
                  <p class="text-sm font-bold text-slate-900 dark:text-white leading-none">
                    {{ user()?.name || 'Exam Controller' }}
                  </p>
                  <p class="text-xs text-slate-500 mt-1 font-medium">
                    {{ user()?.role || 'Admin' }}
                  </p>
                </div>
                <div
                  class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-cyan-500 overflow-hidden hover:ring-2 hover:ring-cyan-500/30 transition-all"
                >
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                    alt="Avatar"
                    class="w-full h-full object-cover"
                  />
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-slate-400 ml-1 hidden md:block transition-transform duration-300"
                  [class.rotate-180]="isDropdownOpen()"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              <!-- Dropdown Menu -->
              <div
                *ngIf="isDropdownOpen()"
                (click)="$event.stopPropagation()"
                class="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-slate-200/50 dark:border-slate-800/50 py-2 animate-fade-in-up z-50 backdrop-blur-xl"
              >
                <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p class="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {{ user()?.name || 'Exam Controller' }}
                  </p>
                  <p class="text-xs text-slate-500 truncate mt-0.5">
                    {{ user()?.email || 'exam@smartuni.edu' }}
                  </p>
                </div>

                <a
                  routerLink="/exam/profile"
                  class="flex items-center px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-3 opacity-70"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  My Profile
                </a>

                <div class="h-px bg-slate-100 dark:bg-slate-800 my-1.5"></div>

                <button
                  (click)="logout()"
                  class="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-3 opacity-70"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="flex-1 p-6 md:p-10 overflow-x-hidden">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Mobile Sidebar Overlay -->
      <div
        *ngIf="isMobileSidebarOpen() && isMobile()"
        (click)="toggleMobileSidebar()"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden animate-fade-in"
      ></div>
    </div>
  `,
})
export class ExamLayoutComponent {
  authService = inject(AuthService);
  user = computed(() => this.authService.currentUser());

  isSidebarOpen = signal(true);
  isMobileSidebarOpen = signal(false);
  isDropdownOpen = signal(false);
  windowWidth = signal(typeof window !== 'undefined' ? window.innerWidth : 1024);

  isMobile = computed(() => this.windowWidth() < 768);

  @HostListener('window:resize')
  onResize() {
    if (typeof window !== 'undefined') {
      this.windowWidth.set(window.innerWidth);
      if (this.isMobile()) {
        this.isSidebarOpen.set(true);
      }
    }
  }

  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen.update((v) => !v);
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen.update((v) => !v);
  }

  @HostListener('document:click')
  closeDropdown() {
    this.isDropdownOpen.set(false);
  }

  logout() {
    this.authService.logout();
  }
}
