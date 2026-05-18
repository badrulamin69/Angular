import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-exams',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Quiz & Exam Center</h1>
          <p class="text-slate-500 mt-1">Take pending quizzes and view upcoming examination schedules.</p>
        </div>
      </div>

      <div *ngIf="!activeExam()" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Pending Quizzes / Exams -->
        <div class="lg:col-span-2 space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-mit-red"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Action Required
          </h3>
          
          <div class="glass-panel p-5 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-500/10 to-transparent rounded-bl-full -z-10"></div>
            <div class="flex justify-between items-start mb-4">
              <span class="px-2.5 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-black tracking-wider rounded-md uppercase">Live Now</span>
              <span class="text-xs font-bold text-slate-500">Duration: 30 Mins</span>
            </div>
            <h4 class="font-bold text-slate-900 dark:text-white text-xl leading-tight mb-1">CS-101: Midterm Quiz 1</h4>
            <p class="text-sm text-slate-500 mb-6">Covers Chapters 1-4. Multiple choice questions only.</p>
            
            <button (click)="startExam()" class="w-full py-3 bg-mit-red hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all flex justify-center items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Start Exam
            </button>
          </div>

          <h3 class="text-lg font-bold text-slate-900 dark:text-white mt-8 mb-4">Upcoming Schedule</h3>
          <div class="glass-panel overflow-hidden">
            <div class="divide-y divide-slate-200 dark:divide-slate-800">
              <div class="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div class="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                  <span class="text-xs font-bold text-slate-500">NOV</span>
                  <span class="text-lg font-black text-slate-700 dark:text-slate-300">12</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-slate-900 dark:text-white">MTH-201: Final Exam</h4>
                  <p class="text-sm text-slate-500">Proctored Online &bull; 2 Hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Exam Guidelines -->
        <div class="space-y-4">
          <div class="glass-card p-6 bg-slate-900 text-white">
            <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Exam Integrity Rules
            </h3>
            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex gap-2 items-start">
                <div class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                <p>Ensure a stable internet connection before starting.</p>
              </li>
              <li class="flex gap-2 items-start">
                <div class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                <p>Do not switch browser tabs during live exams. Doing so will trigger an automatic flag.</p>
              </li>
              <li class="flex gap-2 items-start">
                <div class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                <p>Webcam proctoring is enabled for final examinations.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Active Exam Interface -->
      <div *ngIf="activeExam()" class="glass-panel p-8 max-w-4xl mx-auto animate-fade-in">
        <div class="flex justify-between items-center mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">CS-101: Midterm Quiz 1</h2>
            <p class="text-slate-500 font-medium">Question {{ currentQuestion() + 1 }} of {{ questions.length }}</p>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1">Time Remaining</span>
            <div class="text-2xl font-mono font-bold" [class.text-red-500]="timeRemaining() < 300" [class.text-slate-900]="timeRemaining() >= 300" [class.dark:text-white]="timeRemaining() >= 300">
              {{ formattedTime() }}
            </div>
          </div>
        </div>

        <div class="mb-8">
          <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200 leading-relaxed mb-6">
            {{ questions[currentQuestion()].text }}
          </h3>
          <div class="space-y-3">
            <label *ngFor="let option of questions[currentQuestion()].options; let i = index" 
                   class="flex items-center p-4 border rounded-xl cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
                   [ngClass]="{'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500': selectedAnswers()[currentQuestion()] === i, 'border-slate-200 dark:border-slate-700': selectedAnswers()[currentQuestion()] !== i}">
              <input type="radio" [name]="'q' + currentQuestion()" [value]="i" (change)="selectAnswer(i)" [checked]="selectedAnswers()[currentQuestion()] === i" class="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600">
              <span class="ml-3 text-slate-700 dark:text-slate-300 font-medium">{{ option }}</span>
            </label>
          </div>
        </div>

        <div class="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
          <button (click)="prevQuestion()" [disabled]="currentQuestion() === 0" class="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50">Previous</button>
          
          <button *ngIf="currentQuestion() < questions.length - 1" (click)="nextQuestion()" class="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">Next</button>
          
          <button *ngIf="currentQuestion() === questions.length - 1" (click)="submitExam()" class="px-8 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 transition-all flex items-center gap-2 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  `
})
export class StudentExamsComponent {
  activeExam = signal(false);
  currentQuestion = signal(0);
  selectedAnswers = signal<number[]>([]);
  timeRemaining = signal(1800); // 30 minutes in seconds
  timerInterval: any;

  questions = [
    { text: 'Which data structure uses LIFO (Last In First Out)?', options: ['Queue', 'Stack', 'Tree', 'Graph'] },
    { text: 'What is the time complexity of binary search?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'] },
    { text: 'Which of the following is a stable sorting algorithm?', options: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Selection Sort'] }
  ];

  formattedTime = computed(() => {
    const m = Math.floor(this.timeRemaining() / 60);
    const s = this.timeRemaining() % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  });

  startExam() {
    this.activeExam.set(true);
    this.selectedAnswers.set(new Array(this.questions.length).fill(null));
    this.timerInterval = setInterval(() => {
      if (this.timeRemaining() > 0) {
        this.timeRemaining.update(t => t - 1);
      } else {
        this.submitExam();
      }
    }, 1000);
  }

  selectAnswer(index: number) {
    const answers = [...this.selectedAnswers()];
    answers[this.currentQuestion()] = index;
    this.selectedAnswers.set(answers);
  }

  nextQuestion() {
    if (this.currentQuestion() < this.questions.length - 1) {
      this.currentQuestion.update(q => q + 1);
    }
  }

  prevQuestion() {
    if (this.currentQuestion() > 0) {
      this.currentQuestion.update(q => q - 1);
    }
  }

  submitExam() {
    clearInterval(this.timerInterval);
    alert('Exam submitted successfully! Results will be published soon.');
    this.activeExam.set(false);
    this.currentQuestion.set(0);
    this.timeRemaining.set(1800);
  }
}
