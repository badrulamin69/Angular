import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-shared-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6 animate-fade-in-up max-w-4xl">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Account Settings
          </h1>
          <p class="text-slate-500 mt-1">Manage your profile, security, and system preferences.</p>
        </div>
        <button
          *ngIf="activeTab === 'profile'"
          (click)="saveChanges()"
          class="px-5 py-2.5 bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 hover:-translate-y-0.5 transition-all text-sm"
        >
          Save Changes
        </button>
        <button
          *ngIf="activeTab === 'security'"
          (click)="savePassword()"
          [disabled]="passwordForm.invalid"
          class="px-5 py-2.5 bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 hover:-translate-y-0.5 transition-all text-sm disabled:opacity-50"
        >
          Update Password
        </button>
        <button
          *ngIf="activeTab === 'notifications'"
          (click)="saveNotifications()"
          class="px-5 py-2.5 bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 hover:-translate-y-0.5 transition-all text-sm"
        >
          Save Preferences
        </button>
      </div>

      <!-- Success/Error feedback toast -->
      <div
        *ngIf="feedbackMsg()"
        [ngClass]="
          feedbackType() === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
            : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:text-red-400'
        "
        class="px-4 py-3 rounded-xl border font-semibold text-sm flex items-center gap-2 animate-fade-in"
      >
        <svg
          *ngIf="feedbackType() === 'success'"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <svg
          *ngIf="feedbackType() === 'error'"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
        {{ feedbackMsg() }}
      </div>

      <div class="glass-panel overflow-hidden">
        <div class="flex flex-col md:flex-row">
          <!-- Sidebar Tabs -->
          <div
            class="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 space-y-1"
          >
            <button
              (click)="activeTab = 'profile'"
              [class.bg-sky-50]="activeTab === 'profile'"
              [class.text-sky-600]="activeTab === 'profile'"
              [class.dark:bg-sky-900/20]="activeTab === 'profile'"
              [class.dark:text-sky-400]="activeTab === 'profile'"
              class="w-full text-left px-4 py-2.5 rounded-lg font-bold text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Personal Profile
            </button>
            <button
              (click)="activeTab = 'uploads'"
              [class.bg-sky-50]="activeTab === 'uploads'"
              [class.text-sky-600]="activeTab === 'uploads'"
              [class.dark:bg-sky-900/20]="activeTab === 'uploads'"
              [class.dark:text-sky-400]="activeTab === 'uploads'"
              class="w-full text-left px-4 py-2.5 rounded-lg font-bold text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              File Uploads
            </button>
            <button
              (click)="activeTab = 'security'"
              [class.bg-sky-50]="activeTab === 'security'"
              [class.text-sky-600]="activeTab === 'security'"
              [class.dark:bg-sky-900/20]="activeTab === 'security'"
              [class.dark:text-sky-400]="activeTab === 'security'"
              class="w-full text-left px-4 py-2.5 rounded-lg font-bold text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Security & Password
            </button>
            <button
              (click)="activeTab = 'notifications'"
              [class.bg-sky-50]="activeTab === 'notifications'"
              [class.text-sky-600]="activeTab === 'notifications'"
              [class.dark:bg-sky-900/20]="activeTab === 'notifications'"
              [class.dark:text-sky-400]="activeTab === 'notifications'"
              class="w-full text-left px-4 py-2.5 rounded-lg font-bold text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Notification Preferences
            </button>
          </div>

          <!-- Content Area -->
          <div class="flex-1 p-6 md:p-8 space-y-8">
            <!-- === PROFILE TAB === -->
            <div *ngIf="activeTab === 'profile'">
              <!-- Avatar Section -->
              <div class="flex items-center gap-6 mb-8">
                <div
                  class="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-700"
                >
                  <img
                    [src]="
                      avatarSrc ||
                      'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user()?.name || 'User')
                    "
                    alt="Avatar"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 class="font-bold text-slate-900 dark:text-white text-lg">Profile Picture</h4>
                  <p class="text-sm text-slate-500 mb-3">PNG, JPG up to 5MB</p>
                  <div class="flex gap-2">
                    <input
                      #avatarInput
                      type="file"
                      accept="image/*"
                      class="hidden"
                      (change)="onAvatarChange($event)"
                    />
                    <button
                      (click)="avatarInput.click()"
                      class="px-4 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Change
                    </button>
                    <button
                      (click)="removeAvatar()"
                      class="px-4 py-1.5 text-rose-500 rounded-lg text-sm font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <!-- Form Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-2"
                    >Full Name</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="profileName"
                    class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-2"
                    >Email Address</label
                  >
                  <input
                    type="email"
                    [value]="user()?.email"
                    class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm font-bold text-slate-500 cursor-not-allowed"
                    disabled
                  />
                  <p class="text-[10px] text-slate-400 mt-1">
                    Contact IT support to change your institutional email.
                  </p>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-2"
                    >Bio / Description</label
                  >
                  <textarea
                    rows="4"
                    [(ngModel)]="bio"
                    class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm font-medium text-slate-900 dark:text-white resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- === FILE UPLOADS TAB === -->
            <div *ngIf="activeTab === 'uploads'">
              <h4 class="font-bold text-slate-900 dark:text-white mb-4 text-lg">
                Secure Document Vault
              </h4>
              <div
                (click)="fileInput.click()"
                (dragover)="$event.preventDefault()"
                (drop)="onFileDrop($event)"
                class="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <input
                  #fileInput
                  type="file"
                  multiple
                  class="hidden"
                  (change)="onFileSelect($event)"
                />
                <div
                  class="w-14 h-14 rounded-full bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-500 mb-4 group-hover:scale-110 transition-transform"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
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
                <h3 class="font-bold text-slate-900 dark:text-white">
                  Click to upload or drag and drop
                </h3>
                <p class="text-slate-500 text-xs mt-1">SVG, PNG, JPG, or PDF (max. 10MB each)</p>
              </div>
              <div *ngIf="uploadedFiles().length > 0" class="mt-6 space-y-2">
                <h5 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Uploaded Files
                </h5>
                <div
                  *ngFor="let f of uploadedFiles(); let i = index"
                  class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <div
                    class="w-8 h-8 bg-sky-100 dark:bg-sky-900/30 text-sky-600 rounded-lg flex items-center justify-center text-xs font-black"
                  >
                    {{ f.name.split('.').pop()?.toUpperCase() }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                      {{ f.name }}
                    </p>
                    <p class="text-xs text-slate-400">{{ (f.size / 1024).toFixed(1) }} KB</p>
                  </div>
                  <button
                    (click)="removeFile(i)"
                    class="text-slate-400 hover:text-rose-500 transition-colors p-1"
                  >
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
                    >
                      <line x1="18" x2="6" y1="6" y2="18" />
                      <line x1="6" x2="18" y1="6" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- === SECURITY TAB === -->
            <div *ngIf="activeTab === 'security'">
              <h4 class="font-bold text-slate-900 dark:text-white mb-6 text-lg">Change Password</h4>
              <form
                [formGroup]="passwordForm"
                (ngSubmit)="savePassword()"
                class="space-y-5 max-w-sm"
              >
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-2"
                    >Current Password</label
                  >
                  <input
                    type="password"
                    formControlName="currentPassword"
                    class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-2"
                    >New Password</label
                  >
                  <input
                    type="password"
                    formControlName="newPassword"
                    class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
                    placeholder="Min 8 characters"
                  />
                  <p
                    *ngIf="
                      passwordForm.get('newPassword')?.invalid &&
                      passwordForm.get('newPassword')?.touched
                    "
                    class="text-[10px] text-rose-500 mt-1"
                  >
                    Password must be at least 8 characters.
                  </p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-2"
                    >Confirm New Password</label
                  >
                  <input
                    type="password"
                    formControlName="confirmPassword"
                    class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
                    placeholder="••••••••"
                  />
                  <p
                    *ngIf="
                      passwordForm.hasError('mismatch') &&
                      passwordForm.get('confirmPassword')?.touched
                    "
                    class="text-[10px] text-rose-500 mt-1"
                  >
                    Passwords do not match.
                  </p>
                </div>
              </form>
            </div>

            <!-- === NOTIFICATIONS TAB === -->
            <div *ngIf="activeTab === 'notifications'">
              <h4 class="font-bold text-slate-900 dark:text-white mb-6 text-lg">
                Notification Preferences
              </h4>
              <div class="space-y-4 max-w-lg">
                <div
                  *ngFor="let pref of notificationPrefs()"
                  class="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <div>
                    <p class="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {{ pref.label }}
                    </p>
                    <p class="text-xs text-slate-500 mt-0.5">{{ pref.description }}</p>
                  </div>
                  <button
                    (click)="togglePref(pref.key)"
                    class="relative shrink-0 ml-4 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
                    [class.bg-sky-500]="pref.enabled"
                    [class.bg-slate-200]="!pref.enabled"
                    [class.dark:bg-slate-700]="!pref.enabled"
                  >
                    <span
                      class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                      [class.translate-x-5]="pref.enabled"
                      [class.translate-x-0]="!pref.enabled"
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SharedSettingsComponent implements OnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  user = computed(() => this.authService.currentUser());

  activeTab: 'profile' | 'uploads' | 'security' | 'notifications' = 'profile';
  profileName = '';
  bio = '';
  avatarSrc: string | null = null;
  uploadedFiles = signal<File[]>([]);
  feedbackMsg = signal('');
  feedbackType = signal<'success' | 'error'>('success');

  passwordForm = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator },
  );

  notificationPrefs = signal([
    {
      key: 'email_alerts',
      label: 'Email Alerts',
      description: 'Receive important system alerts via email.',
      enabled: true,
    },
    {
      key: 'sms_alerts',
      label: 'SMS Notifications',
      description: 'Get text message alerts for urgent events.',
      enabled: false,
    },
    {
      key: 'enrollment_updates',
      label: 'Enrollment Updates',
      description: 'Notify when new students enroll or withdraw.',
      enabled: true,
    },
    {
      key: 'financial_updates',
      label: 'Financial Updates',
      description: 'Notify on invoice payments and outstanding dues.',
      enabled: true,
    },
    {
      key: 'system_maintenance',
      label: 'System Maintenance',
      description: 'Receive advance notice of scheduled downtime.',
      enabled: false,
    },
  ]);

  private passwordMatchValidator(group: any) {
    const np = group.get('newPassword')?.value;
    const cp = group.get('confirmPassword')?.value;
    return np === cp ? null : { mismatch: true };
  }

  ngOnInit() {
    const currentUser = this.user();
    if (currentUser) {
      this.profileName = currentUser.name;
      this.bio = (currentUser as any).bio || '';
    }
  }

  onAvatarChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.avatarSrc = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeAvatar() {
    this.avatarSrc = null;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const files = Array.from(event.dataTransfer?.files || []);
    this.uploadedFiles.update((list) => [...list, ...files]);
  }

  onFileSelect(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files || []);
    this.uploadedFiles.update((list) => [...list, ...files]);
  }

  removeFile(index: number) {
    this.uploadedFiles.update((list) => list.filter((_, i) => i !== index));
  }

  togglePref(key: string) {
    this.notificationPrefs.update((prefs) =>
      prefs.map((p) => (p.key === key ? { ...p, enabled: !p.enabled } : p)),
    );
  }

  saveChanges() {
    const currentUser = this.user();
    if (!currentUser) return;
    this.http
      .patch<any>(`http://localhost:8080/users/${currentUser.id}`, {
        name: this.profileName,
        bio: this.bio,
      })
      .subscribe({
        next: (updatedUser) => {
          const mergedUser = { ...currentUser, ...updatedUser };
          this.authService.currentUser.set(mergedUser);
          localStorage.setItem('smartuni_user', JSON.stringify(mergedUser));
          this.showFeedback('Profile updated successfully!', 'success');
        },
        error: () => this.showFeedback('Failed to update profile. Please try again.', 'error'),
      });
  }

  savePassword() {
    if (this.passwordForm.invalid) return;
    const currentUser = this.user();
    if (!currentUser) return;
    const { currentPassword, newPassword } = this.passwordForm.value;
    if ((currentUser as any).password && (currentUser as any).password !== currentPassword) {
      this.showFeedback('Current password is incorrect.', 'error');
      return;
    }
    this.http
      .patch<any>(`http://localhost:8080/users/${currentUser.id}`, { password: newPassword })
      .subscribe({
        next: () => {
          this.passwordForm.reset();
          this.showFeedback('Password updated successfully!', 'success');
        },
        error: () => this.showFeedback('Failed to update password.', 'error'),
      });
  }

  saveNotifications() {
    this.showFeedback('Notification preferences saved!', 'success');
  }

  private showFeedback(msg: string, type: 'success' | 'error') {
    this.feedbackMsg.set(msg);
    this.feedbackType.set(type);
    setTimeout(() => this.feedbackMsg.set(''), 4000);
  }
}
