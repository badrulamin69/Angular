import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Human Resources</h1>
          <p class="text-slate-500 mt-1">Manage faculty members, administrative staff, and assignments.</p>
        </div>
        <button (click)="openModal()" class="px-4 py-2 bg-gradient-to-r from-mit-red to-primary-600 text-white rounded-xl shadow-lg shadow-mit-red/30 hover:shadow-mit-red/50 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          Add Faculty Member
        </button>
      </div>

      <div class="glass-panel overflow-hidden animate-fade-in delay-200">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700/50">
              <tr *ngFor="let t of teachers()" (click)="openTeacherDossier(t)" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                <td class="px-6 py-4 flex items-center gap-3">
                  <div [ngClass]="{
                    'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400': t.role === 'Faculty Member',
                    'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400': t.role === 'Staff'
                  }" class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                    {{ t.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 dark:text-white leading-none">{{ t.name }}</p>
                    <p class="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">{{ t.role }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">{{ t.email }}</td>
                <td class="px-6 py-4 text-right">
                  <button (click)="deleteTeacher(t.id); $event.stopPropagation()" class="text-slate-400 hover:text-mit-red transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete Faculty">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </td>
              </tr>
              <tr *ngIf="teachers().length === 0">
                <td colspan="3" class="px-6 py-8 text-center text-slate-500">No faculty or staff members found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Teacher Dossier Modal -->
    <div *ngIf="selectedTeacher()" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeTeacherDossier()"></div>
      <div class="glass-panel w-full max-w-2xl p-6 relative z-10 animate-fade-in-up flex flex-col max-h-[85vh] overflow-y-auto">
        <div class="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <div class="flex items-center gap-3">
            <div [ngClass]="{
              'bg-indigo-600 text-white': selectedTeacher()?.role === 'Faculty Member',
              'bg-emerald-600 text-white': selectedTeacher()?.role === 'Staff'
            }" class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
              {{ selectedTeacher()?.name?.charAt(0) }}
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ selectedTeacher()?.name }}</h3>
              <p class="text-xs text-slate-400 font-semibold">{{ selectedTeacher()?.role }} &bull; {{ selectedTeacher()?.email }}</p>
            </div>
          </div>
          <span class="text-xs font-black uppercase tracking-wider px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-650 dark:text-slate-350">
            ID: {{ selectedTeacher()?.id }}
          </span>
        </div>

        <div class="space-y-6">
          <!-- Staff Profile Details -->
          <div>
            <h4 class="text-sm font-black text-slate-900 dark:text-white mb-2 uppercase tracking-wide">Employment Profile</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <p class="text-[10px] text-slate-400 uppercase font-black">Designation</p>
                <p class="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{{ teacherProfile()?.designation || 'Lecturer / Coordinator' }}</p>
              </div>
              <div>
                <p class="text-[10px] text-slate-400 uppercase font-black">Department</p>
                <p class="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{{ teacherProfile()?.department || 'Instructional Department' }}</p>
              </div>
              <div>
                <p class="text-[10px] text-slate-400 uppercase font-black">Salary (Monthly)</p>
                <p class="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{{ (teacherProfile()?.salary || 3500) | currency:'USD' }}</p>
              </div>
              <div>
                <p class="text-[10px] text-slate-400 uppercase font-black">Joining Date</p>
                <p class="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{{ teacherProfile()?.joiningDate || '2024-01-01' | date:'mediumDate' }}</p>
              </div>
              <div class="md:col-span-2 border-t border-slate-200 dark:border-slate-800 pt-3 mt-1">
                <p class="text-[10px] text-slate-400 uppercase font-black">Contact Address</p>
                <p class="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{{ teacherProfile()?.address || 'Academy Campus Main Road' }} &bull; {{ teacherProfile()?.phone || '+880-CU-ADMIN' }}</p>
              </div>
            </div>
          </div>

          <!-- Tasks list -->
          <div>
            <h4 class="text-sm font-black text-slate-900 dark:text-white mb-2 uppercase tracking-wide">Assigned Duties & Tasks</h4>
            <div class="space-y-3">
              <div *ngFor="let task of teacherTasks()" class="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-start justify-between">
                <div>
                  <h5 class="font-bold text-sm text-slate-800 dark:text-slate-200">{{ task.title }}</h5>
                  <p class="text-xs text-slate-500 mt-0.5">{{ task.description }}</p>
                  <p class="text-[10px] text-slate-450 mt-1.5 font-semibold">Due Date: {{ task.dueDate | date:'mediumDate' }}</p>
                </div>
                <div class="text-right">
                  <span [ngClass]="{
                    'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400': task.priority === 'High',
                    'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400': task.priority === 'Medium',
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400': task.priority === 'Low'
                  }" class="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider block mb-1">
                    {{ task.priority }} Priority
                  </span>
                  <span [ngClass]="{
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50': task.status === 'Completed',
                    'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-900/50': task.status === 'In Progress',
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400': task.status === 'Pending'
                  }" class="text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider inline-block">
                    {{ task.status }}
                  </span>
                </div>
              </div>
              <div *ngIf="teacherTasks().length === 0" class="text-center text-xs text-slate-400 py-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl">
                No administrative tasks currently delegated.
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4 mt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button (click)="closeTeacherDossier()" class="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 font-bold rounded-lg text-sm transition-colors">Close Dossier</button>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div *ngIf="isModalOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeModal()"></div>
      <div class="glass-panel w-full max-w-md p-6 relative z-10 animate-fade-in-up">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">Add New Faculty Member</h3>
          <button (click)="closeModal()" class="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>
        
        <form [formGroup]="teacherForm" (ngSubmit)="saveTeacher()" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
            <input type="text" formControlName="name" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white">
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <input type="email" formControlName="email" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white">
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Designation</label>
            <input type="text" formControlName="designation" placeholder="e.g. Senior Lecturer" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white">
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Department</label>
            <select formControlName="departmentId" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white">
              <option *ngFor="let dept of departments()" [value]="dept.id">{{ dept.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
            <select formControlName="role" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white">
              <option value="Faculty Member">Faculty Member</option>
              <option value="Staff">Administrative Staff</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">University</label>
            <select formControlName="universityId" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white">
              <option *ngFor="let uni of universities()" [value]="uni.id">{{ uni.name }}</option>
            </select>
          </div>
          
          <div class="pt-4 flex gap-3 justify-end border-t border-slate-200 dark:border-slate-700 mt-6">
            <button type="button" (click)="closeModal()" class="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button type="submit" [disabled]="teacherForm.invalid" class="px-5 py-2.5 bg-mit-red text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-primary-600 transition-all disabled:opacity-50">Add Faculty</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class TeachersComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  teachers = signal<any[]>([]);
  universities = signal<any[]>([]);
  departments = signal<any[]>([]);
  isModalOpen = signal(false);

  selectedTeacher = signal<any | null>(null);
  teacherProfile = signal<any | null>(null);
  teacherTasks = signal<any[]>([]);

  teacherForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    designation: ['', Validators.required],
    departmentId: ['', Validators.required],
    role: ['Faculty Member', Validators.required],
    universityId: ['', Validators.required]
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Fetch both Faculty and Staff
    this.http.get<any[]>('http://localhost:3000/users').subscribe(data => {
      const filtered = data.filter(u => u.role === 'Faculty Member' || u.role === 'Staff');
      this.teachers.set(filtered);
    });
    this.http.get<any[]>('http://localhost:3000/universities').subscribe(data => {
      this.universities.set(data);
    });
    this.http.get<any[]>('http://localhost:3000/departments').subscribe(data => {
      this.departments.set(data);
    });
  }

  openModal() {
    const firstUni = this.universities().length > 0 ? this.universities()[0].id : '';
    const firstDept = this.departments().length > 0 ? this.departments()[0].id : '';
    this.teacherForm.reset({
      role: 'Faculty Member',
      universityId: firstUni,
      designation: '',
      departmentId: firstDept
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  saveTeacher() {
    if (this.teacherForm.valid) {
      const formValue = this.teacherForm.value;
      const newTeacher: any = {
        id: 'EMP-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
        name: formValue.name,
        email: formValue.email,
        password: 'password', // Default fake password
        role: formValue.role,
        universityId: formValue.universityId
      };

      this.http.post<any>('http://localhost:3000/users', newTeacher).subscribe(res => {
        const department = this.departments().find(d => d.id === formValue.departmentId)?.name || '';
        const staffProfile = {
          id: 'SP-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
          userId: res.id,
          designation: formValue.designation,
          department: department,
          joiningDate: new Date().toISOString().split('T')[0],
          salary: 0,
          phone: '',
          address: ''
        };

        this.http.post<any>('http://localhost:3000/staffProfiles', staffProfile).subscribe(() => {
          this.teachers.update(t => [...t, res]);
          this.closeModal();
        }, err => {
          console.error('Failed to create staff profile', err);
          this.closeModal();
        });
      });
    }
  }

  deleteTeacher(id: string) {
    if (confirm('Are you sure you want to remove this faculty member?')) {
      this.http.delete(`http://localhost:3000/users/${id}`).subscribe(() => {
        this.teachers.update(t => t.filter(teacher => teacher.id !== id));
      });
    }
  }

  openTeacherDossier(teacher: any) {
    this.selectedTeacher.set(teacher);
    this.teacherProfile.set(null);
    this.teacherTasks.set([]);

    this.http.get<any[]>(`http://localhost:3000/staffProfiles?userId=${teacher.id}`).subscribe(data => {
      if (data && data.length > 0) {
        this.teacherProfile.set(data[0]);
      }
    });

    this.http.get<any[]>(`http://localhost:3000/tasks?assignedTo=${teacher.id}`).subscribe(data => {
      this.teacherTasks.set(data);
    });
  }

  closeTeacherDossier() {
    this.selectedTeacher.set(null);
  }
}
