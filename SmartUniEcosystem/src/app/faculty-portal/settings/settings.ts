import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { FacultySettingsService, FacultySettings, Session } from '../../core/services/faculty-settings.service';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-faculty-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="space-y-6 animate-fade-in-up max-w-5xl mx-auto pb-16">
      
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p class="text-slate-500 mt-1">Manage your professional profile, account security, notification alerts, and theme preferences.</p>
        </div>
      </div>

      <!-- SKELETON LOADING -->
      <div *ngIf="loading()" class="space-y-6">
        <div class="glass-panel p-8 animate-pulse space-y-4">
          <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
          <div class="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div class="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div class="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>

      <!-- ERROR MESSAGE -->
      <div *ngIf="error()" class="p-6 bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/30 rounded-2xl flex items-center gap-4 text-rose-700 dark:text-rose-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        <div>
          <h4 class="font-bold">Error loading settings</h4>
          <p class="text-sm mt-0.5">{{ error() }}</p>
          <button (click)="loadData()" class="mt-2 text-xs font-bold underline hover:text-rose-800">Retry loading</button>
        </div>
      </div>

      <!-- MAIN CONFIGURATION CONTENT -->
      <div *ngIf="!loading() && !error()" class="glass-panel overflow-hidden flex flex-col md:flex-row">
        
        <!-- Navigation Menu -->
        <div class="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 space-y-1 shrink-0">
          <button (click)="activeTab.set('profile')" 
                  [class.bg-indigo-50]="activeTab() === 'profile'" 
                  [class.text-indigo-600]="activeTab() === 'profile'" 
                  [class.dark:bg-indigo-500/10]="activeTab() === 'profile'" 
                  [class.dark:text-indigo-400]="activeTab() === 'profile'" 
                  class="w-full text-left px-4 py-3 rounded-xl font-bold text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Account Profile
          </button>
          
          <button (click)="activeTab.set('security')" 
                  [class.bg-indigo-50]="activeTab() === 'security'" 
                  [class.text-indigo-600]="activeTab() === 'security'" 
                  [class.dark:bg-indigo-500/10]="activeTab() === 'security'" 
                  [class.dark:text-indigo-400]="activeTab() === 'security'" 
                  class="w-full text-left px-4 py-3 rounded-xl font-bold text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Security & Security
          </button>

          <button (click)="activeTab.set('preferences')" 
                  [class.bg-indigo-50]="activeTab() === 'preferences'" 
                  [class.text-indigo-600]="activeTab() === 'preferences'" 
                  [class.dark:bg-indigo-500/10]="activeTab() === 'preferences'" 
                  [class.dark:text-indigo-400]="activeTab() === 'preferences'" 
                  class="w-full text-left px-4 py-3 rounded-xl font-bold text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            Preferences & Theme
          </button>

          <button (click)="activeTab.set('sessions')" 
                  [class.bg-indigo-50]="activeTab() === 'sessions'" 
                  [class.text-indigo-600]="activeTab() === 'sessions'" 
                  [class.dark:bg-indigo-500/10]="activeTab() === 'sessions'" 
                  [class.dark:text-indigo-400]="activeTab() === 'sessions'" 
                  class="w-full text-left px-4 py-3 rounded-xl font-bold text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
            Active Sessions
          </button>
        </div>

        <!-- Right Content Panels -->
        <div class="flex-1 p-6 md:p-8">

          <!-- 1. ACCOUNT TAB -->
          <div *ngIf="activeTab() === 'profile'" class="space-y-6">
            <div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">Account Information</h3>
              <p class="text-slate-500 text-sm">Update your official faculty profile information.</p>
            </div>

            <!-- Profile Photo Section -->
            <div class="flex items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div class="relative w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-850 flex items-center justify-center">
                <img *ngIf="avatarSrc" [src]="avatarSrc" alt="Avatar" class="w-full h-full object-cover" />
                <span *ngIf="!avatarSrc" class="text-2xl font-bold text-slate-400 uppercase">{{ profileForm.get('name')?.value?.charAt(0) || 'F' }}</span>
              </div>
              <div class="space-y-2">
                <h4 class="font-bold text-slate-900 dark:text-white text-base">Profile Photo</h4>
                <p class="text-xs text-slate-500">JPG or PNG. Max size 5MB.</p>
                <div class="flex gap-2">
                  <input #fileInput type="file" accept="image/*" class="hidden" (change)="onAvatarSelected($event)">
                  <button (click)="fileInput.click()" class="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors">
                    Upload Photo
                  </button>
                  <button *ngIf="avatarSrc" (click)="removeAvatar()" class="px-4 py-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-xs font-bold transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <!-- Profile Details Reactive Form -->
            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Full Name <span class="text-rose-500">*</span></label>
                  <input type="text" formControlName="name" class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm font-bold text-slate-900 dark:text-white">
                  <p *ngIf="profileForm.get('name')?.invalid && profileForm.get('name')?.touched" class="text-xs text-rose-500 mt-1">Full name is required.</p>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Email Address</label>
                  <input type="email" [value]="user()?.email" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-semibold text-slate-400 cursor-not-allowed" disabled>
                  <span class="text-[10px] text-slate-400 mt-1 block">Institutional email cannot be changed.</span>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Phone Number</label>
                  <input type="text" formControlName="phone" placeholder="+880 1XXX XXXXXX" class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm font-semibold text-slate-900 dark:text-white">
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Designation <span class="text-rose-500">*</span></label>
                  <input type="text" formControlName="designation" class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm font-semibold text-slate-900 dark:text-white">
                  <p *ngIf="profileForm.get('designation')?.invalid && profileForm.get('designation')?.touched" class="text-xs text-rose-500 mt-1">Designation is required.</p>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Employee ID</label>
                  <input type="text" formControlName="employeeId" class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm font-semibold text-slate-900 dark:text-white">
                </div>

              </div>

              <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" (click)="resetProfileForm()" class="px-5 py-2 text-sm font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all">
                  Discard Changes
                </button>
                <button type="submit" [disabled]="profileForm.invalid || savingProfileState()" class="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2">
                  <svg *ngIf="savingProfileState()" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  Save Profile
                </button>
              </div>
            </form>
          </div>

          <!-- 2. SECURITY TAB -->
          <div *ngIf="activeTab() === 'security'" class="space-y-6">
            <div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">Change Password</h3>
              <p class="text-slate-500 text-sm">Update your account credentials to keep your account secure.</p>
            </div>

            <form [formGroup]="passwordForm" (ngSubmit)="savePassword()" class="space-y-5 max-w-md">
              
              <!-- Current Password -->
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Current Password</label>
                <div class="relative">
                  <input [type]="showCurrentPassword() ? 'text' : 'password'" formControlName="currentPassword" class="w-full pl-4 pr-12 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm" placeholder="••••••••">
                  <button type="button" (click)="showCurrentPassword.set(!showCurrentPassword())" class="absolute right-4 top-3.5 text-slate-400 hover:text-slate-655 focus:outline-none">
                    <svg *ngIf="!showCurrentPassword()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg *ngIf="showCurrentPassword()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                  </button>
                </div>
                <p *ngIf="passwordForm.get('currentPassword')?.invalid && passwordForm.get('currentPassword')?.touched" class="text-xs text-rose-500 mt-1">Current password is required.</p>
              </div>

              <!-- New Password -->
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">New Password</label>
                <div class="relative">
                  <input [type]="showNewPassword() ? 'text' : 'password'" formControlName="newPassword" class="w-full pl-4 pr-12 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm" placeholder="••••••••">
                  <button type="button" (click)="showNewPassword.set(!showNewPassword())" class="absolute right-4 top-3.5 text-slate-400 hover:text-slate-655 focus:outline-none">
                    <svg *ngIf="!showNewPassword()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg *ngIf="showNewPassword()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                  </button>
                </div>
                <!-- Password validation checklist -->
                <div class="mt-2 text-xs space-y-1">
                  <div class="flex items-center gap-1.5" [class.text-emerald-500]="newPassValidLength()" [class.text-slate-400]="!newPassValidLength()">
                    <span class="w-1.5 h-1.5 rounded-full" [class.bg-emerald-500]="newPassValidLength()" [class.bg-slate-400]="!newPassValidLength()"></span>
                    At least 8 characters long
                  </div>
                </div>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Confirm New Password</label>
                <div class="relative">
                  <input [type]="showConfirmPassword() ? 'text' : 'password'" formControlName="confirmPassword" class="w-full pl-4 pr-12 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm" placeholder="••••••••">
                  <button type="button" (click)="showConfirmPassword.set(!showConfirmPassword())" class="absolute right-4 top-3.5 text-slate-400 hover:text-slate-655 focus:outline-none">
                    <svg *ngIf="!showConfirmPassword()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg *ngIf="showConfirmPassword()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                  </button>
                </div>
                <p *ngIf="passwordForm.hasError('mismatch') && passwordForm.get('confirmPassword')?.touched" class="text-xs text-rose-500 mt-1">Passwords do not match.</p>
              </div>

              <div class="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" (click)="resetPasswordForm()" class="px-5 py-2 text-sm font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all">
                  Clear
                </button>
                <button type="submit" [disabled]="passwordForm.invalid || savingPasswordState()" class="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2">
                  <svg *ngIf="savingPasswordState()" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  Update Password
                </button>
              </div>
            </form>
          </div>

          <!-- 3. PREFERENCES TAB -->
          <div *ngIf="activeTab() === 'preferences'" class="space-y-8">
            <form [formGroup]="preferencesForm" (ngSubmit)="savePreferences()" class="space-y-8">
              
              <!-- A. Appearance Preferences -->
              <div class="space-y-4">
                <div>
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white">Appearance Settings</h3>
                  <p class="text-slate-500 text-xs mt-0.5">Customize your desktop portal theme and layout behavior.</p>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <!-- Light Theme Card -->
                  <label class="relative border-2 rounded-2xl p-4 flex flex-col items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 select-none"
                         [class.border-indigo-600]="preferencesForm.get('theme')?.value === 'light'"
                         [class.border-slate-200]="preferencesForm.get('theme')?.value !== 'light'"
                         [class.dark:border-slate-800]="preferencesForm.get('theme')?.value !== 'light'">
                    <input type="radio" value="light" formControlName="theme" class="hidden">
                    <span class="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-700 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg>
                    </span>
                    <span class="font-bold text-sm text-slate-900 dark:text-white mt-1">Light Mode</span>
                  </label>

                  <!-- Dark Theme Card -->
                  <label class="relative border-2 rounded-2xl p-4 flex flex-col items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 select-none"
                         [class.border-indigo-600]="preferencesForm.get('theme')?.value === 'dark'"
                         [class.border-slate-200]="preferencesForm.get('theme')?.value !== 'dark'"
                         [class.dark:border-slate-800]="preferencesForm.get('theme')?.value !== 'dark'">
                    <input type="radio" value="dark" formControlName="theme" class="hidden">
                    <span class="w-8 h-8 rounded-full bg-slate-900 border border-slate-750 flex items-center justify-center text-indigo-400 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                    </span>
                    <span class="font-bold text-sm text-slate-900 dark:text-white mt-1">Dark Mode</span>
                  </label>

                  <!-- System Default Card -->
                  <label class="relative border-2 rounded-2xl p-4 flex flex-col items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 select-none"
                         [class.border-indigo-600]="preferencesForm.get('theme')?.value === 'system'"
                         [class.border-slate-200]="preferencesForm.get('theme')?.value !== 'system'"
                         [class.dark:border-slate-800]="preferencesForm.get('theme')?.value !== 'system'">
                    <input type="radio" value="system" formControlName="theme" class="hidden">
                    <span class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
                    </span>
                    <span class="font-bold text-sm text-slate-900 dark:text-white mt-1">System Default</span>
                  </label>
                </div>

                <!-- Sidebar Toggles -->
                <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span class="font-bold text-sm text-slate-800 dark:text-slate-250">Collapse Sidebar by Default</span>
                    <p class="text-xs text-slate-500 mt-0.5">Keep the sidebar compressed automatically to expand your workspace area.</p>
                  </div>
                  <button type="button" (click)="togglePrefControl('sidebarCollapsed')" class="relative shrink-0 ml-4 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
                          [class.bg-indigo-600]="preferencesForm.get('sidebarCollapsed')?.value" [class.bg-slate-250]="!preferencesForm.get('sidebarCollapsed')?.value" [class.dark:bg-slate-700]="!preferencesForm.get('sidebarCollapsed')?.value">
                    <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                          [class.translate-x-5]="preferencesForm.get('sidebarCollapsed')?.value" [class.translate-x-0]="!preferencesForm.get('sidebarCollapsed')?.value"></span>
                  </button>
                </div>
              </div>

              <!-- B. Notification Toggles -->
              <div class="space-y-4">
                <div>
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white">Notification Preferences</h3>
                  <p class="text-slate-500 text-xs mt-0.5">Control which updates and alerts you wish to receive from the ecosystem.</p>
                </div>

                <div class="space-y-3">
                  <!-- Toggle 1: Email Notifications -->
                  <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span class="font-bold text-sm text-slate-800 dark:text-slate-250">Email Notifications</span>
                      <p class="text-xs text-slate-500 mt-0.5">Receive daily summaries, announcements, and university bulletins.</p>
                    </div>
                    <button type="button" (click)="togglePrefControl('emailNotifications')" class="relative shrink-0 ml-4 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
                            [class.bg-indigo-600]="preferencesForm.get('emailNotifications')?.value" [class.bg-slate-250]="!preferencesForm.get('emailNotifications')?.value" [class.dark:bg-slate-700]="!preferencesForm.get('emailNotifications')?.value">
                      <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                            [class.translate-x-5]="preferencesForm.get('emailNotifications')?.value" [class.translate-x-0]="!preferencesForm.get('emailNotifications')?.value"></span>
                    </button>
                  </div>

                  <!-- Toggle 2: Assignment Notifications -->
                  <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span class="font-bold text-sm text-slate-800 dark:text-slate-250">Assignment Submissions Alert</span>
                      <p class="text-xs text-slate-500 mt-0.5">Get notified instantly when students submit course assignments.</p>
                    </div>
                    <button type="button" (click)="togglePrefControl('assignmentNotifications')" class="relative shrink-0 ml-4 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
                            [class.bg-indigo-600]="preferencesForm.get('assignmentNotifications')?.value" [class.bg-slate-250]="!preferencesForm.get('assignmentNotifications')?.value" [class.dark:bg-slate-700]="!preferencesForm.get('assignmentNotifications')?.value">
                      <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                            [class.translate-x-5]="preferencesForm.get('assignmentNotifications')?.value" [class.translate-x-0]="!preferencesForm.get('assignmentNotifications')?.value"></span>
                    </button>
                  </div>

                  <!-- Toggle 3: Exam Notifications -->
                  <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span class="font-bold text-sm text-slate-800 dark:text-slate-250">Exam Schedules & Reminders</span>
                      <p class="text-xs text-slate-500 mt-0.5">Receive alerts when exam papers are published or grades are finalized.</p>
                    </div>
                    <button type="button" (click)="togglePrefControl('examNotifications')" class="relative shrink-0 ml-4 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
                            [class.bg-indigo-600]="preferencesForm.get('examNotifications')?.value" [class.bg-slate-250]="!preferencesForm.get('examNotifications')?.value" [class.dark:bg-slate-700]="!preferencesForm.get('examNotifications')?.value">
                      <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                            [class.translate-x-5]="preferencesForm.get('examNotifications')?.value" [class.translate-x-0]="!preferencesForm.get('examNotifications')?.value"></span>
                    </button>
                  </div>

                  <!-- Toggle 4: messageNotifications -->
                  <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span class="font-bold text-sm text-slate-800 dark:text-slate-250">Student Message Alerts</span>
                      <p class="text-xs text-slate-500 mt-0.5">Receive direct email notifications when a student sends you a query.</p>
                    </div>
                    <button type="button" (click)="togglePrefControl('messageNotifications')" class="relative shrink-0 ml-4 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
                            [class.bg-indigo-600]="preferencesForm.get('messageNotifications')?.value" [class.bg-slate-250]="!preferencesForm.get('messageNotifications')?.value" [class.dark:bg-slate-700]="!preferencesForm.get('messageNotifications')?.value">
                      <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                            [class.translate-x-5]="preferencesForm.get('messageNotifications')?.value" [class.translate-x-0]="!preferencesForm.get('messageNotifications')?.value"></span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- C. Privacy Preferences -->
              <div class="space-y-4">
                <div>
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white">Privacy Preferences</h3>
                  <p class="text-slate-500 text-xs mt-0.5">Control the visibility of your profile information to students and public search.</p>
                </div>

                <div class="space-y-3">
                  <!-- Profile Visibility -->
                  <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span class="font-bold text-sm text-slate-800 dark:text-slate-250">Public Profile Visibility</span>
                      <p class="text-xs text-slate-500 mt-0.5">Show your profile in the public student advisory directories.</p>
                    </div>
                    <button type="button" (click)="togglePrefControl('profileVisibility')" class="relative shrink-0 ml-4 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
                            [class.bg-indigo-600]="preferencesForm.get('profileVisibility')?.value" [class.bg-slate-250]="!preferencesForm.get('profileVisibility')?.value" [class.dark:bg-slate-700]="!preferencesForm.get('profileVisibility')?.value">
                      <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                            [class.translate-x-5]="preferencesForm.get('profileVisibility')?.value" [class.translate-x-0]="!preferencesForm.get('profileVisibility')?.value"></span>
                    </button>
                  </div>

                  <!-- Contact Information Visibility -->
                  <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span class="font-bold text-sm text-slate-800 dark:text-slate-250">Display Contact Information</span>
                      <p class="text-xs text-slate-500 mt-0.5">Expose your phone number to enrolled students for academic advising.</p>
                    </div>
                    <button type="button" (click)="togglePrefControl('phoneVisibility')" class="relative shrink-0 ml-4 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
                            [class.bg-indigo-600]="preferencesForm.get('phoneVisibility')?.value" [class.bg-slate-250]="!preferencesForm.get('phoneVisibility')?.value" [class.dark:bg-slate-700]="!preferencesForm.get('phoneVisibility')?.value">
                      <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                            [class.translate-x-5]="preferencesForm.get('phoneVisibility')?.value" [class.translate-x-0]="!preferencesForm.get('phoneVisibility')?.value"></span>
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" (click)="resetPreferencesForm()" class="px-5 py-2 text-sm font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all">
                  Discard Changes
                </button>
                <button type="submit" [disabled]="preferencesForm.invalid || savingPreferencesState()" class="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2">
                  <svg *ngIf="savingPreferencesState()" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  Save Preferences
                </button>
              </div>
            </form>
          </div>

          <!-- 4. ACTIVE SESSIONS TAB -->
          <div *ngIf="activeTab() === 'sessions'" class="space-y-6 animate-fade-in">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white">Active Sessions</h3>
                <p class="text-slate-500 text-sm">Review devices that are currently authenticated to access your account.</p>
              </div>
              <button *ngIf="otherSessions().length > 0" (click)="confirmLogoutOtherDevices()" class="px-4 py-2 text-xs font-bold bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-450 dark:hover:bg-rose-900/20 rounded-xl transition-colors shrink-0">
                Log Out from Other Devices
              </button>
            </div>

            <!-- Session List -->
            <div class="space-y-4">
              <div *ngFor="let sess of sessions()" class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
                <div class="flex gap-4">
                  <div class="w-10 h-10 rounded-xl bg-slate-200/60 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-350 shrink-0">
                    <svg *ngIf="sess.device.toLowerCase().includes('iphone') || sess.device.toLowerCase().includes('mobile')" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                    <svg *ngIf="!sess.device.toLowerCase().includes('iphone') && !sess.device.toLowerCase().includes('mobile')" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-bold text-sm text-slate-800 dark:text-slate-200">{{ sess.device }}</span>
                      <span *ngIf="sess.current" class="px-2 py-0.5 text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-400 rounded-md">Current Session</span>
                    </div>
                    <p class="text-xs text-slate-500 mt-1">IP: {{ sess.ipAddress }} &bull; Location: {{ sess.location }}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">Last active: {{ sess.lastActive }}</p>
                  </div>
                </div>

                <!-- Terminate Session Option -->
                <button *ngIf="!sess.current" (click)="confirmLogoutDevice(sess)" class="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0" title="Revoke Session">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                </button>
              </div>
            </div>

            <!-- Last Login details -->
            <div class="p-4 bg-slate-100/50 dark:bg-slate-850/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 text-xs flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span><strong>Last Login:</strong> {{ lastLoginTime() }} &bull; Check active logs regularly to monitor security.</span>
            </div>

          </div>

        </div>

      </div>

    </div>

    <!-- PRETTY CUSTOM CONFIRMATION MODAL -->
    <div *ngIf="showConfirmModal()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div class="glass border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-fade-in-up space-y-4">
        <div class="flex items-center gap-3 text-amber-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
          <h3 class="text-lg font-black text-slate-900 dark:text-white">{{ confirmTitle() }}</h3>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ confirmBody() }}</p>
        <div class="flex justify-end gap-3 pt-2">
          <button (click)="closeConfirmModal(false)" class="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl text-sm font-bold transition-all">
            Cancel
          </button>
          <button (click)="closeConfirmModal(true)" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all">
            Confirm
          </button>
        </div>
      </div>
    </div>

    <!-- FLOATING TOAST NOTIFICATION -->
    <div *ngIf="toastMessage()" 
         [ngClass]="{
           'bg-emerald-500 text-white border-emerald-600': toastType() === 'success',
           'bg-rose-500 text-white border-rose-600': toastType() === 'error',
           'bg-indigo-500 text-white border-indigo-600': toastType() === 'info'
         }" 
         class="fixed bottom-6 right-6 z-50 max-w-sm px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 animate-fade-in-up">
      <svg *ngIf="toastType() === 'success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      <svg *ngIf="toastType() === 'error'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
      <svg *ngIf="toastType() === 'info'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="16"/><line x1="12" x2="12" y1="12" y2="12"/></svg>
      <span class="text-sm font-bold">{{ toastMessage() }}</span>
    </div>
  `
})
export class FacultySettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private settingsService = inject(FacultySettingsService);
  private router = inject(Router);

  user = computed(() => this.authService.currentUser());

  // Tab State
  activeTab = signal<'profile' | 'security' | 'preferences' | 'sessions'>('profile');

  // Loading & Error States
  loading = signal(true);
  error = signal<string | null>(null);

  // Operation States
  savingProfileState = signal(false);
  savingPasswordState = signal(false);
  savingPreferencesState = signal(false);

  // Data States
  settingsId = '1';
  sessions = signal<Session[]>([]);
  avatarSrc: string | null = null;
  lastLoginTime = signal<string>('N/A');

  // Form password show/hide visibility toggles
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  // Forms
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  preferencesForm!: FormGroup;

  // Track original values to check if forms are dirty
  private originalProfileValue: any;
  private originalPreferencesValue: any;

  // Confirmation Modal Settings
  showConfirmModal = signal(false);
  confirmTitle = signal('');
  confirmBody = signal('');
  private confirmPromiseResolver: ((value: boolean) => void) | null = null;

  // Toast Alerts Settings
  toastMessage = signal('');
  toastType = signal<'success' | 'error' | 'info'>('success');
  private toastTimeout: any;

  // Computed helper for password checklist validation
  newPassValidLength = computed(() => {
    const val = this.passwordForm?.get('newPassword')?.value;
    return val && val.length >= 8;
  });

  otherSessions = computed(() => {
    return this.sessions().filter(s => !s.current);
  });

  constructor() {
    this.initForms();
  }

  ngOnInit() {
    this.loadData();
    this.lastLoginTime.set(new Date().toLocaleString());
  }

  private initForms() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      designation: ['', Validators.required],
      employeeId: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.preferencesForm = this.fb.group({
      theme: ['light'],
      sidebarCollapsed: [false],
      emailNotifications: [true],
      assignmentNotifications: [true],
      examNotifications: [true],
      messageNotifications: [true],
      profileVisibility: [true],
      phoneVisibility: [false]
    });

    // Handle theme preview on form selection
    this.preferencesForm.get('theme')?.valueChanges.subscribe(theme => {
      if (theme) {
        this.applyTheme(theme);
      }
    });
  }

  private passwordMatchValidator(group: any) {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  loadData() {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      this.error.set('Authentication credentials not found. Please log in.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      settings: this.settingsService.getSettings(currentUser.id),
      sessions: this.settingsService.getSessions(currentUser.id)
    }).subscribe({
      next: ({ settings, sessions }) => {
        this.settingsId = settings.id;
        this.sessions.set(sessions);

        // Prepopulate forms
        this.profileForm.patchValue({
          name: currentUser.name,
          phone: (currentUser as any).phone || '',
          designation: (currentUser as any).designation || '',
          employeeId: (currentUser as any).employeeId || ''
        });
        this.avatarSrc = (currentUser as any).profilePhoto || null;

        this.preferencesForm.patchValue({
          theme: settings.theme || 'light',
          sidebarCollapsed: settings.sidebarCollapsed || false,
          emailNotifications: settings.emailNotifications ?? true,
          assignmentNotifications: settings.assignmentNotifications ?? true,
          examNotifications: settings.examNotifications ?? true,
          messageNotifications: settings.messageNotifications ?? true,
          profileVisibility: settings.profileVisibility ?? true,
          phoneVisibility: settings.phoneVisibility ?? false
        });

        // Store baseline values for unsaved check
        this.originalProfileValue = this.profileForm.value;
        this.originalPreferencesValue = this.preferencesForm.value;

        // Apply loaded theme preference
        this.applyTheme(settings.theme || 'light');

        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Failed to read settings from the API server.');
        this.loading.set(false);
        this.triggerToast('Failed to load settings data.', 'error');
      }
    });
  }

  // File Upload Helper to Base64
  onAvatarSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      this.triggerToast('File exceeds 5MB limit.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.avatarSrc = e.target?.result as string;
      this.profileForm.markAsDirty(); // mark form dirty on image upload
    };
    reader.readAsDataURL(file);
  }

  removeAvatar() {
    this.avatarSrc = null;
    this.profileForm.markAsDirty();
  }

  // Toggle toggle preferences
  togglePrefControl(field: string) {
    const ctrl = this.preferencesForm.get(field);
    if (ctrl) {
      ctrl.setValue(!ctrl.value);
      ctrl.markAsDirty();
    }
  }

  // Update Profile Form submission
  saveProfile() {
    if (this.profileForm.invalid) return;

    const currentUser = this.authService.currentUser();
    if (!currentUser) return;

    this.savingProfileState.set(true);

    const formVal = this.profileForm.value;
    const profilePayload = {
      name: formVal.name,
      phone: formVal.phone,
      designation: formVal.designation,
      employeeId: formVal.employeeId,
      profilePhoto: this.avatarSrc
    };

    this.settingsService.updateUserProfile(currentUser.id, profilePayload).subscribe({
      next: (updatedUser) => {
        // Update user state inside service
        const mergedUser = { ...currentUser, ...updatedUser };
        this.authService.currentUser.set(mergedUser);
        localStorage.setItem('smartuni_user', JSON.stringify(mergedUser));

        // Reset baseline state
        this.originalProfileValue = this.profileForm.value;
        this.profileForm.markAsPristine();

        this.savingProfileState.set(false);
        this.triggerToast('Profile information saved successfully!', 'success');
      },
      error: (err) => {
        console.error(err);
        this.savingProfileState.set(false);
        this.triggerToast('Failed to save profile changes.', 'error');
      }
    });
  }

  resetProfileForm() {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.profileForm.patchValue({
        name: currentUser.name,
        phone: (currentUser as any).phone || '',
        designation: (currentUser as any).designation || '',
        employeeId: (currentUser as any).employeeId || ''
      });
      this.avatarSrc = (currentUser as any).profilePhoto || null;
      this.profileForm.markAsPristine();
    }
  }

  // Save Security password changes
  savePassword() {
    if (this.passwordForm.invalid) return;

    const currentUser = this.authService.currentUser();
    if (!currentUser) return;

    const { currentPassword, newPassword } = this.passwordForm.value;

    // Simulate validation check
    if ((currentUser as any).password && (currentUser as any).password !== currentPassword) {
      this.triggerToast('Current password does not match.', 'error');
      return;
    }

    this.savingPasswordState.set(true);

    this.settingsService.updatePassword(currentUser.id, newPassword).subscribe({
      next: () => {
        // Sync memory pass
        (currentUser as any).password = newPassword;
        this.authService.currentUser.set({ ...currentUser });
        localStorage.setItem('smartuni_user', JSON.stringify(currentUser));

        this.passwordForm.reset();
        this.passwordForm.markAsPristine();
        
        this.savingPasswordState.set(false);
        this.triggerToast('Password updated successfully!', 'success');
      },
      error: (err) => {
        console.error(err);
        this.savingPasswordState.set(false);
        this.triggerToast('Failed to update password.', 'error');
      }
    });
  }

  resetPasswordForm() {
    this.passwordForm.reset();
    this.passwordForm.markAsPristine();
  }

  // Update Notification & Appearance Settings
  savePreferences() {
    if (this.preferencesForm.invalid) return;

    const currentUser = this.authService.currentUser();
    if (!currentUser) return;

    this.savingPreferencesState.set(true);

    const settingsData = {
      ...this.preferencesForm.value,
      userId: currentUser.id,
      lastUpdated: new Date().toISOString()
    };

    this.settingsService.updateSettings(this.settingsId, settingsData).subscribe({
      next: () => {
        this.originalPreferencesValue = this.preferencesForm.value;
        this.preferencesForm.markAsPristine();

        this.savingPreferencesState.set(false);
        this.triggerToast('Preferences saved successfully!', 'success');
      },
      error: (err) => {
        console.error(err);
        this.savingPreferencesState.set(false);
        this.triggerToast('Failed to save preferences.', 'error');
      }
    });
  }

  resetPreferencesForm() {
    this.preferencesForm.patchValue(this.originalPreferencesValue);
    this.preferencesForm.markAsPristine();
    this.applyTheme(this.originalPreferencesValue?.theme || 'light');
  }

  // Theme Toggler
  applyTheme(theme: string) {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        localStorage.setItem('theme', 'dark');
        this.themeService.currentTheme.set('dark');
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('theme', 'light');
        this.themeService.currentTheme.set('light');
      } else if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme = prefersDark ? 'dark' : 'light';
        if (prefersDark) {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
        localStorage.setItem('theme', 'system');
        this.themeService.currentTheme.set(systemTheme);
      }
    }
  }

  // Session Management Actions
  confirmLogoutDevice(session: Session) {
    this.openConfirmModal(
      'Terminate Session',
      `Are you sure you want to terminate the session on ${session.device} (${session.ipAddress})?`
    ).then((confirmed) => {
      if (confirmed) {
        this.settingsService.deleteSession(session.id).subscribe({
          next: () => {
            this.sessions.update(list => list.filter(s => s.id !== session.id));
            this.triggerToast('Session revoked successfully.', 'success');
          },
          error: (err) => {
            console.error(err);
            this.triggerToast('Failed to revoke session.', 'error');
          }
        });
      }
    });
  }

  confirmLogoutOtherDevices() {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return;

    const currentSess = this.sessions().find(s => s.current);
    const currentId = currentSess ? currentSess.id : '';

    this.openConfirmModal(
      'Terminate Other Sessions',
      'Are you sure you want to log out from all other devices? This will invalidate all authentication tokens except this one.'
    ).then((confirmed) => {
      if (confirmed) {
        this.settingsService.deleteOtherSessions(currentUser.id, currentId).subscribe({
          next: () => {
            this.sessions.update(list => list.filter(s => s.id === currentId));
            this.triggerToast('Logged out from all other devices.', 'success');
          },
          error: (err) => {
            console.error(err);
            this.triggerToast('Failed to log out from other devices.', 'error');
          }
        });
      }
    });
  }

  // Guard Helper
  hasUnsavedChanges(): boolean {
    return (
      (this.profileForm.dirty && JSON.stringify(this.profileForm.value) !== JSON.stringify(this.originalProfileValue)) ||
      (this.preferencesForm.dirty && JSON.stringify(this.preferencesForm.value) !== JSON.stringify(this.originalPreferencesValue)) ||
      this.passwordForm.dirty
    );
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.hasUnsavedChanges()) {
      // Revert theme preview if they choose to leave, so background does not get stuck in unsaved preview
      return new Observable<boolean>((observer) => {
        this.openConfirmModal(
          'Unsaved Changes',
          'You have unsaved configuration changes. Do you want to discard them and navigate away?'
        ).then(res => {
          if (res) {
            this.applyTheme(this.originalPreferencesValue?.theme || 'light');
          }
          observer.next(res);
          observer.complete();
        });
      });
    }
    return true;
  }

  // Alert Toasts
  private triggerToast(msg: string, type: 'success' | 'error' | 'info' = 'success') {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastMessage.set(msg);
    this.toastType.set(type);

    this.toastTimeout = setTimeout(() => {
      this.toastMessage.set('');
    }, 4000);
  }

  // Custom Confirmation Dialog using Promises
  private openConfirmModal(title: string, body: string): Promise<boolean> {
    this.confirmTitle.set(title);
    this.confirmBody.set(body);
    this.showConfirmModal.set(true);

    return new Promise<boolean>((resolve) => {
      this.confirmPromiseResolver = resolve;
    });
  }

  closeConfirmModal(result: boolean) {
    this.showConfirmModal.set(false);
    if (this.confirmPromiseResolver) {
      this.confirmPromiseResolver(result);
      this.confirmPromiseResolver = null;
    }
  }
}
