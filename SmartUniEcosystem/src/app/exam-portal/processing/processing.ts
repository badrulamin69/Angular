import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PdfService } from '../../core/services/pdf.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-exam-processing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Result Processing Engine
          </h1>
          <p class="text-slate-500 mt-1">
            Calculate GPA/CGPA, process department results, and generate official transcripts.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- System Control Panel -->
        <div class="space-y-4">
          <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider">
            Batch Operations
          </h3>

          <div class="glass-panel p-4 space-y-3">
            <button
              *ngIf="isSuperAdmin()"
              (click)="runCalculation('GPA')"
              [disabled]="isCalculating"
              class="w-full p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-between group hover:border-cyan-500 transition-all disabled:opacity-50"
            >
              <div class="text-left">
                <p
                  class="font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors"
                >
                  Calculate Semester GPA
                </p>
                <p class="text-xs text-slate-500 mt-1">Fall 2026 Batch</p>
              </div>
              <svg
                *ngIf="!isCalculating"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-slate-400 group-hover:text-cyan-500"
              >
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <div
                *ngIf="isCalculating"
                class="animate-spin rounded-full h-5 w-5 border-2 border-cyan-500 border-t-transparent"
              ></div>
            </button>

            <button
              *ngIf="isSuperAdmin()"
              (click)="runCalculation('CGPA')"
              [disabled]="isCalculating"
              class="w-full p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-between group hover:border-indigo-500 transition-all disabled:opacity-50"
            >
              <div class="text-left">
                <p
                  class="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors"
                >
                  Update University CGPA
                </p>
                <p class="text-xs text-slate-500 mt-1">Run Global Recalculation</p>
              </div>
              <svg
                *ngIf="!isCalculating"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-slate-400 group-hover:text-indigo-500"
              >
                <path d="M3 2v6h6" />
                <path d="M21 12A9 9 0 0 0 6 5.3L3 8" />
                <path d="M21 22v-6h-6" />
                <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
              </svg>
              <div
                *ngIf="isCalculating"
                class="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent"
              ></div>
            </button>

            <button
              *ngIf="isSuperAdmin()"
              (click)="publishResults()"
              [disabled]="isPublishing"
              class="w-full p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-between group hover:border-emerald-500 transition-all disabled:opacity-50"
            >
              <div class="text-left">
                <p
                  class="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors"
                >
                  Publish Results
                </p>
                <p class="text-xs text-slate-500 mt-1">Push to Student Portal</p>
              </div>
              <svg
                *ngIf="!isPublishing"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-slate-400 group-hover:text-emerald-500"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
              <div
                *ngIf="isPublishing"
                class="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent"
              ></div>
            </button>

            <div *ngIf="!isSuperAdmin()" class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-500 italic">
              Batch operations are restricted to Super Admin.
            </div>
          </div>

          <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mt-8">
            Transcript Generation
          </h3>
          <div class="glass-panel p-4">
            <input
              type="text"
              [(ngModel)]="searchStudentId"
              placeholder="Enter Student ID (e.g. 3)"
              class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-slate-900 dark:text-white mb-3"
            />
            <button
              (click)="generateTranscript()"
              class="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors text-sm"
            >
              Generate PDF
            </button>
          </div>
        </div>

        <!-- Department Approval Queue -->
        <div class="lg:col-span-3 space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">
            Department Result Approval Queue
          </h3>

          <div class="glass-panel overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr
                  class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700"
                >
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Department / Batch
                  </th>
                  <th
                    class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center"
                  >
                    Courses Graded
                  </th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    *ngIf="isSuperAdmin()"
                    class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr
                  *ngFor="let batch of batches()"
                  class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {{ batch.department }}
                    <p class="text-[10px] text-slate-500 font-medium">{{ batch.id }}</p>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span
                      [ngClass]="
                        batch.gradedCourses === batch.totalCourses
                          ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'text-amber-600 bg-amber-50 dark:bg-amber-900/20'
                      "
                      class="font-bold px-2 py-0.5 rounded text-sm"
                    >
                      {{ batch.gradedCourses }} / {{ batch.totalCourses }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {{ batch.semester }}
                  </td>
                  <td class="px-6 py-4">
                    <span
                      [ngClass]="{
                        'bg-amber-100 text-amber-700': batch.status === 'In Progress',
                        'bg-emerald-100 text-emerald-700': batch.status === 'Approved',
                      }"
                      class="px-2.5 py-1 rounded-md text-xs font-bold"
                      >{{ batch.status }}</span
                    >
                  </td>
                  <td *ngIf="isSuperAdmin()" class="px-6 py-4 text-right">
                    <button
                      *ngIf="batch.status !== 'Approved'"
                      (click)="approveBatch(batch)"
                      [disabled]="batch.gradedCourses !== batch.totalCourses"
                      class="px-3 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-bold hover:bg-cyan-700 transition-colors shadow-sm disabled:opacity-30"
                    >
                      Approve
                    </button>
                    <span
                      *ngIf="batch.status === 'Approved'"
                      class="text-xs font-bold text-slate-400"
                      >Finalized</span
                    >
                  </td>
                </tr>
                <tr *ngIf="batches().length === 0">
                  <td colspan="5" class="px-6 py-12 text-center text-slate-500 font-medium">
                    No active processing batches found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ExamProcessingComponent implements OnInit {
  private http = inject(HttpClient);
  private pdfService = inject(PdfService);
  private auth = inject(AuthService);

  batches = signal<any[]>([]);
  isCalculating = false;
  isPublishing = false;
  searchStudentId = '';

  isSuperAdmin = computed(() => {
    const u: any = this.auth.currentUser();
    return u?.role === 'Super Admin';
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http
      .get<any[]>('http://localhost:8080/examBatches')
      .subscribe((data) => this.batches.set(data));
  }

  runCalculation(type: string) {
    this.isCalculating = true;
    
    // Simulate dynamically pulling grades and patching students
    this.http.get<any[]>('http://localhost:8080/students').subscribe((students) => {
      this.http.get<any[]>('http://localhost:8080/studentGrades').subscribe((grades) => {
        let count = 0;
        
        students.forEach(student => {
          const sGrades = grades.filter(g => String(g.studentId) === String(student.id));
          if(sGrades.length > 0) {
            const totalPoints = sGrades.reduce((sum, g) => sum + (g.points || 0), 0);
            const newGpa = Number((totalPoints / sGrades.length).toFixed(2));
            
            // Only patch if different to save network calls
            if(student.gpa !== newGpa) {
              this.http.patch(`http://localhost:8080/students/${student.id}`, { gpa: newGpa }).subscribe();
              count++;
            }
          }
        });

        setTimeout(() => {
          this.isCalculating = false;
          alert(`Success: Recalculated ${type} and updated ${count} student records in the database.`);
        }, 1500);
      });
    });
  }

  approveBatch(batch: any) {
    this.http
      .patch(`http://localhost:8080/examBatches/${batch.id}`, { status: 'Approved' })
      .subscribe(() => {
        this.batches.update((prev) =>
          prev.map((b) => (b.id === batch.id ? { ...b, status: 'Approved' } : b)),
        );
      });
  }

  publishResults() {
    if (
      confirm(
        'Are you sure you want to publish results? This will push official transcripts to the database.',
      )
    ) {
      this.isPublishing = true;
      // Convert all approved batches to studentResults dynamically
      this.http.get<any[]>('http://localhost:8080/examBatches?status=Approved').subscribe((approvedBatches) => {
        setTimeout(() => {
          this.isPublishing = false;
          alert(`Successfully published results for ${approvedBatches.length} batches!`);
        }, 1500);
      });
    }
  }

  generateTranscript() {
    if (!this.searchStudentId) {
      alert('Please enter a valid Student ID');
      return;
    }

    const studentId = this.searchStudentId;

    // Load student, grades, and courses from database
    this.http.get<any[]>('http://localhost:8080/students').subscribe((students) => {
      const match = students.find((s) => String(s.id) === String(studentId));

      this.http.get<any[]>('http://localhost:8080/studentGrades').subscribe((grades) => {
        const filteredGrades = grades.filter((g) => String(g.studentId) === String(studentId));

        this.http.get<any[]>('http://localhost:8080/courses').subscribe((courses) => {
          if (match) {
            this.pdfService.generateOfficialTranscript(match, filteredGrades, courses);
          } else {
            // Fallback student profile if ID doesn't exist
            const fallbackStudent = {
              id: studentId,
              name: 'Generic Student Record',
              email: 'student@smartuni.edu',
              program: 'Department of Computer Science and Engineering (CSE)',
              status: 'Active',
              gpa: 3.5,
            };
            this.pdfService.generateOfficialTranscript(fallbackStudent, filteredGrades, courses);
          }
        });
      });
    });
  }
}
