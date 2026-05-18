import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-courses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Learning Management System</h1>
          <p class="text-slate-500 mt-1">Access your enrolled courses, lectures, and assignments.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- LMS Course Card -->
        <div *ngFor="let course of courses()" class="glass-panel overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform flex flex-col">
          <div class="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 relative p-5 flex flex-col justify-between">
            <div class="flex justify-between items-start">
              <span class="px-2 py-0.5 bg-white/20 backdrop-blur-md text-white text-xs font-black tracking-wider rounded border border-white/20 shadow-sm">{{ course.code }}</span>
              <button class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
            <h3 class="text-xl font-black text-white leading-tight mt-2 drop-shadow-md">{{ course.title }}</h3>
          </div>
          
          <div class="p-5 flex-1 flex flex-col">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                <img [src]="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + course.id" alt="Instructor" class="w-full h-full object-cover">
              </div>
              <div>
                <p class="text-sm font-bold text-slate-900 dark:text-white">{{ course.instructor || 'Staff' }}</p>
                <p class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Instructor</p>
              </div>
            </div>
            
            <div class="space-y-3 mt-auto">
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-500 font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                  Course Materials
                </span>
                <span class="font-bold text-slate-900 dark:text-white">{{ course.credits * 3 }} Files</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-500 font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/></svg>
                  Video Lectures
                </span>
                <span class="font-bold text-slate-900 dark:text-white">{{ course.credits * 2 }} Videos</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-500 font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Pending Assignments
                </span>
                <span class="font-bold text-slate-900 dark:text-white bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 rounded">1 Due</span>
              </div>
            </div>
            
            <div class="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div class="flex justify-between text-xs mb-1 font-bold">
                <span class="text-slate-600 dark:text-slate-400">Course Progress</span>
                <span class="text-blue-600 dark:text-blue-400">65%</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div class="bg-blue-500 h-full rounded-full" style="width: 65%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentCoursesComponent implements OnInit {
  private http = inject(HttpClient);
  courses = signal<any[]>([]);

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/courses').subscribe(data => {
      this.courses.set(data);
    });
  }
}
