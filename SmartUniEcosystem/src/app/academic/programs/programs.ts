import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Academic Programs</h1>
          <p class="text-slate-500 mt-1">Manage university degree programs, curriculum, and credit structures.</p>
        </div>
        <button (click)="openModal()" class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Add Program
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="glass-panel px-4 py-2 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input [(ngModel)]="searchQuery" (input)="onSearch()" type="text" placeholder="Search programs..." class="bg-transparent border-none outline-none text-sm w-full font-medium">
        </div>
        <select [(ngModel)]="selectedDept" (change)="onFilter()" class="glass-panel px-4 py-2 text-sm font-bold outline-none cursor-pointer">
          <option value="">All Departments</option>
          <option *ngFor="let dept of departments()" [value]="dept.id">{{ dept.name }}</option>
        </select>
      </div>

      <!-- Programs Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let prog of filteredPrograms()" class="glass-card p-6 border-l-4 border-l-indigo-500 hover:-translate-y-1 transition-all group">
          <div class="flex justify-between items-start mb-4">
            <span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded">{{ prog.id }}</span>
            <div class="flex gap-1">
              <button (click)="openModal(prog); $event.stopPropagation()" class="p-1.5 text-slate-400 hover:text-indigo-500 transition-colors" title="Edit Program"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg></button>
              <button (click)="deleteProgram(prog.id)" class="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
            </div>
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">{{ prog.name }}</h3>
          <p class="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-6">{{ getDeptName(prog.departmentId) }}</p>
          
          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p class="text-[10px] uppercase font-bold text-slate-400">Duration</p>
              <p class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ prog.duration }}</p>
            </div>
            <div>
              <p class="text-[10px] uppercase font-bold text-slate-400">Total Credits</p>
              <p class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ prog.credits }} Cr</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="glass-panel max-w-lg w-full p-6 shadow-2xl">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">{{ editingProgramId() ? 'Edit Academic Program' : 'Add New Program' }}</h2>
        <form [formGroup]="progForm" (ngSubmit)="saveProgram()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Program Name</label>
            <input formControlName="name" type="text" class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-sm">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
            <select formControlName="departmentId" class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-sm">
              <option *ngFor="let dept of departments()" [value]="dept.id">{{ dept.name }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Duration</label>
              <input formControlName="duration" type="text" placeholder="e.g. 4 Years" class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-sm">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Credits</label>
              <input formControlName="credits" type="number" class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-sm">
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button type="button" (click)="isModalOpen = false" class="flex-1 py-2 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Cancel</button>
            <button type="submit" [disabled]="progForm.invalid" class="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">
              {{ editingProgramId() ? 'Save Changes' : 'Save Program' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProgramsComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  programs = signal<any[]>([]);
  departments = signal<any[]>([]);
  filteredPrograms = signal<any[]>([]);
  
  searchQuery = '';
  selectedDept = '';
  isModalOpen = false;
  editingProgramId = signal<string | null>(null);

  progForm = this.fb.group({
    name: ['', Validators.required],
    departmentId: ['', Validators.required],
    duration: ['', Validators.required],
    credits: [140, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<any[]>('http://localhost:3000/programs').subscribe(data => {
      this.programs.set(data);
      this.filteredPrograms.set(data);
    });
    this.http.get<any[]>('http://localhost:3000/departments').subscribe(data => {
      this.departments.set(data);
    });
  }

  getDeptName(id: string) {
    return this.departments().find(d => d.id === id)?.name || id;
  }

  onSearch() {
    this.applyFilters();
  }

  onFilter() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.programs();
    if (this.searchQuery) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
    if (this.selectedDept) {
      filtered = filtered.filter(p => p.departmentId === this.selectedDept);
    }
    this.filteredPrograms.set(filtered);
  }

  openModal(prog?: any) {
    if (prog) {
      this.editingProgramId.set(prog.id);
      this.progForm.reset({
        name: prog.name,
        departmentId: prog.departmentId,
        duration: prog.duration,
        credits: prog.credits
      });
    } else {
      this.editingProgramId.set(null);
      this.progForm.reset({ credits: 140 });
    }
    this.isModalOpen = true;
  }

  saveProgram() {
    if (this.progForm.valid) {
      const formVal = this.progForm.value;
      const editId = this.editingProgramId();

      if (editId) {
        // PATCH existing
        this.http.patch<any>(`http://localhost:3000/programs/${editId}`, formVal).subscribe(res => {
          this.programs.update(list => list.map(p => p.id === editId ? { ...p, ...res } : p));
          this.applyFilters();
          this.isModalOpen = false;
        });
      } else {
        // POST new
        const newProg = {
          ...formVal,
          id: 'P-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0')
        };
        this.http.post<any>('http://localhost:3000/programs', newProg).subscribe(res => {
          this.programs.update(p => [...p, res]);
          this.applyFilters();
          this.isModalOpen = false;
        });
      }
    }
  }

  deleteProgram(id: string) {
    if (confirm('Delete this program?')) {
      this.http.delete(`http://localhost:3000/programs/${id}`).subscribe(() => {
        this.programs.update(p => p.filter(prog => prog.id !== id));
        this.applyFilters();
      });
    }
  }
}
