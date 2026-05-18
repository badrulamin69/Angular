import { Component, signal, computed, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-shared-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex">
      <!-- Sidebar -->
      <aside [ngClass]="{'w-64': isSidebarOpen(), 'w-20': !isSidebarOpen()}" 
             class="fixed md:static inset-y-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col shadow-2xl md:shadow-none translate-x-0"
             [class.-translate-x-full]="!isMobileSidebarOpen() && isMobile()">
        
        <!-- Logo -->
        <div class="h-20 flex items-center justify-center border-b border-slate-200 dark:border-slate-800 px-4 shrink-0">
          <div class="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>
          </div>
          <div *ngIf="isSidebarOpen()" class="ml-3 flex flex-col animate-fade-in whitespace-nowrap overflow-hidden">
            <span class="font-black text-lg text-slate-900 dark:text-white leading-tight">Unified Hub</span>
            <span class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold">Workspace</span>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          <div class="space-y-8">
            <!-- GENERAL -->
            <div>
              <p *ngIf="isSidebarOpen()" class="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">General</p>
              <ul class="space-y-1">
                <li>
                  <a routerLink="/shared/hub" routerLinkActive="bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 font-bold" class="flex items-center px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white transition-all group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 group-hover:scale-110 transition-transform"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    <span *ngIf="isSidebarOpen()" class="ml-3">Calendar & Activity</span>
                  </a>
                </li>
              </ul>
            </div>

            <!-- COMMUNICATION -->
            <div>
              <p *ngIf="isSidebarOpen()" class="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Communication</p>
              <ul class="space-y-1">
                <li>
                  <a routerLink="/shared/communication" routerLinkActive="bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 font-bold" class="flex items-center px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white transition-all group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 group-hover:scale-110 transition-transform"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <span *ngIf="isSidebarOpen()" class="ml-3">Chat & Support</span>
                  </a>
                </li>
              </ul>
            </div>

            <!-- ACCOUNT -->
            <div>
              <p *ngIf="isSidebarOpen()" class="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Account</p>
              <ul class="space-y-1">
                <li>
                  <a routerLink="/shared/settings" routerLinkActive="bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 font-bold" class="flex items-center px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white transition-all group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 group-hover:scale-110 transition-transform"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                    <span *ngIf="isSidebarOpen()" class="ml-3">Profile & Settings</span>
                  </a>
                </li>
                <li>
                  <a href="/" class="flex items-center px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white transition-all group mt-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 group-hover:scale-110 transition-transform"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                    <span *ngIf="isSidebarOpen()" class="ml-3">Back to Main</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Wrapper -->
      <div class="flex-1 flex flex-col min-w-0 transition-all duration-300" [class.ml-0]="!isSidebarOpen()">
        
        <!-- Topbar -->
        <header class="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
          <div class="flex items-center gap-4">
            <button (click)="toggleSidebar()" class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors hidden md:block">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <button (click)="toggleMobileSidebar()" class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <div class="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-sky-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input type="text" placeholder="Global Search..." class="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 dark:text-slate-300">
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <!-- Notifications Bell -->
            <button class="relative p-2 text-slate-500 hover:text-sky-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
            </button>

            <!-- Profile Dropdown -->
            <div class="relative pl-4 border-l border-slate-200 dark:border-slate-800">
              <div (click)="toggleDropdown($event)" class="flex items-center gap-3 cursor-pointer p-1 pr-4 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent">
                <div class="text-right hidden sm:block">
                  <p class="text-sm font-bold text-slate-900 dark:text-white leading-none">{{ user()?.name || 'Active User' }}</p>
                  <p class="text-xs text-slate-500 mt-1 font-medium">{{ user()?.role || 'Authenticated' }}</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-sky-500 overflow-hidden hover:ring-2 hover:ring-sky-500/30 transition-all">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" alt="Avatar" class="w-full h-full object-cover" />
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400 ml-1 hidden md:block transition-transform duration-300" [class.rotate-180]="isDropdownOpen()"><path d="m6 9 6 6 6-6"/></svg>
              </div>

              <!-- Dropdown Menu -->
              <div *ngIf="isDropdownOpen()" (click)="$event.stopPropagation()" class="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-slate-200/50 dark:border-slate-800/50 py-2 animate-fade-in-up z-50 backdrop-blur-xl">
                <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ user()?.name || 'Active User' }}</p>
                  <p class="text-xs text-slate-500 truncate mt-0.5">{{ user()?.email || 'user@smartuni.edu' }}</p>
                </div>
                
                <a routerLink="/shared/settings" class="flex items-center px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 opacity-70"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                  Profile & Settings
                </a>
                
                <div class="h-px bg-slate-100 dark:bg-slate-800 my-1.5"></div>
                
                <button (click)="logout()" class="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 opacity-70"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
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
      <div *ngIf="isMobileSidebarOpen() && isMobile()" (click)="toggleMobileSidebar()" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden animate-fade-in"></div>
    </div>
  `
})
export class SharedLayoutComponent {
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
    this.isSidebarOpen.update(v => !v);
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen.update(v => !v);
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen.update(v => !v);
  }

  @HostListener('document:click')
  closeDropdown() {
    this.isDropdownOpen.set(false);
  }

  logout() {
    this.authService.logout();
  }
}
