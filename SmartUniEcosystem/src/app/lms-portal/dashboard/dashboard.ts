import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-lms-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Learning Dashboard
          </h1>
          <p class="text-slate-500 mt-1">
            Track your progress, resume courses, and view learning analytics.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-card p-6 border-b-4 border-b-violet-500 flex flex-col justify-between">
          <div>
            <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
              Hours Learned
            </p>
            <h3 class="text-4xl font-black text-slate-900 dark:text-white">
              {{ progress()?.totalHoursLearned || 0 }}<span class="text-lg text-slate-400">h</span>
            </h3>
          </div>
          <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <p class="text-xs font-bold text-emerald-500 flex items-center gap-1">
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
                <polyline points="18 15 12 9 6 15" />
              </svg>
              Weekly Goal: 10h
            </p>
          </div>
        </div>
        <div class="glass-card p-6 border-b-4 border-b-fuchsia-500 flex flex-col justify-between">
          <div>
            <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
              Courses Active
            </p>
            <h3 class="text-4xl font-black text-slate-900 dark:text-white">
              {{ enrollments().length }}
            </h3>
          </div>
          <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <p class="text-xs font-bold text-slate-500">In current semester</p>
          </div>
        </div>
        <div class="glass-card p-6 border-b-4 border-b-amber-500 flex flex-col justify-between">
          <div>
            <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
              Certificates Earned
            </p>
            <h3 class="text-4xl font-black text-slate-900 dark:text-white">
              {{ progress()?.certificatesEarned || 0 }}
            </h3>
          </div>
          <div
            class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center"
          >
            <p class="text-xs font-bold text-slate-500">View Portfolio</p>
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
              class="text-amber-500"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Resume Learning -->
        <div class="lg:col-span-2 space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Continue Learning</h3>

          <div
            *ngIf="lastCourse()"
            class="glass-panel overflow-hidden flex flex-col md:flex-row group hover:shadow-lg transition-all cursor-pointer"
          >
            <div
              class="md:w-1/3 bg-gradient-to-br from-violet-600 to-indigo-600 p-6 flex flex-col justify-center relative overflow-hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-white/20 absolute -right-4 -bottom-4"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <h4 class="text-xl font-black text-white relative z-10">{{ lastCourse()?.title }}</h4>
              <p class="text-white/80 text-xs font-bold mt-2 relative z-10">
                {{ lastModule()?.title }}
              </p>
            </div>
            <div class="p-6 md:w-2/3 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-2">
                  <span
                    class="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider bg-violet-50 dark:bg-violet-900/30 px-2 py-0.5 rounded"
                    >In Progress</span
                  >
                </div>
                <h5 class="font-bold text-slate-900 dark:text-white text-lg mb-1">
                  Up Next: {{ lastModule()?.title }}
                </h5>
                <p class="text-sm text-slate-500 line-clamp-2">
                  Resume where you left off. Module type: {{ lastModule()?.type }} ({{
                    lastModule()?.duration
                  }})
                </p>
              </div>
              <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div class="flex justify-between text-xs mb-1 font-bold">
                  <span class="text-slate-600 dark:text-slate-400">Course Progress</span>
                  <span class="text-violet-600 dark:text-violet-400"
                    >{{ lastCourseEnrollment()?.progress }}%</span
                  >
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    class="bg-violet-600 h-full rounded-full"
                    [style.width.%]="lastCourseEnrollment()?.progress"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="!lastCourse()" class="p-12 text-center text-slate-500 glass-panel">
            No active learning sessions found. Start a course to see it here.
          </div>
        </div>

        <!-- Weekly Activity & Analytics -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Activity Overview</h3>
          <div class="glass-panel p-5">
            <!-- Simulated Chart -->
            <div class="flex items-end justify-between h-32 gap-2 mb-4">
              <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm relative group">
                <div
                  class="absolute bottom-0 w-full bg-violet-400 rounded-t-sm h-[30%] group-hover:bg-violet-500 transition-colors"
                ></div>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm relative group">
                <div
                  class="absolute bottom-0 w-full bg-violet-400 rounded-t-sm h-[60%] group-hover:bg-violet-500 transition-colors"
                ></div>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm relative group">
                <div
                  class="absolute bottom-0 w-full bg-violet-400 rounded-t-sm h-[40%] group-hover:bg-violet-500 transition-colors"
                ></div>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm relative group">
                <div
                  class="absolute bottom-0 w-full bg-violet-600 rounded-t-sm h-[90%] shadow-lg shadow-violet-500/50"
                ></div>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm relative group">
                <div
                  class="absolute bottom-0 w-full bg-violet-400 rounded-t-sm h-[50%] group-hover:bg-violet-500 transition-colors"
                ></div>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm relative group">
                <div
                  class="absolute bottom-0 w-full bg-violet-400 rounded-t-sm h-[20%] group-hover:bg-violet-500 transition-colors"
                ></div>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm relative group">
                <div
                  class="absolute bottom-0 w-full bg-violet-400 rounded-t-sm h-[10%] group-hover:bg-violet-500 transition-colors"
                ></div>
              </div>
            </div>
            <div
              class="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-200 dark:border-slate-800 pt-2"
            >
              <span>Mon</span><span>Tue</span><span>Wed</span
              ><span class="text-violet-600">Thu</span><span>Fri</span><span>Sat</span
              ><span>Sun</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LmsDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  user = computed(() => this.authService.currentUser());

  progress = signal<any>(null);
  enrollments = signal<any[]>([]);
  lastCourse = signal<any>(null);
  lastModule = signal<any>(null);
  lastCourseEnrollment = computed(() => {
    const course = this.lastCourse();
    return this.enrollments().find((e) => e.courseId === course?.code);
  });

  ngOnInit() {
    const currentUser = this.user();
    if (!currentUser) return;

    this.http.get<any[]>(`${environment.apiUrl}/userProgress`).subscribe((data) => {
      const userProgress = data.find((p) => p.userId === currentUser.id);
      this.progress.set(userProgress);

      if (userProgress) {
        // Fetch last course details
        this.http.get<any[]>(`${environment.apiUrl}/courses`).subscribe((courses) => {
          this.lastCourse.set(courses.find((c) => c.code === userProgress.lastAccessedCourseId));
        });
        // Fetch last module details
        this.http.get<any[]>(`${environment.apiUrl}/courseContent`).subscribe((modules) => {
          this.lastModule.set(modules.find((m) => m.id === userProgress.lastAccessedModuleId));
        });
      }
    });

    this.http.get<any[]>(`${environment.apiUrl}/enrollments`).subscribe((enrolls) => {
      this.enrollments.set(enrolls.filter((e) => e.studentId === currentUser.id));
    });
  }
}
