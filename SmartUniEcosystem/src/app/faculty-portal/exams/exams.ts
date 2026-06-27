import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacultyService } from '../../core/services/faculty.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-faculty-exams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Exam & Quiz Builder
          </h1>
          <p class="text-slate-500 mt-1">
            Design assessments, manage question banks, and schedule exams.
          </p>
        </div>
        <button
          (click)="createAssessment()"
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
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Create Assessment
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Question Bank -->
        <div class="lg:col-span-1 space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Question Bank</h3>
          <div class="glass-panel p-4 space-y-3">
            <div class="relative w-full mb-4">
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
                placeholder="Search bank..."
                class="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div
              *ngFor="let q of questionBank()"
              (click)="addQuestion(q)"
              class="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 cursor-pointer transition-colors group bg-white dark:bg-slate-900"
            >
              <div class="flex justify-between items-start mb-1">
                <span
                  class="text-[10px] font-bold uppercase tracking-wider"
                  [class.text-indigo-500]="q.type === 'MCQ'"
                  [class.text-emerald-500]="q.type === 'TF'"
                  >{{ q.type }}</span
                >
                <span class="text-[10px] font-bold text-slate-400">{{ q.difficulty }}</span>
              </div>
              <p class="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                {{ q.text }}
              </p>
            </div>
          </div>
        </div>

        <!-- Exam Builder Workspace -->
        <div class="lg:col-span-2 space-y-4">
          <div class="glass-panel p-6">
            <input
              type="text"
              [(ngModel)]="examTitle"
              class="w-full text-2xl font-black bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-300 mb-4 focus:ring-0 px-0"
            />

            <div class="flex gap-4 mb-8">
              <div class="flex-1">
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1"
                  >Target Course</label
                >
                <select
                  [(ngModel)]="selectedCourseId"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  <option *ngFor="let course of courses()" [value]="course.id">
                    {{ course.code }}: {{ course.title }}
                  </option>
                </select>
              </div>
              <div class="flex-1">
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1"
                  >Duration (Mins)</label
                >
                <input
                  type="number"
                  [(ngModel)]="examDuration"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-medium text-slate-700 dark:text-slate-300"
                />
              </div>
            </div>

            <div class="space-y-4">
              <h4
                class="font-bold text-slate-900 dark:text-white flex items-center justify-between"
              >
                Exam Questions ({{ selectedQuestions().length }})
                <span class="text-sm font-medium text-slate-500"
                  >Total Points: {{ totalPoints() }}</span
                >
              </h4>

              <div
                *ngFor="let q of selectedQuestions(); let i = index"
                class="p-4 border border-slate-200 dark:border-slate-700 rounded-xl relative group bg-slate-50 dark:bg-slate-800/50"
              >
                <button
                  (click)="removeQuestion(i)"
                  class="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
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
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
                <div class="flex justify-between items-start mb-2">
                  <span
                    class="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded"
                    >Q{{ i + 1 }}. {{ q.type }}</span
                  >
                  <span class="text-xs font-bold text-slate-500">{{ q.points }} Points</span>
                </div>
                <p class="font-bold text-slate-900 dark:text-white mb-3">{{ q.text }}</p>
                <div class="space-y-2">
                  <div
                    *ngFor="let opt of q.options"
                    class="flex items-center gap-2 p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                  >
                    <input
                      type="radio"
                      disabled
                      [checked]="opt.isCorrect"
                      class="text-indigo-600"
                    />
                    <span
                      class="text-sm text-slate-600 dark:text-slate-300"
                      [class.font-bold]="opt.isCorrect"
                      [class.text-green-600]="opt.isCorrect"
                      >{{ opt.label }} <span *ngIf="opt.isCorrect">(Correct)</span></span
                    >
                  </div>
                </div>
              </div>
              <div
                *ngIf="selectedQuestions().length === 0"
                class="text-center py-12 text-slate-500 border-2 border-dashed rounded-xl"
              >
                Click on questions from the bank to add them to your exam.
              </div>
            </div>

            <div
              class="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3"
            >
              <button
                class="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Save Draft
              </button>
              <button
                (click)="scheduleExam()"
                class="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
              >
                Schedule Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FacultyExamsComponent implements OnInit {
  private facultyService = inject(FacultyService);
  private authService = inject(AuthService);
  user = computed(() => this.authService.currentUser());

  courses = signal<any[]>([]);
  selectedCourseId = signal<string>('');
  examTitle = signal('New Assessment');
  examDuration = signal(60);

  questionBank = signal<any[]>([
    {
      id: 1,
      type: 'MCQ',
      difficulty: 'Hard',
      text: 'What is the worst-case time complexity of Quick Sort?',
      points: 10,
      options: [
        { label: 'O(n)', isCorrect: false },
        { label: 'O(n log n)', isCorrect: false },
        { label: 'O(n^2)', isCorrect: true },
      ],
    },
    {
      id: 2,
      type: 'TF',
      difficulty: 'Easy',
      text: 'A binary search tree must be perfectly balanced.',
      points: 5,
      options: [
        { label: 'True', isCorrect: false },
        { label: 'False', isCorrect: true },
      ],
    },
    {
      id: 3,
      type: 'MCQ',
      difficulty: 'Medium',
      text: 'Which of the following is not a stable sorting algorithm?',
      points: 10,
      options: [
        { label: 'Merge Sort', isCorrect: false },
        { label: 'Selection Sort', isCorrect: true },
        { label: 'Insertion Sort', isCorrect: false },
      ],
    },
  ]);

  selectedQuestions = signal<any[]>([]);
  totalPoints = computed(() => this.selectedQuestions().reduce((acc, q) => acc + q.points, 0));

  ngOnInit() {
    const faculty = this.user();
    if (!faculty) return;

    this.facultyService.getCourses(faculty.id).subscribe((courses) => {
      this.courses.set(courses);
      if (courses.length > 0) {
        this.selectedCourseId.set(courses[0].id);
      }
    });
  }

  addQuestion(q: any) {
    this.selectedQuestions.update((qs) => [...qs, q]);
  }

  removeQuestion(index: number) {
    this.selectedQuestions.update((qs) => qs.filter((_, i) => i !== index));
  }

  createAssessment() {
    this.examTitle.set('New Assessment');
    this.selectedQuestions.set([]);
  }

  scheduleExam() {
    alert(`Exam "${this.examTitle()}" scheduled for course ${this.selectedCourseId()}!`);
  }
}
