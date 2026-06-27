import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PdfService } from '../../core/services/pdf.service';

@Component({
  selector: 'app-platform',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pt-32 pb-24 bg-brand-light dark:bg-brand-dark overflow-hidden">
      <div class="container mx-auto px-4 md:px-6 lg:px-8">
        <!-- Hero Section -->
        <div class="text-center max-w-4xl mx-auto mb-20 animate-fade-in-up">
          <h2
            class="text-indigo-600 dark:text-primary-400 text-sm font-black uppercase tracking-[0.2em] mb-4"
          >
            The Unified Ecosystem
          </h2>
          <h1
            class="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight"
          >
            A Single Source of Truth for Your Entire Institution
          </h1>
          <p class="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From student admissions to financial audits and real-time learning analytics—manage
            every facet of university life in one secure, AI-powered platform.
          </p>
        </div>

        <!-- Bento Grid Features -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <!-- ERP Central -->
          <div
            class="md:col-span-2 glass-card rounded-3xl p-8 hover:shadow-2xl transition-all group overflow-hidden relative"
          >
            <div
              class="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/10 rounded-full group-hover:scale-125 transition-transform duration-700"
            ></div>
            <div class="relative z-10">
              <div
                class="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/30"
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
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                  <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Centralized ERP
              </h3>
              <p class="text-slate-600 dark:text-slate-400 mb-6">
                Manage departments, faculties, and human resources with enterprise-grade precision.
                Our centralized system ensures data integrity across all administrative layers.
              </p>
              <div class="flex gap-4">
                <span
                  class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-lg uppercase tracking-wider"
                  >Payroll</span
                >
                <span
                  class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-lg uppercase tracking-wider"
                  >Inventory</span
                >
                <span
                  class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-lg uppercase tracking-wider"
                  >Audit Logs</span
                >
              </div>
            </div>
          </div>

          <!-- Real-time Analytics -->
          <div
            class="glass-card rounded-3xl p-8 bg-slate-900 text-white border-none group overflow-hidden"
          >
            <div
              class="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30"
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
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <path d="M22 12A10 10 0 0 0 12 2v10z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4">Deep Analytics</h3>
            <p class="text-slate-400 text-sm mb-8">
              Predict student performance and institutional growth with our predictive AI engine.
              Turn raw data into strategic insights.
            </p>
            <div class="space-y-4">
              <div class="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full w-[80%]"></div>
              </div>
              <div class="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div class="bg-indigo-500 h-full w-[60%]"></div>
              </div>
              <div class="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div class="bg-rose-500 h-full w-[40%]"></div>
              </div>
            </div>
          </div>

          <!-- LMS Next Gen -->
          <div class="glass-card rounded-3xl p-8 group hover:-translate-y-2 transition-all">
            <div
              class="w-12 h-12 rounded-2xl bg-mit-red text-white flex items-center justify-center mb-6 shadow-lg shadow-mit-red/30"
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
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Adaptive LMS</h3>
            <p class="text-slate-600 dark:text-slate-400">
              A learning environment that grows with the student. Collaborative discussions, secure
              assignments, and live classrooms.
            </p>
          </div>

          <!-- Financial Suite -->
          <div
            class="md:col-span-2 glass-card rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center border border-emerald-500/20 bg-emerald-500/[0.02]"
          >
            <div class="w-full md:w-1/2">
              <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Transparent Treasury
              </h3>
              <p class="text-slate-600 dark:text-slate-400 mb-6">
                Automated billing, dynamic scholarship allocation, and multi-currency support for
                international tuition fees.
              </p>
              <div class="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  class="text-emerald-600 font-bold flex items-center gap-2 group"
                  (click)="navigateTo('/finance')"
                >
                  Explore Finance Module
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
                    class="group-hover:translate-x-1 transition-transform"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="bg-emerald-600 text-white px-4 py-2 rounded-xl shadow hover:bg-emerald-700 transition"
                  (click)="downloadPlatformSummary()"
                >
                  Download Module PDF
                </button>
              </div>
            </div>
            <div class="w-full md:w-1/2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl">
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <div class="w-24 h-3 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
                  <div class="w-12 h-3 bg-emerald-500 rounded-full"></div>
                </div>
                <div class="flex justify-between items-center">
                  <div class="w-32 h-3 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
                  <div class="w-16 h-3 bg-emerald-500 rounded-full"></div>
                </div>
                <div class="flex justify-between items-center">
                  <div class="w-20 h-3 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
                  <div class="w-10 h-3 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PlatformComponent {
  private router = inject(Router);
  private pdfService = inject(PdfService);

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  downloadPlatformSummary() {
    const modules = [
      {
        title: 'Centralized ERP',
        description:
          'Manage departments, faculties, and human resources with enterprise-grade precision and unified administrative controls.',
      },
      {
        title: 'Deep Analytics',
        description:
          'Predict student performance and institutional growth with real-time dashboards and AI-driven insights.',
      },
      {
        title: 'Adaptive LMS',
        description:
          'A flexible learning environment with collaborative discussions, secure assignments, and live classroom experiences.',
      },
      {
        title: 'Transparent Treasury',
        description:
          'Automated billing, scholarship management, and multi-currency tuition processing for seamless finance operations.',
      },
    ];

    this.pdfService.generateExecutiveAnalyticsSummary();
  }
}
