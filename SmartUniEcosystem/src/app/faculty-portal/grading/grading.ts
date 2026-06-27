import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacultyService } from '../../core/services/faculty.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-faculty-grading',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Grading & Results
          </h1>
          <p class="text-slate-500 mt-1">Review student submissions and publish course grades.</p>
        </div>
        <div class="flex gap-3">
          <button
            class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Export CSV
          </button>
          <button
            class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 2v20" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Publish Final Grades
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Selection -->
        <div class="space-y-4">
          <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider">Select Course</h3>
          <div class="space-y-2">
            <button
              *ngFor="let course of courses()"
              (click)="selectCourse(course)"
              [ngClass]="{
                'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400':
                  selectedCourseId() === course.id,
                'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50':
                  selectedCourseId() !== course.id,
              }"
              class="w-full p-4 border rounded-xl text-left transition-all font-bold flex justify-between items-center"
            >
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-tighter">{{ course.code }}</p>
                {{ course.title }}
              </div>
              <span
                *ngIf="selectedCourseId() === course.id"
                class="w-2 h-2 rounded-full bg-indigo-500"
              ></span>
            </button>
          </div>

          <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mt-8">
            Select Assignment
          </h3>
          <div class="space-y-2">
            <button
              *ngFor="let assignment of assignments()"
              (click)="selectAssignment(assignment)"
              [ngClass]="{
                'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20':
                  selectedAssignmentId() === assignment.id,
                'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900':
                  selectedAssignmentId() !== assignment.id,
              }"
              class="w-full p-3 border rounded-xl text-left transition-colors"
            >
              <p
                class="font-bold text-sm"
                [class.text-indigo-700]="selectedAssignmentId() === assignment.id"
                [class.dark:text-indigo-400]="selectedAssignmentId() === assignment.id"
                [class.text-slate-900]="selectedAssignmentId() !== assignment.id"
                [class.dark:text-white]="selectedAssignmentId() !== assignment.id"
              >
                {{ assignment.title }}
              </p>
              <p
                class="text-xs mt-1"
                [class.text-indigo-500]="selectedAssignmentId() === assignment.id"
                [class.text-slate-500]="selectedAssignmentId() !== assignment.id"
              >
                Due: {{ assignment.dueDate }} &bull; {{ assignment.totalPoints }} Points
              </p>
            </button>
            <div
              *ngIf="assignments().length === 0"
              class="p-4 text-center text-slate-500 text-xs border border-dashed rounded-xl"
            >
              No assignments found for this course.
            </div>
          </div>
        </div>

        <!-- Grading Area -->
        <div class="lg:col-span-3 space-y-4">
          <div *ngIf="selectedAssignment(); else noAssignment" class="glass-panel overflow-hidden">
            <div
              class="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50"
            >
              <h3 class="font-bold text-slate-900 dark:text-white">
                Submissions ({{ selectedAssignment()?.title }})
              </h3>
              <div class="relative w-64">
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
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  placeholder="Search student name or ID..."
                  class="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-700">
                  <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Submission Date
                  </th>
                  <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    File
                  </th>
                  <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Grade (/{{ selectedAssignment()?.totalPoints }})
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr
                  *ngFor="let sub of submissions()"
                  class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td class="px-6 py-4 font-mono text-sm text-slate-600 dark:text-slate-400">
                    {{ sub.studentId }}
                  </td>
                  <td
                    class="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-3"
                  >
                    <div class="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                      <img
                        [src]="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + sub.studentName"
                        alt="Avatar"
                        class="w-full h-full"
                      />
                    </div>
                    {{ sub.studentName }}
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    <span class="text-emerald-600 dark:text-emerald-400 font-medium">{{
                      sub.submissionDate
                    }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <a
                      [href]="sub.fileUrl"
                      target="_blank"
                      class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-sm font-medium"
                    >
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
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                      </svg>
                      {{ sub.fileUrl }}
                    </a>
                  </td>
                  <td class="px-6 py-4">
                    <input
                      type="number"
                      [(ngModel)]="sub.grade"
                      class="w-20 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-900 dark:text-white"
                      placeholder="0-100"
                    />
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button
                      (click)="saveGrade(sub)"
                      class="px-3 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-md text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                      Save
                    </button>
                  </td>
                </tr>
                <tr *ngIf="submissions().length === 0">
                  <td colspan="6" class="px-6 py-12 text-center text-slate-500 italic">
                    No submissions found for this assignment.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <ng-template #noAssignment>
            <div
              class="flex flex-col items-center justify-center py-32 text-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800"
            >
              <div
                class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">
                Select an assignment to grade
              </h2>
              <p class="text-slate-500 mt-1 max-w-xs">
                Pick a course and then an assignment from the sidebar to start reviewing student
                work.
              </p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
})
export class FacultyGradingComponent implements OnInit {
  private facultyService = inject(FacultyService);
  private authService = inject(AuthService);
  user = computed(() => this.authService.currentUser());

  courses = signal<any[]>([]);
  selectedCourseId = signal<string | null>(null);
  assignments = signal<any[]>([]);
  selectedAssignmentId = signal<string | null>(null);
  selectedAssignment = signal<any | null>(null);
  submissions = signal<any[]>([]);

  ngOnInit() {
    const faculty = this.user();
    if (!faculty) return;

    this.facultyService.getCourses(faculty.id).subscribe((courses) => {
      this.courses.set(courses);
      if (courses.length > 0) {
        this.selectCourse(courses[0]);
      }
    });
  }

  selectCourse(course: any) {
    this.selectedCourseId.set(course.id);
    this.facultyService.getAssignments(course.id).subscribe((assignments) => {
      this.assignments.set(assignments);
      if (assignments.length > 0) {
        this.selectAssignment(assignments[0]);
      } else {
        this.selectedAssignmentId.set(null);
        this.selectedAssignment.set(null);
        this.submissions.set([]);
      }
    });
  }

  selectAssignment(assignment: any) {
    this.selectedAssignmentId.set(assignment.id);
    this.selectedAssignment.set(assignment);
    this.facultyService.getSubmissions(this.user()!.id).subscribe((allSubmissions) => {
      this.submissions.set(allSubmissions.filter((s) => s.assignmentId === assignment.id));
    });
  }

  saveGrade(sub: any) {
    this.facultyService.updateSubmission(sub.id, { grade: sub.grade }).subscribe(() => {
      alert(`Grade saved for ${sub.studentName}`);
    });
  }
}
