import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DynamicActionButtonComponent } from '../../shared/components/dynamic-action-button/dynamic-action-button.component';

interface Course {
  id?: string;
  code: string;
  title: string;
  credits: number;
  department: string;
  status: 'Active' | 'Draft' | 'Archived';
  enrolled: number;
  capacity: number;
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DynamicActionButtonComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Curriculum & Courses
          </h1>
          <p class="text-slate-500 mt-1">Manage course catalogs, credits, and class capacities.</p>
        </div>
        <button
          (click)="openModal()"
          class="px-4 py-2 bg-gradient-to-r from-mit-red to-primary-600 text-white rounded-xl shadow-lg shadow-mit-red/30 hover:shadow-mit-red/50 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2"
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
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Create Course
        </button>
      </div>

      <div
        class="glass-panel p-4 flex flex-col md:flex-row gap-4 justify-between items-center animate-fade-in delay-100"
      >
        <div class="relative w-full md:w-96">
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
            class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Search courses..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-mit-red focus:ring-2 focus:ring-mit-red/20 outline-none text-sm text-slate-900 dark:text-white transition-all"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in delay-200">
        <div
          *ngFor="let course of filteredCourses()"
          class="glass-card p-6 flex flex-col hover:scale-[1.02] transition-transform cursor-pointer group relative overflow-hidden"
        >
          <div
            class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-600/10 to-transparent rounded-bl-full -z-10 group-hover:from-mit-red/10 transition-colors"
          ></div>

          <div class="flex justify-between items-start mb-4">
            <span
              class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs font-black tracking-wider rounded-lg border border-slate-200 dark:border-slate-700"
            >
              {{ course.code }}
            </span>
            <div class="flex gap-2 items-center">
              <span
                [ngClass]="{
                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                    course.status === 'Active',
                  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400':
                    course.status === 'Draft',
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400':
                    course.status === 'Archived',
                }"
                class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
              >
                {{ course.status }}
              </span>
              <app-dynamic-action-button
                [action]="getCourseAction(course, 'edit')"
                iconPosition="left"
                (clicked)="openModal(course); $event.stopPropagation()"
              ></app-dynamic-action-button>
              <app-dynamic-action-button
                [action]="getCourseAction(course, 'delete')"
                iconPosition="right"
                (clicked)="deleteCourse(course.id!); $event.stopPropagation()"
              ></app-dynamic-action-button>
            </div>
          </div>

          <h3
            class="text-lg font-extrabold text-slate-900 dark:text-white mb-1 group-hover:text-mit-red transition-colors"
          >
            {{ course.title }}
          </h3>
          <p class="text-sm text-slate-500 font-medium mb-6">{{ course.department }}</p>

          <div
            class="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between"
          >
            <div class="flex flex-col">
              <span class="text-xs text-slate-400 font-medium">Credits</span>
              <span class="text-sm font-bold text-slate-700 dark:text-slate-300"
                >{{ course.credits }}.0</span
              >
            </div>
            <div class="flex flex-col text-right">
              <span class="text-xs text-slate-400 font-medium">Enrolled</span>
              <span class="text-sm font-bold text-slate-700 dark:text-slate-300">
                <span [class.text-mit-red]="course.enrolled >= course.capacity">{{
                  course.enrolled
                }}</span>
                / {{ course.capacity }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div *ngIf="isModalOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeModal()"></div>
      <div class="glass-panel w-full max-w-md p-6 relative z-10 animate-fade-in-up">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">
            {{ editingCourseId() ? 'Edit Course' : 'Create New Course' }}
          </h3>
          <button
            (click)="closeModal()"
            class="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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

        <form [formGroup]="courseForm" (ngSubmit)="saveCourse()" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                >Course Code</label
              >
              <input
                type="text"
                formControlName="code"
                placeholder="e.g. CS-101"
                class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white uppercase"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                >Credits</label
              >
              <input
                type="number"
                formControlName="credits"
                class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5"
              >Course Title</label
            >
            <input
              type="text"
              formControlName="title"
              class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5"
              >Department</label
            >
            <select
              formControlName="department"
              class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white"
            >
              <option *ngFor="let dept of departments()" [value]="dept.name">
                {{ dept.name }}
              </option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                >Capacity</label
              >
              <input
                type="number"
                formControlName="capacity"
                class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                >Status</label
              >
              <select
                formControlName="status"
                class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-bold"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div
            class="pt-4 flex gap-3 justify-end border-t border-slate-200 dark:border-slate-700 mt-6"
          >
            <button
              type="button"
              (click)="closeModal()"
              class="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="courseForm.invalid"
              class="px-5 py-2.5 bg-mit-red text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-primary-600 transition-all disabled:opacity-50"
            >
              {{ editingCourseId() ? 'Save Changes' : 'Create Course' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class CoursesComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  courses = signal<Course[]>([]);
  departments = signal<any[]>([]);
  searchQuery = signal('');
  isModalOpen = signal(false);
  editingCourseId = signal<string | null>(null);

  getCourseAction(course: Course, type: 'edit' | 'delete') {
    if (type === 'edit') {
      return {
        label: 'Edit',
        icon: 'edit',
        type: 'outline',
        size: 'sm',
        tooltip: 'Edit course details',
        ariaLabel: `Edit ${course.title}`,
      };
    }
    return {
      label: 'Delete',
      icon: 'arrow-right',
      type: 'danger',
      size: 'sm',
      tooltip: 'Delete this course',
      ariaLabel: `Delete ${course.title}`,
    };
  }

  courseForm = this.fb.group({
    code: ['', Validators.required],
    title: ['', Validators.required],
    credits: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    department: ['', Validators.required],
    capacity: [50, [Validators.required, Validators.min(1)]],
    status: ['Draft', Validators.required],
  });

  filteredCourses = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.courses().filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q),
    );
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<Course[]>('http://localhost:8080/courses').subscribe((data) => {
      this.courses.set(data);
    });
    this.http.get<any[]>('http://localhost:8080/departments').subscribe((data) => {
      this.departments.set(data);
    });
  }

  openModal(course?: Course) {
    if (course) {
      this.editingCourseId.set(course.id || null);
      this.courseForm.reset({
        code: course.code,
        title: course.title,
        credits: course.credits,
        department: course.department,
        capacity: course.capacity,
        status: course.status,
      });
    } else {
      this.editingCourseId.set(null);
      const firstDept = this.departments().length > 0 ? this.departments()[0].name : '';
      this.courseForm.reset({ credits: 3, capacity: 50, department: firstDept, status: 'Draft' });
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  saveCourse() {
    if (this.courseForm.valid) {
      const formValue = this.courseForm.value;
      const courseData: any = {
        code: formValue.code?.toUpperCase(),
        title: formValue.title,
        credits: formValue.credits,
        department: formValue.department,
        capacity: formValue.capacity,
        status: formValue.status,
      };

      const editId = this.editingCourseId();
      if (editId) {
        // PATCH existing
        this.http
          .patch<Course>(`http://localhost:8080/courses/${editId}`, courseData)
          .subscribe((res) => {
            this.courses.update((list) =>
              list.map((c) => (c.id === editId ? { ...c, ...res } : c)),
            );
            this.closeModal();
          });
      } else {
        // POST new
        courseData.enrolled = 0;
        this.http.post<Course>('http://localhost:8080/courses', courseData).subscribe((res) => {
          this.courses.update((c) => [...c, res]);
          this.closeModal();
        });
      }
    }
  }

  deleteCourse(id: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.http.delete(`http://localhost:8080/courses/${id}`).subscribe(() => {
        this.courses.update((c) => c.filter((course) => course.id !== id));
      });
    }
  }
}
