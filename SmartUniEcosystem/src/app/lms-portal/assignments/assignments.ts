import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-lms-assignments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:items-center md:flex-row justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Academic Assignments</h1>
          <p class="text-slate-500 mt-1">View, track, and submit your course assignments.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Assignments List -->
        <div class="lg:col-span-2 space-y-4">
          <div *ngFor="let assign of assignments()" class="glass-panel p-6 hover:shadow-lg transition-all relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-100 dark:from-slate-800 to-transparent rounded-bl-full -z-10 group-hover:from-sky-500/10 transition-colors"></div>
            
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-[10px] font-black uppercase tracking-widest rounded">{{ assign.courseId }}</span>
                  <span class="text-xs font-bold text-slate-400">Due: {{ assign.dueDate }}</span>
                </div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ assign.title }}</h3>
                <p class="text-sm text-slate-500">Maximum Points: {{ assign.totalPoints }}</p>
              </div>

              <div class="flex items-center gap-3">
                <div *ngIf="getSubmission(assign.id); else noSubmission" class="text-right">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Submitted
                  </span>
                  <p class="text-[10px] font-bold text-slate-400 mt-1">Grade: {{ getSubmission(assign.id).grade || 'Pending' }}</p>
                </div>
                <ng-template #noSubmission>
                  <button (click)="submitAssignment(assign.id)" class="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all">
                    Submit Work
                  </button>
                </ng-template>
              </div>
            </div>
          </div>

          <div *ngIf="assignments().length === 0" class="p-12 text-center text-slate-500 glass-panel">
            No assignments found for your current courses.
          </div>
        </div>

        <!-- Sidebar Stats -->
        <div class="space-y-4">
          <div class="glass-card p-6 border-b-4 border-b-sky-500">
            <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Completion Rate</p>
            <h3 class="text-4xl font-black text-slate-900 dark:text-white">{{ completionPercentage() }}%</h3>
            <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
              <div class="bg-sky-500 h-full rounded-full" [style.width.%]="completionPercentage()"></div>
            </div>
          </div>

          <div class="glass-panel p-5">
            <h4 class="font-bold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Upcoming Deadlines</h4>
            <div class="space-y-3">
              <div *ngFor="let d of upcomingDeadlines()" class="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer">
                <div class="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex flex-col items-center justify-center shrink-0">
                  <span class="text-[10px] font-black leading-none">{{ d.dueDate | date:'MMM' }}</span>
                  <span class="text-lg font-black leading-none">{{ d.dueDate | date:'d' }}</span>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{{ d.title }}</p>
                  <p class="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{{ d.courseId }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LmsAssignmentsComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  user = computed(() => this.authService.currentUser());

  assignments = signal<any[]>([]);
  submissions = signal<any[]>([]);

  completionPercentage = computed(() => {
    if (this.assignments().length === 0) return 0;
    return Math.round((this.submissions().length / this.assignments().length) * 100);
  });

  upcomingDeadlines = computed(() => {
    return [...this.assignments()]
      .filter(a => !this.getSubmission(a.id))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3);
  });

  ngOnInit() {
    const currentUser = this.user();
    if (!currentUser) return;

    // Fetch enrolled courses first to filter assignments
    this.http.get<any[]>('http://localhost:3000/enrollments').subscribe(enrolls => {
      const myCourseIds = enrolls.filter(e => e.studentId === currentUser.id).map(e => e.courseId);
      
      this.http.get<any[]>('http://localhost:3000/assignments').subscribe(data => {
        this.assignments.set(data.filter(a => myCourseIds.includes(a.courseId)));
      });

      this.http.get<any[]>('http://localhost:3000/submissions').subscribe(subs => {
        this.submissions.set(subs.filter(s => s.studentId === currentUser.id));
      });
    });
  }

  getSubmission(assignmentId: string) {
    return this.submissions().find(s => s.assignmentId === assignmentId);
  }

  submitAssignment(assignmentId: string) {
    const studentId = this.user()?.id;
    if (!studentId) return;

    const sub = {
      assignmentId,
      studentId,
      submissionDate: new Date().toISOString().split('T')[0],
      fileUrl: 'submitted_work.pdf',
      grade: null
    };

    this.http.post<any>('http://localhost:3000/submissions', sub).subscribe(res => {
      this.submissions.update(s => [...s, res]);
      alert('Assignment submitted successfully!');
    });
  }
}
