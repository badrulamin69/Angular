import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-student-registration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Course Registration</h1>
          <p class="text-slate-500 mt-1">Select courses for Fall 2026. Minimum 9 credits, Maximum 18 credits.</p>
        </div>
        <div class="glass-card px-4 py-2 flex items-center gap-4">
          <div class="flex flex-col">
            <span class="text-[10px] uppercase font-bold text-slate-500">Selected Credits</span>
            <span class="text-xl font-black" [class.text-mit-red]="totalCredits() > 18" [class.text-green-600]="totalCredits() >= 9 && totalCredits() <= 18">{{ totalCredits() }}<span class="text-sm text-slate-400">/18</span></span>
          </div>
          <button [disabled]="totalCredits() < 9 || totalCredits() > 18" 
                  (click)="submitRegistration()"
                  class="px-5 py-2 bg-gradient-to-r from-mit-red to-primary-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            Submit for Approval
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Available Courses -->
        <div class="lg:col-span-2 space-y-4">
          <div class="glass-panel p-4 flex justify-between items-center">
            <div class="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
              <button class="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold whitespace-nowrap">Core Subjects</button>
              <button class="px-4 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-bold whitespace-nowrap">Electives</button>
              <button class="px-4 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-bold whitespace-nowrap">Retake Options</button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div *ngFor="let course of availableCourses()" class="glass-panel p-5 relative overflow-hidden group">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-200/50 dark:from-slate-700/50 to-transparent rounded-bl-full -z-10 group-hover:from-mit-red/10 transition-colors"></div>
              
              <div class="flex justify-between items-start mb-2">
                <span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs font-black tracking-wider rounded-md border border-slate-200 dark:border-slate-700">{{ course.code }}</span>
                <span class="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded">{{ course.credits }} Credits</span>
              </div>
              
              <h4 class="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-2">{{ course.title }}</h4>
              <p class="text-xs text-slate-500 mb-4">{{ course.instructor }} &bull; {{ course.schedule }}</p>
              
              <button *ngIf="!isCourseSelected(course.id)" (click)="addCourse(course)" class="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-mit-red hover:text-white text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-colors text-sm flex justify-center items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                Add Course
              </button>
              <button *ngIf="isCourseSelected(course.id)" (click)="removeCourse(course.id)" class="w-full py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/50 font-bold rounded-lg transition-colors text-sm flex justify-center items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Selected
              </button>
            </div>
          </div>
        </div>

        <!-- Selected Courses Summary -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Registration Cart</h3>
          <div class="glass-panel p-5">
            <div *ngIf="selectedCourses().length === 0" class="text-center py-8 opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <p class="text-sm font-bold">No courses selected yet.</p>
            </div>

            <div *ngIf="selectedCourses().length > 0" class="space-y-3">
              <div *ngFor="let c of selectedCourses()" class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p class="font-bold text-slate-900 dark:text-white text-sm">{{ c.code }}</p>
                  <p class="text-[10px] text-slate-500 font-medium">{{ c.title }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-600 dark:text-slate-400">{{ c.credits }} Cr</span>
                  <button (click)="removeCourse(c.id)" class="text-slate-400 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              </div>

              <div class="border-t border-slate-200 dark:border-slate-700 pt-3 mt-4 flex justify-between items-center font-bold">
                <span class="text-slate-700 dark:text-slate-300">Total Tuition</span>
                <span class="text-slate-900 dark:text-white text-lg">\${{ totalCredits() * 150 }}</span>
              </div>
            </div>
          </div>

          <div class="glass-card p-5 border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10">
            <h4 class="text-amber-800 dark:text-amber-500 font-bold text-sm flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
              Advising Note
            </h4>
            <p class="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              Your registration is subject to approval by your academic advisor, Dr. Sarah. Ensure you meet all prerequisites before submitting.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentRegistrationComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  availableCourses = signal<any[]>([]);
  selectedCourses = signal<any[]>([]);

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/courses').subscribe(data => {
      this.availableCourses.set(data);
    });
  }

  totalCredits = computed(() => {
    return this.selectedCourses().reduce((sum, course) => sum + course.credits, 0);
  });

  isCourseSelected(id: number): boolean {
    return this.selectedCourses().some(c => c.id === id);
  }

  addCourse(course: any) {
    if (!this.isCourseSelected(course.id)) {
      this.selectedCourses.update(c => [...c, course]);
    }
  }

  removeCourse(id: number) {
    this.selectedCourses.update(c => c.filter(course => course.id !== id));
  }

  submitRegistration() {
    const studentId = this.authService.currentUser()?.id;
    if (!studentId) return;

    const registrations = this.selectedCourses().map(course => ({
      studentId: studentId,
      courseId: course.code,
      semester: 'Fall 2026',
      progress: 0,
      attendance: 0,
      completedAssignments: 0,
      totalAssignments: 0
    }));

    // In a real app, we'd use forkJoin for multiple posts, but for demo we'll just post them
    registrations.forEach(reg => {
      this.http.post('http://localhost:3000/enrollments', reg).subscribe();
    });

    alert('Registration submitted successfully!');
    this.selectedCourses.set([]);
  }
}
