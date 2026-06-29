import { Component, signal, inject, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-student-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-955 px-4">
      <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Form Section -->
        <div class="glass-panel p-8 md:p-12 animate-fade-in-up">
          <div class="mb-10">
            <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Institutional Registration
            </h1>
            <p class="text-slate-500 mt-2 font-medium">
              Complete your academic profile to generate your official student credentials and
              enrollment receipt.
            </p>
          </div>

          <form [formGroup]="regForm" (ngSubmit)="onFormSubmit()" class="space-y-6">
            <div class="space-y-6">
              <div>
                <label
                  class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2"
                  >Full Name</label
                >
                <input
                  type="text"
                  formControlName="fullName"
                  placeholder="e.g. Badrul Amin"
                  class="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium transition-all shadow-sm"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2"
                    >Email Address</label
                  >
                  <input
                    type="email"
                    formControlName="email"
                    placeholder="student@university.edu"
                    class="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label
                    class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2"
                    >Phone Number</label
                  >
                  <input
                    type="tel"
                    formControlName="phone"
                    placeholder="+880 1709-628913"
                    class="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium transition-all shadow-sm"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2"
                    >Date of Birth</label
                  >
                  <input
                    type="date"
                    formControlName="dob"
                    class="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label
                    class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2"
                    >Academic Department</label
                  >
                  <select
                    formControlName="department"
                    class="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium transition-all shadow-sm"
                  >
                    <option value="">Select Dept</option>
                    <option *ngFor="let dept of departments()" [value]="dept.name">
                      {{ dept.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div class="pt-6">
              <button
                type="submit"
                [disabled]="regForm.invalid || isGenerating()"
                class="w-full py-5 bg-mit-red text-white rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-mit-red/40 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
              >
                <svg
                  *ngIf="isGenerating()"
                  class="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ isGenerating() ? 'Processing Receipt...' : 'Generate & Download Official PDF' }}
              </button>
            </div>
          </form>
        </div>

        <!-- ID Card Preview Section -->
        <div class="flex flex-col items-center justify-center space-y-8 animate-fade-in delay-200">
          <div class="relative group">
            <!-- Animated Background Glow -->
            <div
              class="absolute -inset-1 bg-gradient-to-r from-mit-red to-primary-600 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"
            ></div>

            <div
              #idCard
              class="w-[380px] h-[520px] rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl overflow-hidden relative border border-slate-100 dark:border-slate-800 z-10 transition-transform duration-500 group-hover:scale-[1.01]"
            >
              <!-- MIT Red Top Header -->
              <div class="h-36 bg-mit-red relative flex flex-col items-center justify-center pt-4">
                <div
                  class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md mb-2"
                >
                  <span class="text-white font-black text-xl">S</span>
                </div>
                <p class="text-[10px] font-black uppercase tracking-[0.4em] text-white opacity-80">
                  University Management
                </p>
                <h4 class="text-2xl font-black tracking-tighter text-white">STUDENT ID</h4>
              </div>

              <!-- Profile Photo Placeholder -->
              <div
                class="absolute top-24 left-1/2 -translate-x-1/2 w-36 h-36 rounded-[2rem] bg-slate-50 dark:bg-slate-800 border-4 border-white dark:border-slate-900 overflow-hidden flex items-center justify-center shadow-xl z-20"
              >
                <svg
                  xmlns="http://www.w3.org/205"
                  width="70"
                  height="70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-slate-300"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              <!-- Details -->
              <div class="mt-28 px-10 text-center">
                <h3 class="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-1">
                  {{ regForm.value.fullName || 'BADRUL AMIN' }}
                </h3>
                <p class="text-xs font-black text-mit-red uppercase tracking-widest mb-10">
                  {{ regForm.value.department || 'ACADEMIC DEPARTMENT' }}
                </p>

                <div
                  class="space-y-5 text-left border-t border-slate-100 dark:border-slate-800 pt-8"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-slate-400"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Student Email
                      </p>
                      <p
                        class="text-[13px] font-bold text-slate-700 dark:text-slate-300 truncate w-48"
                      >
                        {{ regForm.value.email || 'student@university.edu' }}
                      </p>
                    </div>
                  </div>

                  <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="text-slate-400"
                        >
                          <path
                            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          Phone
                        </p>
                        <p class="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                          {{ regForm.value.phone || '+880 1709-628913' }}
                        </p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Date of Birth
                      </p>
                      <p class="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                        {{ regForm.value.dob || '2026-05-18' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- QR Code Area -->
              <div class="absolute bottom-8 right-8">
                <div
                  class="w-12 h-12 border-2 border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center opacity-40"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect width="5" height="5" x="3" y="3" rx="1" />
                    <rect width="5" height="5" x="16" y="3" rx="1" />
                    <rect width="5" height="5" x="3" y="16" rx="1" />
                    <path d="M21 16V3" />
                    <path d="M3 21h18" />
                    <path d="M10 10v4h4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div
            class="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm max-w-[380px]"
          >
            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <p class="text-[10px] text-slate-500 font-black uppercase tracking-widest">
              Official Registration Active
            </p>
          </div>
        </div>
      </div>

      <!-- HIDDEN PRINTABLE RECEIPT (A4 FORMAT) -->
      <div style="position: absolute; left: -9999px; top: -9999px;">
        <div
          #printReceipt
          class="bg-white p-16"
          style="width: 794px; min-height: 1123px; color: #0f172a; font-family: sans-serif;"
        >
          <!-- Header -->
          <div class="flex justify-between items-start border-b-2 border-mit-red pb-8 mb-12">
            <div class="flex items-center gap-4">
              <div
                class="w-16 h-16 bg-mit-red rounded-xl flex items-center justify-center text-white text-3xl font-black"
              >
                S
              </div>
              <div>
                <h1 class="text-2xl font-black tracking-tight uppercase">Smart University</h1>
                <p class="text-sm font-bold text-slate-500 tracking-[0.2em]">
                  OFFICIAL REGISTRATION RECEIPT
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xs font-black text-slate-400 uppercase mb-1">Receipt No</p>
              <p class="text-lg font-black text-mit-red">#REG-{{ receiptNo() }}</p>
              <p class="text-xs font-bold text-slate-500 mt-2">Date: {{ today() }}</p>
            </div>
          </div>

          <!-- Body -->
          <div class="space-y-12">
            <div>
              <h3
                class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2"
              >
                Student Information
              </h3>
              <div class="grid grid-cols-2 gap-y-6">
                <div>
                  <p class="text-[10px] font-black text-slate-400 uppercase">Full Name</p>
                  <p class="text-base font-bold">{{ regForm.value.fullName }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-black text-slate-400 uppercase">Academic Department</p>
                  <p class="text-base font-bold">{{ regForm.value.department }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-black text-slate-400 uppercase">Contact Email</p>
                  <p class="text-base font-bold">{{ regForm.value.email }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-black text-slate-400 uppercase">Contact Phone</p>
                  <p class="text-base font-bold">{{ regForm.value.phone }}</p>
                </div>
              </div>
            </div>

            <div>
              <h3
                class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2"
              >
                Institutional Credentials
              </h3>
              <div
                class="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between"
              >
                <div class="space-y-4">
                  <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase">
                      System ID Card Status
                    </p>
                    <p class="text-sm font-black text-green-600 uppercase tracking-wider">
                      Generated & Activated
                    </p>
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase">Enrollment Status</p>
                    <p class="text-sm font-black text-slate-900 uppercase tracking-wider">
                      Active Academic Year 2026-27
                    </p>
                  </div>
                </div>
                <!-- Mini QR -->
                <div
                  class="w-24 h-24 border border-slate-200 rounded-2xl flex items-center justify-center bg-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-slate-300"
                  >
                    <rect width="5" height="5" x="3" y="3" rx="1" />
                    <rect width="5" height="5" x="16" y="3" rx="1" />
                    <rect width="5" height="5" x="3" y="16" rx="1" />
                    <path d="M21 16V3" />
                    <path d="M3 21h18" />
                    <path d="M10 10v4h4" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="pt-12">
              <div class="border-2 border-slate-900 p-8 rounded-3xl">
                <p class="text-[10px] font-black text-slate-400 uppercase mb-4">
                  Official Declaration
                </p>
                <p class="text-xs leading-relaxed text-slate-600 italic">
                  "This document serves as primary proof of registration at Smart University. The
                  student mentioned above is hereby granted access to campus facilities, library
                  resources, and digital learning platforms. This document must be presented along
                  with a valid ID card for all official academic purposes."
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-auto pt-24 flex justify-between items-end border-t border-slate-100">
            <div>
              <p class="text-xs font-bold text-slate-400">Smart University Digital Registrar</p>
              <p class="text-[10px] text-slate-300">Generated via Campus OS v4.2.0</p>
            </div>
            <div class="text-center w-40 border-t border-slate-900 pt-2">
              <p class="text-[10px] font-black uppercase">Registrar Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class StudentRegistrationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  @ViewChild('idCard') idCardElement!: ElementRef;
  @ViewChild('printReceipt') receiptElement!: ElementRef;

  isGenerating = signal(false);
  receiptNo = signal(Math.floor(100000 + Math.random() * 900000));
  today = signal(
    new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
  );

  departments = signal<any[]>([]);

  regForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    dob: ['', [Validators.required]],
    department: ['', [Validators.required]],
  });

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/departments`).subscribe({
      next: (data) => {
        this.departments.set(data);
      },
      error: (err) => {
        console.error('Failed to load departments from API:', err);
        // Fallback options in case json-server goes down
        this.departments.set([
          { name: 'Department of Computer Science and Engineering (CSE)' },
          { name: 'Department of Electrical and Electronic Engineering (EEE)' },
          { name: 'Department of Mathematics' },
          { name: 'Department of History' },
          { name: 'Department of Law' },
        ]);
      },
    });
  }

  async onFormSubmit() {
    if (this.regForm.invalid) return;

    this.isGenerating.set(true);

    try {
      // 1. Give time for rendering
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 2. Capture the Official Receipt (Hidden A4 Template)
      const canvas = await html2canvas(this.receiptElement.nativeElement, {
        scale: 2.5, // Balance between quality and file size
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.9); // Use JPEG for smaller size with high quality

      // 3. Initialize jsPDF (Standard A4)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate dimensions to fit A4 exactly
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');

      // 4. Download
      const fileName = `Registration_Receipt_${this.regForm.value.fullName?.replace(/\s/g, '_')}.pdf`;
      pdf.save(fileName);

      // 5. Success Notification
      alert(
        'PROPERLY GENERATED: Your Official Registration Receipt has been downloaded as a high-fidelity PDF.',
      );
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate high-fidelity PDF. Please check your browser console.');
    } finally {
      this.isGenerating.set(false);
    }
  }
}
