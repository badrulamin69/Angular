import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-programs-listing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pt-32 pb-24 bg-brand-light dark:bg-brand-dark min-h-screen">
      <div class="container mx-auto px-4 md:px-6 lg:px-8">
        <div class="max-w-4xl mb-16 animate-fade-in-up">
          <h1 class="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">Academic Catalog</h1>
          <p class="text-lg text-slate-600 dark:text-slate-400">Discover our world-class degree programs across various faculties and departments. Shaping the future through excellence in education.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <!-- Sidebar Filters -->
          <div class="lg:col-span-1 space-y-8">
            <div>
              <h4 class="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Faculties</h4>
              <div class="space-y-3">
                <button (click)="filterFaculty('')" 
                        class="w-full text-left px-5 py-3 rounded-2xl text-sm font-bold transition-all border border-transparent shadow-sm flex flex-col gap-0.5" 
                        [class.bg-mit-red]="!selectedFaculty()" 
                        [class.text-white]="!selectedFaculty()" 
                        [class.hover:bg-slate-100]="selectedFaculty()"
                        [class.dark:hover:bg-slate-800]="selectedFaculty()">
                  <span>All Programs</span>
                </button>
                
                <button *ngFor="let fac of faculties()" 
                        (click)="filterFaculty(fac.id)"
                        class="w-full text-left px-5 py-3 rounded-2xl text-sm font-bold transition-all border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-0.5"
                        [class.bg-mit-red]="selectedFaculty() === fac.id"
                        [class.text-white]="selectedFaculty() === fac.id"
                        [class.hover:bg-slate-100]="selectedFaculty() !== fac.id"
                        [class.dark:hover:bg-slate-800]="selectedFaculty() !== fac.id">
                  <span class="text-[13px]">{{ fac.name }}</span>
                  <span class="text-[10px] opacity-70 font-medium" [class.text-white]="selectedFaculty() === fac.id">{{ fac.bnName }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Programs Grid -->
          <div class="lg:col-span-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div *ngFor="let prog of filteredPrograms()" class="glass-card p-8 group hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start mb-6">
                    <span class="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">{{ prog.duration }}</span>
                    <span class="text-xs font-bold text-slate-400">{{ prog.credits }} Credits</span>
                  </div>
                  <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-indigo-600 transition-colors leading-tight">{{ prog.name }}</h3>
                  <p class="text-sm text-slate-500 mb-8 leading-relaxed">A comprehensive curriculum designed to provide deep theoretical knowledge and practical industry skills.</p>
                </div>
                
                <div class="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div class="flex flex-col">
                    <span class="text-[10px] font-black text-mit-red uppercase tracking-widest mb-1">{{ getFacultyNameByDept(prog.departmentId) }}</span>
                    <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ getDeptName(prog.departmentId) }}</span>
                  </div>
                  <button class="w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <div *ngIf="filteredPrograms().length === 0" class="p-20 text-center glass-panel">
              <p class="text-lg font-bold text-slate-400">No programs found for this selection.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProgramsListingComponent implements OnInit {
  private http = inject(HttpClient);

  programs = signal<any[]>([]);
  departments = signal<any[]>([]);
  faculties = signal<any[]>([]);
  selectedFaculty = signal<string>('');

  filteredPrograms = computed(() => {
    const facId = this.selectedFaculty();
    if (!facId) return this.programs();
    
    // Find all departments that belong to this faculty
    const deptIds = this.departments()
      .filter(d => d.facultyId === facId)
      .map(d => d.id);
      
    return this.programs().filter(p => deptIds.includes(p.departmentId));
  });

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/programs').subscribe(data => this.programs.set(data));
    this.http.get<any[]>('http://localhost:3000/departments').subscribe(data => this.departments.set(data));
    this.http.get<any[]>('http://localhost:3000/faculties').subscribe(data => this.faculties.set(data));
  }

  filterFaculty(id: string) {
    this.selectedFaculty.set(id);
  }

  getDeptName(id: string) {
    return this.departments().find(d => d.id === id)?.name || 'Academic Unit';
  }

  getFacultyNameByDept(deptId: string) {
    const dept = this.departments().find(d => d.id === deptId);
    if (!dept) return 'Academic Faculty';
    return this.faculties().find(f => f.id === dept.facultyId)?.name || 'Academic Faculty';
  }
}
