import { Component, signal, inject, OnInit, computed, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacultyService } from '../../core/services/faculty.service';
import { AuthService } from '../../core/auth/auth.service';

@Pipe({
  name: 'filterByType',
  standalone: true
})
export class FilterByTypePipe implements PipeTransform {
  transform(items: any[], type: string): any[] {
    if (!items) return [];
    if (type === 'File') {
      return items.filter(i => i.type !== 'Video');
    }
    return items.filter(i => i.type === type);
  }
}

@Component({
  selector: 'app-faculty-courses',
  standalone: true,
  imports: [CommonModule, FilterByTypePipe],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Course Management</h1>
          <p class="text-slate-500 mt-1">Manage your active courses, upload materials, and view recorded lectures.</p>
        </div>
        <button class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          Upload Material
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Selection -->
        <div class="space-y-4">
          <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider">My Courses</h3>
          <div class="space-y-2">
            <button *ngFor="let course of courses()" (click)="selectCourse(course)" [ngClass]="{'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400': selectedCourseId() === course.id, 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50': selectedCourseId() !== course.id}" class="w-full p-4 border rounded-xl text-left transition-all font-bold flex justify-between items-center">
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-tighter">{{ course.code }}</p>
                {{ course.title }}
              </div>
              <span *ngIf="selectedCourseId() === course.id" class="w-2 h-2 rounded-full bg-indigo-500"></span>
            </button>
            <div *ngIf="courses().length === 0" class="p-4 text-center text-slate-500 text-sm border-2 border-dashed rounded-xl">No courses assigned.</div>
          </div>
        </div>

        <!-- Course Workspace -->
        <div class="lg:col-span-3 space-y-6">
          
          <div *ngIf="selectedCourse(); else noSelection" class="space-y-6">
            <!-- Tabs -->
            <div class="flex gap-4 border-b border-slate-200 dark:border-slate-700">
              <button (click)="activeTab.set('materials')" [class.border-indigo-500]="activeTab() === 'materials'" [class.text-indigo-600]="activeTab() === 'materials'" [class.dark:text-indigo-400]="activeTab() === 'materials'" class="pb-3 px-2 font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white border-b-2 border-transparent transition-colors">Course Materials</button>
              <button (click)="activeTab.set('lectures')" [class.border-indigo-500]="activeTab() === 'lectures'" [class.text-indigo-600]="activeTab() === 'lectures'" [class.dark:text-indigo-400]="activeTab() === 'lectures'" class="pb-3 px-2 font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white border-b-2 border-transparent transition-colors">Recorded Lectures</button>
              <button (click)="activeTab.set('details')" [class.border-indigo-500]="activeTab() === 'details'" [class.text-indigo-600]="activeTab() === 'details'" [class.dark:text-indigo-400]="activeTab() === 'details'" class="pb-3 px-2 font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white border-b-2 border-transparent transition-colors">Course Settings</button>
            </div>

            <!-- Materials View -->
            <div *ngIf="activeTab() === 'materials'" class="space-y-4 animate-fade-in">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div *ngFor="let item of courseContent() | filterByType:'File'" class="glass-panel p-4 flex items-start gap-4 group cursor-pointer hover:-translate-y-1 transition-all">
                  <div class="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15v-4"/><path d="M12 15v-3"/><path d="M15 15v-2"/></svg>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{{ item.title }}</h4>
                    <p class="text-xs text-slate-500 mt-1">Duration: {{ item.duration }} &bull; Type: {{ item.type }}</p>
                  </div>
                  <button class="text-slate-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </button>
                </div>
                <div *ngIf="courseContent().length === 0" class="md:col-span-2 text-center py-12 text-slate-500">No materials uploaded yet.</div>
              </div>
              
              <div class="mt-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                <div class="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                </div>
                <h3 class="font-bold text-slate-900 dark:text-white text-lg">Drag & Drop Files Here</h3>
                <p class="text-slate-500 text-sm mt-1">PDF, PPTX, DOCX, or ZIP up to 50MB</p>
              </div>
            </div>

            <!-- Lectures View -->
            <div *ngIf="activeTab() === 'lectures'" class="space-y-4 animate-fade-in">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div *ngFor="let video of courseContent() | filterByType:'Video'" class="glass-panel overflow-hidden group cursor-pointer">
                  <div class="h-40 bg-slate-900 relative flex items-center justify-center">
                    <button class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all scale-90 group-hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </button>
                    <span class="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded">{{ video.duration }}</span>
                  </div>
                  <div class="p-4">
                    <h4 class="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">{{ video.title }}</h4>
                    <p class="text-xs text-slate-500">Video Lecture &bull; {{ video.duration }}</p>
                  </div>
                </div>
                <div *ngIf="(courseContent() | filterByType:'Video').length === 0" class="md:col-span-2 text-center py-12 text-slate-500">No recorded lectures found.</div>
              </div>
            </div>

            <!-- Details View -->
            <div *ngIf="activeTab() === 'details'" class="glass-panel p-6 animate-fade-in">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Course Configuration</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-slate-500 uppercase mb-2">Course Name</label>
                  <input type="text" [value]="selectedCourse()?.title" class="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-500 uppercase mb-2">Enrollment Status</label>
                  <select class="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold">
                    <option [selected]="selectedCourse()?.status === 'Active'">Active</option>
                    <option [selected]="selectedCourse()?.status === 'Draft'">Draft</option>
                    <option [selected]="selectedCourse()?.status === 'Archived'">Archived</option>
                  </select>
                </div>
              </div>
              <button class="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold">Save Changes</button>
            </div>
          </div>

          <ng-template #noSelection>
            <div class="flex flex-col items-center justify-center py-32 text-center">
              <div class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
              </div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Select a course to manage</h2>
              <p class="text-slate-500 mt-2">Choose a course from the sidebar to view its materials and settings.</p>
            </div>
          </ng-template>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class FacultyCoursesComponent implements OnInit {
  private facultyService = inject(FacultyService);
  private authService = inject(AuthService);
  user = computed(() => this.authService.currentUser());

  courses = signal<any[]>([]);
  selectedCourseId = signal<string | null>(null);
  selectedCourse = signal<any | null>(null);
  courseContent = signal<any[]>([]);
  activeTab = signal<'materials' | 'lectures' | 'details'>('materials');

  ngOnInit() {
    const faculty = this.user();
    if (!faculty) return;

    this.facultyService.getCourses(faculty.id).subscribe(courses => {
      this.courses.set(courses);
      if (courses.length > 0) {
        this.selectCourse(courses[0]);
      }
    });
  }

  selectCourse(course: any) {
    this.selectedCourseId.set(course.id);
    this.selectedCourse.set(course);
    this.facultyService.getCourseContent(course.id).subscribe(content => {
      this.courseContent.set(content);
    });
  }
}
