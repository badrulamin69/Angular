import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faculty-courses',
  standalone: true,
  imports: [CommonModule],
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
            <button (click)="selectCourse('CS-101')" [ngClass]="{'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400': selectedCourse() === 'CS-101', 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50': selectedCourse() !== 'CS-101'}" class="w-full p-4 border rounded-xl text-left transition-all font-bold flex justify-between items-center">
              CS-101: Algorithms
              <span *ngIf="selectedCourse() === 'CS-101'" class="w-2 h-2 rounded-full bg-indigo-500"></span>
            </button>
            <button (click)="selectCourse('CS-205')" [ngClass]="{'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400': selectedCourse() === 'CS-205', 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50': selectedCourse() !== 'CS-205'}" class="w-full p-4 border rounded-xl text-left transition-all font-bold flex justify-between items-center">
              CS-205: Data Structures
              <span *ngIf="selectedCourse() === 'CS-205'" class="w-2 h-2 rounded-full bg-indigo-500"></span>
            </button>
          </div>
        </div>

        <!-- Course Workspace -->
        <div class="lg:col-span-3 space-y-6">
          
          <!-- Tabs -->
          <div class="flex gap-4 border-b border-slate-200 dark:border-slate-700">
            <button (click)="activeTab.set('materials')" [class.border-indigo-500]="activeTab() === 'materials'" [class.text-indigo-600]="activeTab() === 'materials'" [class.dark:text-indigo-400]="activeTab() === 'materials'" class="pb-3 px-2 font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white border-b-2 border-transparent transition-colors">Course Materials</button>
            <button (click)="activeTab.set('lectures')" [class.border-indigo-500]="activeTab() === 'lectures'" [class.text-indigo-600]="activeTab() === 'lectures'" [class.dark:text-indigo-400]="activeTab() === 'lectures'" class="pb-3 px-2 font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white border-b-2 border-transparent transition-colors">Recorded Lectures</button>
            <button (click)="activeTab.set('details')" [class.border-indigo-500]="activeTab() === 'details'" [class.text-indigo-600]="activeTab() === 'details'" [class.dark:text-indigo-400]="activeTab() === 'details'" class="pb-3 px-2 font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white border-b-2 border-transparent transition-colors">Course Settings</button>
          </div>

          <!-- Materials View -->
          <div *ngIf="activeTab() === 'materials'" class="space-y-4 animate-fade-in">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- File Card -->
              <div class="glass-panel p-4 flex items-start gap-4 group cursor-pointer hover:-translate-y-1 transition-all">
                <div class="w-12 h-12 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15v-4"/><path d="M12 15v-3"/><path d="M15 15v-2"/></svg>
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">Syllabus_Fall2026.pdf</h4>
                  <p class="text-xs text-slate-500 mt-1">Uploaded 2 days ago &bull; 2.4 MB</p>
                </div>
                <button class="text-slate-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </button>
              </div>

              <!-- File Card -->
              <div class="glass-panel p-4 flex items-start gap-4 group cursor-pointer hover:-translate-y-1 transition-all">
                <div class="w-12 h-12 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">Lecture_1_Slides.pptx</h4>
                  <p class="text-xs text-slate-500 mt-1">Uploaded yesterday &bull; 5.1 MB</p>
                </div>
                <button class="text-slate-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </button>
              </div>
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
              <div class="glass-panel overflow-hidden group cursor-pointer">
                <div class="h-40 bg-slate-900 relative flex items-center justify-center">
                  <button class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all scale-90 group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </button>
                  <span class="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded">45:20</span>
                </div>
                <div class="p-4">
                  <h4 class="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">Lecture 1: Intro to Big O Notation</h4>
                  <p class="text-xs text-slate-500">Recorded on Oct 10, 2026 &bull; 120 Views</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class FacultyCoursesComponent {
  selectedCourse = signal('CS-101');
  activeTab = signal<'materials' | 'lectures' | 'details'>('materials');

  selectCourse(course: string) {
    this.selectedCourse.set(course);
  }
}
