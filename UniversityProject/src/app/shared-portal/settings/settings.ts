import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in-up max-w-4xl">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
          <p class="text-slate-500 mt-1">Manage your profile, secure file uploads, and system preferences.</p>
        </div>
        <button (click)="saveChanges()" class="px-5 py-2.5 bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 hover:-translate-y-0.5 transition-all text-sm">
          Save Changes
        </button>
      </div>

      <div class="glass-panel overflow-hidden">
        <div class="flex flex-col md:flex-row">
          
          <!-- Sidebar Tabs -->
          <div class="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 space-y-1">
            <button class="w-full text-left px-4 py-2.5 rounded-lg font-bold text-sm bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400 transition-colors">Personal Profile</button>
            <button class="w-full text-left px-4 py-2.5 rounded-lg font-bold text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">File Uploads</button>
            <button class="w-full text-left px-4 py-2.5 rounded-lg font-bold text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Security & Password</button>
            <button class="w-full text-left px-4 py-2.5 rounded-lg font-bold text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Notification Preferences</button>
          </div>

          <!-- Content Area -->
          <div class="flex-1 p-6 md:p-8 space-y-8">
            
            <!-- Avatar Section -->
            <div class="flex items-center gap-6">
              <div class="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden shrink-0">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" alt="Avatar" class="w-full h-full object-cover" />
              </div>
              <div>
                <h4 class="font-bold text-slate-900 dark:text-white text-lg">Profile Picture</h4>
                <p class="text-sm text-slate-500 mb-3">PNG, JPG up to 5MB</p>
                <div class="flex gap-2">
                  <button class="px-4 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Change</button>
                  <button class="px-4 py-1.5 text-rose-500 rounded-lg text-sm font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">Remove</button>
                </div>
              </div>
            </div>

            <!-- Form Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                <input type="text" [(ngModel)]="profileName" class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm font-bold text-slate-900 dark:text-white">
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                <input type="email" [value]="user()?.email" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm font-bold text-slate-500 cursor-not-allowed" disabled>
                <p class="text-[10px] text-slate-400 mt-1">Contact IT support to change your institutional email.</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Bio / Description</label>
                <textarea rows="4" class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm font-medium text-slate-900 dark:text-white resize-none"></textarea>
              </div>
            </div>

            <!-- Global File Upload Area Simulator -->
            <div class="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h4 class="font-bold text-slate-900 dark:text-white mb-4">Secure Document Vault (File Uploads)</h4>
              <div class="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                <div class="w-12 h-12 rounded-full bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-500 mb-3 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                </div>
                <h3 class="font-bold text-slate-900 dark:text-white text-sm">Click to upload or drag and drop</h3>
                <p class="text-slate-500 text-xs mt-1">SVG, PNG, JPG, or PDF (max. 10MB)</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export class SharedSettingsComponent implements OnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  user = computed(() => this.authService.currentUser());

  profileName = '';
  bio = '';

  ngOnInit() {
    const currentUser = this.user();
    if (currentUser) {
      this.profileName = currentUser.name;
    }
  }

  saveChanges() {
    // In a real app, this would be a PATCH request to the users endpoint
    alert('Profile updated successfully!');
  }
}
