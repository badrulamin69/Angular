import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacultyService } from '../../core/services/faculty.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-faculty-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Attendance Register
          </h1>
          <p class="text-slate-500 mt-1">Take daily attendance and track student engagement.</p>
        </div>
        <button
          (click)="saveRegister()"
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
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Save Register
        </button>
      </div>

      <div class="glass-panel overflow-hidden">
        <div
          class="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div class="flex gap-4 items-center">
            <select
              (change)="onCourseChange($event)"
              class="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-bold text-slate-900 dark:text-white"
            >
              <option *ngFor="let course of courses()" [value]="course.id">
                {{ course.code }}: {{ course.title }}
              </option>
            </select>
            <input
              type="date"
              class="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-medium text-slate-700 dark:text-slate-300"
              [(ngModel)]="attendanceDate"
            />
          </div>
          <div class="flex gap-2">
            <button
              (click)="markAllPresent()"
              class="px-4 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-sm font-bold hover:bg-green-200 transition-colors"
            >
              Mark All Present
            </button>
          </div>
        </div>

        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Student Info
              </th>
              <th
                class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center"
              >
                Status (Today)
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr
              *ngFor="let student of students()"
              class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                    <img
                      [src]="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + student.name"
                      alt="Avatar"
                      class="w-full h-full"
                    />
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 dark:text-white">{{ student.name }}</p>
                    <p class="text-xs text-slate-500 font-mono">{{ student.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <div
                  class="inline-flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <button
                    (click)="updateStatus(student.id, 'P')"
                    [class]="
                      student.status === 'P'
                        ? 'bg-green-500 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    "
                    class="px-4 py-1.5 rounded-md text-sm font-bold transition-all"
                  >
                    P
                  </button>
                  <button
                    (click)="updateStatus(student.id, 'A')"
                    [class]="
                      student.status === 'A'
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    "
                    class="px-4 py-1.5 rounded-md text-sm font-bold transition-all"
                  >
                    A
                  </button>
                  <button
                    (click)="updateStatus(student.id, 'L')"
                    [class]="
                      student.status === 'L'
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    "
                    class="px-4 py-1.5 rounded-md text-sm font-bold transition-all"
                  >
                    L
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="students().length === 0">
              <td colspan="2" class="px-6 py-12 text-center text-slate-500 italic">
                No students enrolled in this course.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class FacultyAttendanceComponent implements OnInit {
  private facultyService = inject(FacultyService);
  private authService = inject(AuthService);
  user = computed(() => this.authService.currentUser());

  courses = signal<any[]>([]);
  students = signal<any[]>([]);
  attendanceDate = new Date().toISOString().split('T')[0];

  ngOnInit() {
    const faculty = this.user();
    if (!faculty) return;

    this.facultyService.getCourses(faculty.id).subscribe((courses) => {
      this.courses.set(courses);
      if (courses.length > 0) {
        this.loadStudents(courses[0].id);
      }
    });
  }

  onCourseChange(event: any) {
    this.loadStudents(event.target.value);
  }

  loadStudents(courseId: string) {
    // We'll use courseId or courseCode. In our db.json some enrollments use code, some use id.
    // Let's find the course code for this id.
    const course = this.courses().find((c) => c.id === courseId);
    const searchId = course ? course.code : courseId;

    this.facultyService.getStudentsByCourse(searchId).subscribe((students) => {
      this.students.set(students.map((s) => ({ ...s, status: 'P' })));
    });
  }

  updateStatus(studentId: string, status: string) {
    this.students.update((students) =>
      students.map((s) => (s.id === studentId ? { ...s, status } : s)),
    );
  }

  markAllPresent() {
    this.students.update((students) => students.map((s) => ({ ...s, status: 'P' })));
  }

  saveRegister() {
    alert(`Attendance register for ${this.attendanceDate} saved successfully!`);
    console.log('Saving attendance:', {
      date: this.attendanceDate,
      records: this.students(),
    });
  }
}
