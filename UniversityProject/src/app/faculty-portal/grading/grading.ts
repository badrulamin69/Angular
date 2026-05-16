import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faculty-grading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Grading & Results</h1>
          <p class="text-slate-500 mt-1">Review student submissions and publish course grades.</p>
        </div>
        <div class="flex gap-3">
          <button class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Export CSV</button>
          <button class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Publish Final Grades
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Selection -->
        <div class="space-y-4">
          <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider">Select Course</h3>
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

          <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mt-8">Select Assignment</h3>
          <div class="space-y-2">
            <button class="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl text-left bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <p class="font-bold text-slate-900 dark:text-white text-sm">Midterm Exam</p>
              <p class="text-xs text-slate-500 mt-1">45/120 Graded</p>
            </button>
            <button class="w-full p-3 border border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-left transition-colors">
              <p class="font-bold text-indigo-700 dark:text-indigo-400 text-sm">Assignment 3: Graph Traversal</p>
              <p class="text-xs text-indigo-500 dark:text-indigo-300 mt-1">112/120 Submitted &bull; 0 Graded</p>
            </button>
          </div>
        </div>

        <!-- Grading Area -->
        <div class="lg:col-span-3 space-y-4">
          <div class="glass-panel overflow-hidden">
            <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 class="font-bold text-slate-900 dark:text-white">Submissions (Assignment 3)</h3>
              <div class="relative w-64">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" placeholder="Search student name or ID..." class="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-900 dark:text-white">
              </div>
            </div>
            
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-700">
                  <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Student ID</th>
                  <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Submission Date</th>
                  <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">File</th>
                  <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Grade (/100)</th>
                  <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr *ngFor="let student of students" class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td class="px-6 py-4 font-mono text-sm text-slate-600 dark:text-slate-400">{{ student.id }}</td>
                  <td class="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                      <img [src]="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + student.name" alt="Avatar" class="w-full h-full">
                    </div>
                    {{ student.name }}
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    <span *ngIf="student.submitted" class="text-emerald-600 dark:text-emerald-400 font-medium">Oct 12, 10:45 PM</span>
                    <span *ngIf="!student.submitted" class="text-red-500 font-bold">Missing</span>
                  </td>
                  <td class="px-6 py-4">
                    <button *ngIf="student.submitted" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                      File
                    </button>
                    <span *ngIf="!student.submitted" class="text-slate-400 text-sm">-</span>
                  </td>
                  <td class="px-6 py-4">
                    <input *ngIf="student.submitted" type="number" [value]="student.grade" class="w-20 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-900 dark:text-white" placeholder="0-100">
                    <span *ngIf="!student.submitted" class="text-slate-400 text-sm">-</span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button *ngIf="student.submitted" class="px-3 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-md text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">Save</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FacultyGradingComponent {
  selectedCourse = signal('CS-101');

  students = [
    { id: 'STU-2026-001', name: 'John Doe', submitted: true, grade: '' },
    { id: 'STU-2026-002', name: 'Alice Smith', submitted: true, grade: '95' },
    { id: 'STU-2026-003', name: 'Robert Johnson', submitted: false, grade: '' },
    { id: 'STU-2026-004', name: 'Emily Davis', submitted: true, grade: '' },
    { id: 'STU-2026-005', name: 'Michael Wilson', submitted: true, grade: '88' }
  ];

  selectCourse(course: string) {
    this.selectedCourse.set(course);
  }
}
