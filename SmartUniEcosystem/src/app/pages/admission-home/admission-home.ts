import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admission-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <!-- Hero Section -->
      <section class="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-4">
        <!-- Animated Background -->
        <div class="absolute inset-0 z-0">
          <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-mit-red/10 rounded-full blur-[120px] animate-pulse"></div>
          <div class="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[140px] animate-pulse delay-1000"></div>
        </div>

        <div class="container mx-auto max-w-7xl relative z-10 text-center">
          <span class="inline-flex items-center px-4 py-1.5 rounded-full bg-mit-red/10 text-mit-red text-xs font-black uppercase tracking-[0.2em] mb-8 animate-fade-in">
            Admission Fall 2026 is Open
          </span>
          <h1 class="text-5xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 animate-fade-in-up">
            Start Your Journey Toward an <br>
            <span class="bg-gradient-to-r from-mit-red to-primary-600 bg-clip-text text-transparent">Intelligent Digital Campus</span>
          </h1>
          <p class="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 animate-fade-in-up delay-100">
            Join a world-class academic ecosystem powered by AI, data-driven research, and MIT-inspired innovation. Your future in technology and leadership begins here.
          </p>
          <div class="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-200">
            <a routerLink="/apply" class="px-10 py-5 bg-mit-red text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-mit-red/40 flex items-center justify-center gap-3">
              Apply Now
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <a routerLink="/programs" class="px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl">
              Explore Programs
            </a>
          </div>
        </div>
      </section>

      <!-- Stats Grid -->
      <section class="py-12 px-4 relative z-10">
        <div class="container mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div *ngFor="let stat of stats()" class="glass-panel p-8 text-center animate-fade-in-up">
            <h4 class="text-4xl font-black text-slate-900 dark:text-white mb-2">{{ stat.value }}</h4>
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest">{{ stat.label }}</p>
          </div>
        </div>
      </section>

      <!-- Enrollment Timeline -->
      <section class="py-32 px-4">
        <div class="container mx-auto max-w-6xl">
          <div class="text-center mb-20">
            <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Admission Timeline</h2>
            <p class="text-slate-500 max-w-xl mx-auto">Follow our streamlined enrollment lifecycle designed for the modern digital student.</p>
          </div>

          <div class="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            <div *ngFor="let step of timeline(); let i = index" class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-fade-in-up">
              <!-- Icon -->
              <div class="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 dark:bg-slate-800 dark:border-slate-900">
                <span class="text-xs font-bold">{{ i + 1 }}</span>
              </div>
              <!-- Card -->
              <div class="w-[calc(100%-4rem)] md:w-[45%] glass-panel p-6 shadow-xl hover:border-mit-red/50 transition-all cursor-default">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-bold text-slate-900 dark:text-white">{{ step.title }}</h4>
                  <span class="text-[10px] font-black text-mit-red uppercase tracking-widest">{{ step.date }}</span>
                </div>
                <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Footer -->
      <section class="py-24 px-4 bg-slate-900 text-white overflow-hidden relative">
        <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(163,31,52,0.3),transparent)]"></div>
        <div class="container mx-auto max-w-5xl relative z-10 text-center">
          <h2 class="text-4xl md:text-6xl font-black tracking-tighter mb-8">Ready to Architect Your Future?</h2>
          <p class="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">Start your application today and join the next generation of global innovators at Smart University.</p>
          <button routerLink="/apply" class="px-12 py-6 bg-white text-slate-900 rounded-full font-black text-xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-4 mx-auto">
            Apply Now
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AdmissionHome implements OnInit {
  stats = signal([
    { label: 'Academic Programs', value: '42+' },
    { label: 'Global Rank', value: '#12' },
    { label: 'Research Funds', value: '$850M' },
    { label: 'Alumni Network', value: '1.2M' }
  ]);

  timeline = signal([
    { title: 'Online Application', date: 'May 1 - Jun 30', desc: 'Submit your personal and academic information through our digital portal.' },
    { title: 'Admission Test', date: 'Jul 15', desc: 'Participate in our AI-proctored entrance examination covering core aptitudes.' },
    { title: 'Faculty Interview', date: 'Aug 01 - Aug 10', desc: 'Engage in academic discussions with our world-class faculty board.' },
    { title: 'Final Approval', date: 'Aug 20', desc: 'Receive your digital offer letter and university credentials.' },
    { title: 'Enrollment & Payment', date: 'Sep 01', desc: 'Complete your financial activation and become a certified student.' }
  ]);

  ngOnInit() {}
}
