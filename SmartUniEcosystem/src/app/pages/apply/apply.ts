import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Progress Header -->
        <div class="glass-panel p-8 mb-8 animate-fade-in">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">University Application</h1>
              <p class="text-slate-500 text-sm">Step {{ currentStep() }} of 5: {{ getStepTitle() }}</p>
            </div>
            <div class="hidden md:flex gap-2">
              <div *ngFor="let s of [1,2,3,4,5]" 
                   [class]="'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ' + 
                            (currentStep() === s ? 'bg-mit-red text-white scale-110' : 
                             currentStep() > s ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400')">
                <svg *ngIf="currentStep() > s" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span *ngIf="currentStep() <= s">{{ s }}</span>
              </div>
            </div>
          </div>
          <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div class="bg-mit-red h-full transition-all duration-500" [style.width.%]="(currentStep() / 5) * 100"></div>
          </div>
        </div>

        <form [formGroup]="appForm" (ngSubmit)="submitApplication()" class="space-y-8">
          <!-- Step 1: Personal Information -->
          <div *ngIf="currentStep() === 1" class="glass-panel p-8 space-y-6 animate-fade-in-up">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="col-span-2">
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Full Name</label>
                <input type="text" formControlName="fullName" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium">
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Date of Birth</label>
                <input type="date" formControlName="dob" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium">
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Gender</label>
                <select formControlName="gender" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Step 2: Academic Background -->
          <div *ngIf="currentStep() === 2" class="glass-panel p-8 space-y-6 animate-fade-in-up">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="col-span-2">
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Previous Institution</label>
                <input type="text" formControlName="previousInst" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium">
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">SSC GPA</label>
                <input type="number" step="0.01" formControlName="sscGpa" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium">
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">HSC GPA</label>
                <input type="number" step="0.01" formControlName="hscGpa" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium">
              </div>
            </div>
          </div>

          <!-- Step 3: Program Selection -->
          <div *ngIf="currentStep() === 3" class="glass-panel p-8 space-y-6 animate-fade-in-up">
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Select Faculty</label>
              <select (change)="onFacultyChange($event)" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium">
                <option value="">Select Faculty</option>
                <option *ngFor="let f of faculties()" [value]="f.id">{{ f.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Select Program</label>
              <select formControlName="programId" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium">
                <option value="">Select Program</option>
                <option *ngFor="let p of availablePrograms()" [value]="p.id">{{ p.name }}</option>
              </select>
            </div>
          </div>

          <!-- Step 4: Document Upload Simulation -->
          <div *ngIf="currentStep() === 4" class="glass-panel p-8 space-y-6 animate-fade-in-up">
            <div class="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center group hover:border-mit-red/50 transition-all">
              <div class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              </div>
              <h4 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Upload Certificates & Transcript</h4>
              <p class="text-slate-500 mb-6">Drag and drop your PDF or Image files here (Max 10MB)</p>
              <button type="button" class="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold">Select Files</button>
            </div>
            <div class="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50 rounded-2xl">
              <div class="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <div>
                <p class="text-sm font-bold text-green-800 dark:text-green-400">Academic_Documents.pdf</p>
                <p class="text-xs text-green-600 dark:text-green-500">2.4 MB • Successfully uploaded</p>
              </div>
            </div>
          </div>

          <!-- Step 5: Review & Submit -->
          <div *ngIf="currentStep() === 5" class="glass-panel p-8 space-y-8 animate-fade-in-up">
            <div class="bg-mit-red/5 p-6 rounded-2xl border border-mit-red/10">
              <h3 class="text-lg font-bold text-mit-red mb-4">Final Review</h3>
              <div class="grid grid-cols-2 gap-y-4 text-sm">
                <span class="text-slate-500">Full Name:</span> <span class="font-bold text-slate-900 dark:text-white">{{ appForm.value.fullName }}</span>
                <span class="text-slate-500">SSC/HSC GPA:</span> <span class="font-bold text-slate-900 dark:text-white">{{ appForm.value.sscGpa }} / {{ appForm.value.hscGpa }}</span>
                <span class="text-slate-500">Selected Program:</span> <span class="font-bold text-slate-900 dark:text-white">{{ getProgramName(appForm.value.programId) }}</span>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <input type="checkbox" required class="mt-1 w-5 h-5 rounded border-slate-300 text-mit-red focus:ring-mit-red">
              <p class="text-xs text-slate-500 leading-relaxed">
                I hereby declare that the information provided is true and correct to the best of my knowledge. I understand that any false statement may lead to the cancellation of my application.
              </p>
            </div>
          </div>

          <!-- Navigation -->
          <div class="flex justify-between pt-8">
            <button type="button" 
                    *ngIf="currentStep() > 1" 
                    (click)="prevStep()" 
                    class="px-10 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl font-black hover:bg-slate-50 transition-all">
              Previous
            </button>
            <div class="flex-1"></div>
            <button type="button" 
                    *ngIf="currentStep() < 5" 
                    (click)="nextStep()" 
                    class="px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">
              Next Step
            </button>
            <button type="submit" 
                    *ngIf="currentStep() === 5" 
                    [disabled]="appForm.invalid"
                    class="px-12 py-4 bg-mit-red text-white rounded-2xl font-black shadow-2xl shadow-mit-red/40 hover:scale-105 transition-all disabled:opacity-50">
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class ApplyComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  currentStep = signal(1);
  faculties = signal<any[]>([]);
  programs = signal<any[]>([]);
  availablePrograms = signal<any[]>([]);

  appForm = this.fb.group({
    fullName: ['', Validators.required],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    previousInst: ['', Validators.required],
    sscGpa: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
    hscGpa: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
    programId: ['', Validators.required]
  });

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/faculties').subscribe(data => this.faculties.set(data));
    this.http.get<any[]>('http://localhost:3000/programs').subscribe(data => this.programs.set(data));
  }

  getStepTitle() {
    const titles = ['Personal Info', 'Academic Records', 'Program Choice', 'Documents', 'Review & Submit'];
    return titles[this.currentStep() - 1];
  }

  onFacultyChange(event: any) {
    const facultyId = event.target.value;
    this.http.get<any[]>('http://localhost:3000/departments?facultyId=' + facultyId).subscribe(depts => {
      const deptIds = depts.map(d => d.id);
      this.availablePrograms.set(this.programs().filter(p => deptIds.includes(p.departmentId)));
    });
  }

  getProgramName(id: any) {
    if (!id) return 'Not Selected';
    return this.programs().find(p => p.id === id)?.name || id;
  }

  nextStep() {
    this.currentStep.update(s => s + 1);
  }

  prevStep() {
    this.currentStep.update(s => s - 1);
  }

  submitApplication() {
    if (this.appForm.valid) {
      const application = {
        ...this.appForm.value,
        id: 'APL-' + Date.now(),
        applicantId: 'APP-' + Math.floor(Math.random() * 1000),
        status: 'Pending',
        appliedDate: new Date().toISOString()
      };

      this.http.post('http://localhost:3000/applications', application).subscribe(() => {
        alert('Application submitted successfully! Your application is now under review.');
        this.router.navigate(['/admissions']);
      });
    }
  }
}
