import { Component, signal, inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { forkJoin } from 'rxjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { environment } from '../../../environments/environment';

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
              <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                University Application
              </h1>
              <p class="text-slate-500 text-sm">
                Step {{ currentStep() }} of 5: {{ getStepTitle() }}
              </p>
            </div>
            <div class="hidden md:flex gap-2">
              <div
                *ngFor="let s of [1, 2, 3, 4, 5]"
                [class]="
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ' +
                  (currentStep() === s
                    ? 'bg-mit-red text-white scale-110'
                    : currentStep() > s
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400')
                "
              >
                <svg
                  *ngIf="currentStep() > s"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span *ngIf="currentStep() <= s">{{ s }}</span>
              </div>
            </div>
          </div>
          <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              class="bg-mit-red h-full transition-all duration-500"
              [style.width.%]="(currentStep() / 5) * 100"
            ></div>
          </div>
        </div>

        <form [formGroup]="appForm" (ngSubmit)="submitApplication()" class="space-y-8">
          <!-- Step 1: Personal Information -->
          <div *ngIf="currentStep() === 1" class="glass-panel p-8 space-y-6 animate-fade-in-up">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="col-span-2">
                <label
                  class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider"
                  >Full Name</label
                >
                <input
                  type="text"
                  formControlName="fullName"
                  class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium"
                />
                <p
                  *ngIf="appForm.get('fullName')?.invalid && appForm.get('fullName')?.touched"
                  class="text-xs text-rose-500 mt-1"
                >
                  Full name is required.
                </p>
              </div>
              <div>
                <label
                  class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider"
                  >Date of Birth</label
                >
                <input
                  type="date"
                  formControlName="dob"
                  class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium"
                />
                <p
                  *ngIf="appForm.get('dob')?.invalid && appForm.get('dob')?.touched"
                  class="text-xs text-rose-500 mt-1"
                >
                  Date of birth is required.
                </p>
              </div>
              <div>
                <label
                  class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider"
                  >Gender</label
                >
                <select
                  formControlName="gender"
                  class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <p
                  *ngIf="appForm.get('gender')?.invalid && appForm.get('gender')?.touched"
                  class="text-xs text-rose-500 mt-1"
                >
                  Gender selection is required.
                </p>
              </div>
            </div>
          </div>

          <!-- Step 2: Academic Background -->
          <div *ngIf="currentStep() === 2" class="glass-panel p-8 space-y-6 animate-fade-in-up">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="col-span-2">
                <label
                  class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider"
                  >Previous Institution</label
                >
                <input
                  type="text"
                  formControlName="previousInst"
                  class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium"
                />
                <p
                  *ngIf="
                    appForm.get('previousInst')?.invalid && appForm.get('previousInst')?.touched
                  "
                  class="text-xs text-rose-500 mt-1"
                >
                  Previous institution is required.
                </p>
              </div>
              <div>
                <label
                  class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider"
                  >SSC GPA</label
                >
                <input
                  type="number"
                  step="0.01"
                  formControlName="sscGpa"
                  class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium"
                />
                <p
                  *ngIf="appForm.get('sscGpa')?.invalid && appForm.get('sscGpa')?.touched"
                  class="text-xs text-rose-500 mt-1"
                >
                  SSC GPA must be between 0 and 5.
                </p>
              </div>
              <div>
                <label
                  class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider"
                  >HSC GPA</label
                >
                <input
                  type="number"
                  step="0.01"
                  formControlName="hscGpa"
                  class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium"
                />
                <p
                  *ngIf="appForm.get('hscGpa')?.invalid && appForm.get('hscGpa')?.touched"
                  class="text-xs text-rose-500 mt-1"
                >
                  HSC GPA must be between 0 and 5.
                </p>
              </div>
            </div>
          </div>

          <!-- Step 3: Program Selection -->
          <div *ngIf="currentStep() === 3" class="glass-panel p-8 space-y-6 animate-fade-in-up">
            <div>
              <label
                class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider"
                >Select Faculty</label
              >
              <select
                formControlName="facultyId"
                class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium"
              >
                <option value="">Select Faculty</option>
                <option *ngFor="let f of faculties()" [value]="f.id">{{ f.name }}</option>
              </select>
              <p
                *ngIf="appForm.get('facultyId')?.invalid && appForm.get('facultyId')?.touched"
                class="text-xs text-rose-500 mt-1"
              >
                Faculty selection is required.
              </p>
            </div>

            <div>
              <label
                class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider"
                >Select Department</label
              >
              <select
                formControlName="departmentId"
                class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium"
              >
                <option value="">Select Department</option>
                <option *ngFor="let d of availableDepartments()" [value]="d.id">
                  {{ d.name }}
                </option>
              </select>
              <p
                *ngIf="appForm.get('departmentId')?.invalid && appForm.get('departmentId')?.touched"
                class="text-xs text-rose-500 mt-1"
              >
                Department selection is required.
              </p>
            </div>

            <div>
              <label
                class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider"
                >Select Program</label
              >
              <select
                formControlName="programId"
                class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white font-medium"
              >
                <option value="">Select Program</option>
                <option *ngFor="let p of availablePrograms()" [value]="p.id">{{ p.name }}</option>
              </select>
              <p
                *ngIf="appForm.get('programId')?.invalid && appForm.get('programId')?.touched"
                class="text-xs text-rose-500 mt-1"
              >
                Program selection is required.
              </p>
            </div>
          </div>

          <!-- Step 4: Document Upload Simulation -->
          <div *ngIf="currentStep() === 4" class="glass-panel p-8 space-y-6 animate-fade-in-up">
            <div
              class="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center group hover:border-mit-red/50 transition-all"
            >
              <div
                class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-slate-400"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
              </div>
              <h4 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Upload Certificates & Transcript
              </h4>
              <p class="text-slate-500 mb-6">
                Drag and drop your PDF or Image files here (Max 10MB)
              </p>
              <button
                type="button"
                class="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold"
              >
                Select Files
              </button>
            </div>
            <div
              class="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50 rounded-2xl"
            >
              <div
                class="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-bold text-green-800 dark:text-green-400">
                  Academic_Documents.pdf
                </p>
                <p class="text-xs text-green-600 dark:text-green-500">
                  2.4 MB • Successfully uploaded
                </p>
              </div>
            </div>
          </div>

          <!-- Step 5: Review & Submit -->
          <div *ngIf="currentStep() === 5" class="glass-panel p-8 space-y-8 animate-fade-in-up">
            <div class="bg-mit-red/5 p-6 rounded-2xl border border-mit-red/10">
              <h3 class="text-lg font-bold text-mit-red mb-4">Final Review</h3>
              <div class="grid grid-cols-2 gap-y-4 text-sm">
                <span class="text-slate-500">Full Name:</span>
                <span class="font-bold text-slate-900 dark:text-white">{{
                  appForm.value.fullName || 'Not Entered'
                }}</span>
                <span class="text-slate-500">SSC/HSC GPA:</span>
                <span class="font-bold text-slate-900 dark:text-white"
                  >{{ appForm.value.sscGpa }} / {{ appForm.value.hscGpa }}</span
                >
                <span class="text-slate-500">Selected Program:</span>
                <span class="font-bold text-slate-900 dark:text-white">{{
                  getProgramName(appForm.value.programId)
                }}</span>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <input
                type="checkbox"
                formControlName="declaration"
                class="mt-1 w-5 h-5 rounded border-slate-300 text-mit-red focus:ring-mit-red"
              />
              <p class="text-xs text-slate-500 leading-relaxed font-semibold">
                I hereby declare that the information provided is true and correct to the best of my
                knowledge. I understand that any false statement may lead to the cancellation of my
                application.
              </p>
            </div>
            <p
              *ngIf="appForm.get('declaration')?.invalid && appForm.get('declaration')?.touched"
              class="text-xs text-rose-500 font-bold"
            >
              You must check the box to confirm your declaration.
            </p>
          </div>

          <!-- Navigation -->
          <div class="flex justify-between pt-8">
            <button
              type="button"
              *ngIf="currentStep() > 1"
              (click)="prevStep()"
              class="px-10 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl font-black hover:bg-slate-50 transition-all"
            >
              Previous
            </button>
            <div class="flex-1"></div>
            <button
              type="button"
              *ngIf="currentStep() < 5"
              [disabled]="!isStepValid(currentStep())"
              (click)="nextStep()"
              class="px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              Next Step
            </button>
            <button
              type="submit"
              *ngIf="currentStep() === 5"
              [disabled]="appForm.invalid || isGenerating()"
              class="px-12 py-4 bg-mit-red text-white rounded-2xl font-black shadow-2xl shadow-mit-red/40 hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
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
              {{ isGenerating() ? 'Processing...' : 'Submit Application' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- HIDDEN PRINTABLE RECEIPT (A4 FORMAT) -->
    <div style="position: absolute; left: -9999px; top: -9999px;">
      <div
        #printReceipt
        class="bg-white p-16 flex flex-col justify-between"
        style="width: 794px; height: 1123px; color: #0f172a; font-family: sans-serif; box-sizing: border-box;"
      >
        <div>
          <!-- Header -->
          <div class="flex justify-between items-start border-b-2 border-mit-red pb-8 mb-10">
            <div class="flex items-center gap-4">
              <div
                class="w-16 h-16 bg-mit-red rounded-xl flex items-center justify-center text-white text-3xl font-black"
              >
                S
              </div>
              <div>
                <h1 class="text-2xl font-black tracking-tight uppercase text-slate-900">
                  Smart University
                </h1>
                <p class="text-xs font-black text-slate-500 tracking-[0.2em] mt-1">
                  ADMISSION APPLICATION RECEIPT
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Application No</p>
              <p class="text-lg font-black text-mit-red">#APL-{{ receiptNo() }}</p>
              <p class="text-xs font-bold text-slate-500 mt-2">Date: {{ today() }}</p>
            </div>
          </div>

          <!-- Body -->
          <div class="space-y-8">
            <!-- Personal Details -->
            <div>
              <h3
                class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2"
              >
                Applicant Information
              </h3>
              <div class="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p class="text-[9px] font-black text-slate-400 uppercase">Full Name</p>
                  <p class="font-bold text-slate-800">
                    {{ appForm.value.fullName || 'Not Entered' }}
                  </p>
                </div>
                <div>
                  <p class="text-[9px] font-black text-slate-400 uppercase">Applicant ID</p>
                  <p class="font-bold text-slate-800">APP-{{ applicantNo() }}</p>
                </div>
                <div>
                  <p class="text-[9px] font-black text-slate-400 uppercase">Date of Birth</p>
                  <p class="font-bold text-slate-800">{{ appForm.value.dob }}</p>
                </div>
                <div>
                  <p class="text-[9px] font-black text-slate-400 uppercase">Gender</p>
                  <p class="font-bold text-slate-800">{{ appForm.value.gender }}</p>
                </div>
              </div>
            </div>

            <!-- Academic Record -->
            <div>
              <h3
                class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2"
              >
                Academic Credentials
              </h3>
              <div class="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p class="text-[9px] font-black text-slate-400 uppercase">Previous Institution</p>
                  <p class="font-bold text-slate-800">
                    {{ appForm.value.previousInst || 'Not Entered' }}
                  </p>
                </div>
                <div>
                  <p class="text-[9px] font-black text-slate-400 uppercase">SSC GPA</p>
                  <p class="font-bold text-slate-800">
                    {{ appForm.value.sscGpa || '0.00' }} / 5.00
                  </p>
                </div>
                <div>
                  <p class="text-[9px] font-black text-slate-400 uppercase">HSC GPA</p>
                  <p class="font-bold text-slate-800">
                    {{ appForm.value.hscGpa || '0.00' }} / 5.00
                  </p>
                </div>
              </div>
            </div>

            <!-- Choice of Program -->
            <div>
              <h3
                class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2"
              >
                Program Selection Details
              </h3>
              <div class="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p class="text-[9px] font-black text-slate-400 uppercase">Faculty</p>
                  <p class="font-bold text-slate-800">
                    {{ getFacultyName(appForm.value.facultyId) }}
                  </p>
                </div>
                <div>
                  <p class="text-[9px] font-black text-slate-400 uppercase">Department</p>
                  <p class="font-bold text-slate-800">
                    {{ getDepartmentName(appForm.value.departmentId) }}
                  </p>
                </div>
                <div>
                  <p class="text-[9px] font-black text-slate-400 uppercase">Program</p>
                  <p class="font-bold text-slate-800">
                    {{ getProgramName(appForm.value.programId) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Uploaded Documents -->
            <div>
              <h3
                class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2"
              >
                Submitted Certificates & Transcripts
              </h3>
              <div
                class="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-800">Academic_Documents.pdf</p>
                    <p class="text-[10px] text-slate-400">
                      2.4 MB • Uploaded & Attached to Application
                    </p>
                  </div>
                </div>
                <p
                  class="text-[10px] font-black text-green-600 uppercase tracking-wider bg-green-50 px-3 py-1.5 rounded-lg border border-green-100"
                >
                  Attached
                </p>
              </div>
            </div>

            <!-- Declaration & Notice -->
            <div class="pt-4">
              <div class="border border-slate-200 p-6 rounded-2xl bg-slate-50/50">
                <p class="text-[10px] font-black text-slate-400 uppercase mb-2">
                  Applicant Declaration Confirmed
                </p>
                <p class="text-[11px] leading-relaxed text-slate-500 italic">
                  "I hereby declare that the information provided is true and correct to the best of
                  my knowledge. I understand that any false statement may lead to the cancellation
                  of my application."
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="pt-8 flex justify-between items-end border-t border-slate-100">
          <div>
            <p class="text-xs font-bold text-slate-400">Smart University Admissions Office</p>
            <p class="text-[10px] text-slate-300">
              Generated on Campus OS v4.2.0 • Status: Pending Review
            </p>
          </div>
          <!-- Mini QR -->
          <div
            class="w-16 h-16 border border-slate-200 rounded-xl flex items-center justify-center bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
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
export class ApplyComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  @ViewChild('printReceipt') receiptElement!: ElementRef;

  currentStep = signal(1);
  faculties = signal<any[]>([]);
  departments = signal<any[]>([]);
  programs = signal<any[]>([]);
  availableDepartments = signal<any[]>([]);
  availablePrograms = signal<any[]>([]);

  isGenerating = signal(false);
  receiptNo = signal(Math.floor(100000 + Math.random() * 900000));
  applicantNo = signal(Math.floor(100 + Math.random() * 900));
  today = signal(
    new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
  );

  appForm = this.fb.group({
    fullName: ['', Validators.required],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    previousInst: ['', Validators.required],
    sscGpa: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
    hscGpa: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
    facultyId: ['', Validators.required],
    departmentId: ['', Validators.required],
    programId: ['', Validators.required],
    declaration: [false, Validators.requiredTrue],
  });

  ngOnInit() {
    // Load all static academic catalogs in parallel
    forkJoin({
      faculties: this.http.get<any[]>(`${environment.apiUrl}/faculties`),
      departments: this.http.get<any[]>(`${environment.apiUrl}/departments`),
      programs: this.http.get<any[]>(`${environment.apiUrl}/programs`),
    }).subscribe(({ faculties, departments, programs }) => {
      this.faculties.set(faculties);
      this.departments.set(departments);
      this.programs.set(programs);

      // Initialize dropdown lists in case of pre-populated data (e.g. going back/forth in wizard)
      this.initializeAvailableOptions();
    });

    // Reactive subscriptions for cascading select boxes
    this.appForm.get('facultyId')?.valueChanges.subscribe((facultyId) => {
      if (facultyId) {
        const filteredDepts = this.departments().filter((d) => d.facultyId === facultyId);
        this.availableDepartments.set(filteredDepts);
      } else {
        this.availableDepartments.set([]);
      }
      this.appForm.get('departmentId')?.setValue('', { emitEvent: false });
      this.appForm.get('programId')?.setValue('', { emitEvent: false });
      this.availablePrograms.set([]);
    });

    this.appForm.get('departmentId')?.valueChanges.subscribe((departmentId) => {
      if (departmentId) {
        const filteredProgs = this.programs().filter((p) => p.departmentId === departmentId);
        this.availablePrograms.set(filteredProgs);
      } else {
        this.availablePrograms.set([]);
      }
      this.appForm.get('programId')?.setValue('', { emitEvent: false });
    });

    // Prepopulate user details if logged in
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.appForm.patchValue({
        fullName: currentUser.name,
      });
    }
  }

  initializeAvailableOptions() {
    const facultyId = this.appForm.get('facultyId')?.value;
    if (facultyId) {
      const filteredDepts = this.departments().filter((d) => d.facultyId === facultyId);
      this.availableDepartments.set(filteredDepts);

      const departmentId = this.appForm.get('departmentId')?.value;
      if (departmentId) {
        const filteredProgs = this.programs().filter((p) => p.departmentId === departmentId);
        this.availablePrograms.set(filteredProgs);
      }
    }
  }

  getStepTitle() {
    const titles = [
      'Personal Info',
      'Academic Records',
      'Program Choice',
      'Documents',
      'Review & Submit',
    ];
    return titles[this.currentStep() - 1];
  }

  getProgramName(id: any) {
    if (!id) return 'Not Selected';
    return this.programs().find((p) => p.id === id)?.name || id;
  }

  getFacultyName(id: any) {
    if (!id) return 'Not Selected';
    return this.faculties().find((f) => f.id === id)?.name || id;
  }

  getDepartmentName(id: any) {
    if (!id) return 'Not Selected';
    return this.departments().find((d) => d.id === id)?.name || id;
  }

  isStepValid(step: number): boolean {
    if (step === 1) {
      return (
        (this.appForm.get('fullName')?.valid ?? false) &&
        (this.appForm.get('dob')?.valid ?? false) &&
        (this.appForm.get('gender')?.valid ?? false)
      );
    }
    if (step === 2) {
      return (
        (this.appForm.get('previousInst')?.valid ?? false) &&
        (this.appForm.get('sscGpa')?.valid ?? false) &&
        (this.appForm.get('hscGpa')?.valid ?? false)
      );
    }
    if (step === 3) {
      return (
        (this.appForm.get('facultyId')?.valid ?? false) &&
        (this.appForm.get('departmentId')?.valid ?? false) &&
        (this.appForm.get('programId')?.valid ?? false)
      );
    }
    if (step === 4) {
      return true; // simulation upload is always valid
    }
    return true;
  }

  nextStep() {
    if (this.isStepValid(this.currentStep())) {
      this.currentStep.update((s) => s + 1);
    } else {
      this.markStepControlsAsTouched(this.currentStep());
    }
  }

  markStepControlsAsTouched(step: number) {
    if (step === 1) {
      this.appForm.get('fullName')?.markAsTouched();
      this.appForm.get('dob')?.markAsTouched();
      this.appForm.get('gender')?.markAsTouched();
    }
    if (step === 2) {
      this.appForm.get('previousInst')?.markAsTouched();
      this.appForm.get('sscGpa')?.markAsTouched();
      this.appForm.get('hscGpa')?.markAsTouched();
    }
    if (step === 3) {
      this.appForm.get('facultyId')?.markAsTouched();
      this.appForm.get('departmentId')?.markAsTouched();
      this.appForm.get('programId')?.markAsTouched();
    }
  }

  prevStep() {
    this.currentStep.update((s) => s - 1);
  }

  async submitApplication() {
    if (this.appForm.invalid) return;

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
      const fileName = `Application_Receipt_${this.appForm.value.fullName?.replace(/\s/g, '_')}.pdf`;
      pdf.save(fileName);

      // 5. Post to Database
      const formVal = this.appForm.value;
      const application = {
        fullName: formVal.fullName,
        dob: formVal.dob,
        gender: formVal.gender,
        previousInst: formVal.previousInst,
        sscGpa: Number(formVal.sscGpa),
        hscGpa: Number(formVal.hscGpa),
        facultyId: formVal.facultyId,
        departmentId: formVal.departmentId,
        programId: formVal.programId,
        id: 'APL-' + this.receiptNo(),
        applicantId: 'APP-' + this.applicantNo(),
        status: 'Pending',
        appliedDate: new Date().toISOString(),
      };

      this.http.post(`${environment.apiUrl}/applications`, application).subscribe({
        next: () => {
          alert(
            'PROPERLY GENERATED: Your Application has been submitted successfully and receipt downloaded!',
          );
          this.router.navigate(['/admissions']);
        },
        error: (err) => {
          console.error('API submission error:', err);
          alert('Receipt downloaded but failed to sync application online. Please check network.');
        },
      });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate high-fidelity PDF. Please check your browser console.');
    } finally {
      this.isGenerating.set(false);
    }
  }
}
