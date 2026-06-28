import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';

interface Activity {
  id: string;
  title: string;
  time: string;
  timestamp: string;
  type: string;
}

@Component({
  selector: 'app-shared-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
      <div class="flex items-center gap-6 glass-panel p-8">
        <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-600 to-mit-red text-white flex items-center justify-center font-bold text-4xl shadow-lg">
          {{ user()?.name?.charAt(0) || 'U' }}
        </div>
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {{ user()?.name || 'User Profile' }}
          </h1>
          <p class="text-slate-500 font-medium text-lg mt-1">{{ user()?.role }}</p>
          <p class="text-slate-400 text-sm mt-1">{{ user()?.email }}</p>
        </div>
      </div>

      <div class="glass-panel p-8">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-mit-red"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Recent Activities
        </h2>
        
        <div class="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
          
          <div *ngFor="let activity of activities()" class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div class="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10">
               
               <svg *ngIf="activity.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
               <svg *ngIf="activity.type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
               <svg *ngIf="activity.type !== 'success' && activity.type !== 'warning'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-sky-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-1">
                <h4 class="font-bold text-slate-900 dark:text-white">{{ activity.title }}</h4>
                <time class="text-[10px] font-bold text-slate-400 uppercase">{{ activity.timestamp | date:'MMM d, h:mm a' }}</time>
              </div>
              <p class="text-sm text-slate-500">{{ activity.time }}</p>
            </div>
          </div>

          <div *ngIf="activities().length === 0" class="text-center text-slate-400 py-8">
            No recent activities found.
          </div>
          
        </div>
      </div>
    </div>
  `
})
export class SharedProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  
  user = computed(() => this.authService.currentUser());
  activities = signal<Activity[]>([]);

  ngOnInit() {
    this.http.get<Activity[]>('http://localhost:8080/activityLogs').subscribe((data) => {
      this.activities.set(data);
    });
  }
}
