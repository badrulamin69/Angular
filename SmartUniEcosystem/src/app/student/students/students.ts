import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PdfService } from '../../core/services/pdf.service';

interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  gpa: number;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Student Directory
          </h1>
          <p class="text-slate-500 mt-1">Manage enrollments, academic profiles, and statuses.</p>
        </div>
        <div class="flex gap-3">
          <button
            (click)="exportCSV()"
            class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold flex items-center gap-2 group transition-colors"
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
              class="text-slate-400 group-hover:text-slate-600"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Export CSV
          </button>
          <button
            (click)="openModal()"
            class="px-4 py-2 bg-gradient-to-r from-mit-red to-primary-600 text-white rounded-xl shadow-lg shadow-mit-red/30 hover:shadow-mit-red/50 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2"
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" x2="19" y1="8" y2="14" />
              <line x1="22" x2="16" y1="11" y2="11" />
            </svg>
            Enroll Student
          </button>
        </div>
      </div>

      <div
        class="glass-panel p-4 flex flex-col md:flex-row gap-4 justify-between items-center animate-fade-in delay-100"
      >
        <div class="relative w-full md:w-96">
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
            class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Search by name, ID, or email..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-mit-red focus:ring-2 focus:ring-mit-red/20 outline-none text-sm text-slate-900 dark:text-white transition-all"
          />
        </div>
      </div>

      <div class="glass-panel overflow-hidden animate-fade-in delay-200">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700"
              >
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Student
                </th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Program
                </th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  GPA
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700/50">
              <tr
                *ngFor="let s of filteredStudents()"
                (click)="openDossier(s)"
                class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
              >
                <td class="px-6 py-4 flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-sm"
                  >
                    {{ s.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 dark:text-white leading-none">
                      {{ s.name }}
                    </p>
                    <p class="text-xs text-slate-500 mt-1">{{ s.id }} &bull; {{ s.email }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                  {{ s.program }}
                </td>
                <td class="px-6 py-4">
                  <span
                    [ngClass]="{
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50':
                        s.status === 'Active',
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700':
                        s.status === 'Inactive',
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50':
                        s.status === 'Graduated',
                    }"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border"
                  >
                    {{ s.status }}
                  </span>
                </td>
                <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">
                  {{ s.gpa | number: '1.2-2' }}
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    (click)="viewMarksheet(s.id); $event.stopPropagation()"
                    class="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/20 mr-2"
                    title="View Marksheet"
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
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <button
                    *ngIf="isAdmin()"
                    (click)="openEdit(s); $event.stopPropagation()"
                    class="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/20 mr-2"
                    title="Edit Student"
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
                      <path d="M11 4h6v6" />
                      <path d="M21 3l-8 8" />
                      <path d="M3 21v-4.2c0-.5.2-1 .6-1.4L17.4 2.6c.4-.4.9-.6 1.4-.6H21v4" />
                    </svg>
                  </button>
                  <button
                    (click)="deleteStudent(s.id); $event.stopPropagation()"
                    class="text-slate-400 hover:text-mit-red transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Delete Student"
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
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Student Dossier Modal -->
    <div *ngIf="selectedStudent()" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeDossier()"></div>
      <div
        class="glass-panel w-full max-w-2xl p-6 relative z-10 animate-fade-in-up flex flex-col max-h-[85vh] overflow-y-auto"
      >
        <div
          class="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-full bg-mit-red text-white flex items-center justify-center font-bold text-lg"
            >
              {{ selectedStudent()?.name?.charAt(0) }}
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">
                {{ selectedStudent()?.name }}
              </h3>
              <p class="text-xs text-slate-400 font-semibold">
                {{ selectedStudent()?.id }} &bull; {{ selectedStudent()?.email }}
              </p>
            </div>
          </div>
          <button
            (click)="downloadTranscript()"
            class="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-colors"
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
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Print Transcript
          </button>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div class="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl">
              <p class="text-[10px] text-slate-400 uppercase font-black">Program</p>
              <p class="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1 truncate">
                {{ selectedStudent()?.program }}
              </p>
            </div>
            <div class="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl">
              <p class="text-[10px] text-slate-400 uppercase font-black">GPA Standing</p>
              <p class="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
                {{ selectedStudent()?.gpa | number: '1.2-2' }}
              </p>
            </div>
            <div class="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl">
              <p class="text-[10px] text-slate-400 uppercase font-black">Enrollment Status</p>
              <span class="text-xs font-black text-green-600 dark:text-green-400 mt-1 block">{{
                selectedStudent()?.status
              }}</span>
            </div>
          </div>

          <!-- Enrollments -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
                Registered Courses
              </h4>
              <button
                *ngIf="isSuperAdmin()"
                (click)="openEnrollmentModal()"
                class="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center gap-1"
              >
                + Add Course
              </button>
            </div>
            <div
              class="overflow-x-auto bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800"
            >
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr
                    class="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
                  >
                    <th class="px-4 py-2 font-bold text-slate-500">Course Code</th>
                    <th class="px-4 py-2 font-bold text-slate-500">Semester</th>
                    <th class="px-4 py-2 font-bold text-slate-500">Progress</th>
                    <th class="px-4 py-2 font-bold text-slate-500">Attendance</th>
                    <th
                      *ngIf="isSuperAdmin()"
                      class="px-4 py-2 font-bold text-slate-500 text-right"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="let e of studentEnrollments()"
                    class="border-b border-slate-100 dark:border-slate-800/50"
                  >
                    <td class="px-4 py-2 font-bold text-slate-850 dark:text-slate-300">
                      {{ e.courseId }}
                    </td>
                    <td class="px-4 py-2 font-semibold text-slate-500">{{ e.semester }}</td>
                    <td class="px-4 py-2">
                      <div class="flex items-center gap-2">
                        <div
                          class="w-20 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden"
                        >
                          <div class="bg-emerald-500 h-2" [style.width.%]="e.progress"></div>
                        </div>
                        <span class="font-bold">{{ e.progress }}%</span>
                      </div>
                    </td>
                    <td class="px-4 py-2 font-bold" [class.text-red-500]="e.attendance < 75">
                      {{ e.attendance }}%
                    </td>
                    <td *ngIf="isSuperAdmin()" class="px-4 py-2 text-right">
                      <button
                        (click)="openEnrollmentModal(e)"
                        class="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 mr-2"
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
                        >
                          <path d="M11 4h6v6" />
                          <path d="M21 3l-8 8" />
                          <path d="M3 21v-4.2c0-.5.2-1 .6-1.4L17.4 2.6c.4-.4.9-.6 1.4-.6H21v4" />
                        </svg>
                      </button>
                      <button
                        (click)="deleteEnrollment(e.id)"
                        class="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
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
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                  <tr *ngIf="studentEnrollments().length === 0">
                    <td
                      [attr.colspan]="isSuperAdmin() ? 5 : 4"
                      class="px-4 py-4 text-center text-slate-400"
                    >
                      No active course enrollments found.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Academic Grades -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
                Grade History
              </h4>
              <button
                *ngIf="isSuperAdmin()"
                (click)="openGradeModal()"
                class="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center gap-1"
              >
                + Add Grade
              </button>
            </div>
            <div
              class="overflow-x-auto bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800"
            >
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr
                    class="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
                  >
                    <th class="px-4 py-2 font-bold text-slate-500">Course</th>
                    <th class="px-4 py-2 font-bold text-slate-500">Credits</th>
                    <th class="px-4 py-2 font-bold text-slate-500">GP</th>
                    <th class="px-4 py-2 font-bold text-slate-500">Grade</th>
                    <th
                      *ngIf="isSuperAdmin()"
                      class="px-4 py-2 font-bold text-slate-500 text-right"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="let g of studentGrades()"
                    class="border-b border-slate-100 dark:border-slate-800/50"
                  >
                    <td class="px-4 py-2 font-bold text-slate-850 dark:text-slate-300">
                      {{ g.courseId }}
                    </td>
                    <td class="px-4 py-2 font-semibold text-slate-500">{{ g.credits }}</td>
                    <td class="px-4 py-2 font-bold">{{ g.gp | number: '1.1-1' }}</td>
                    <td class="px-4 py-2 font-black text-mit-red">{{ g.grade }}</td>
                    <td *ngIf="isSuperAdmin()" class="px-4 py-2 text-right">
                      <button
                        (click)="openGradeModal(g)"
                        class="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 mr-2"
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
                        >
                          <path d="M11 4h6v6" />
                          <path d="M21 3l-8 8" />
                          <path d="M3 21v-4.2c0-.5.2-1 .6-1.4L17.4 2.6c.4-.4.9-.6 1.4-.6H21v4" />
                        </svg>
                      </button>
                      <button
                        (click)="deleteGrade(g.id)"
                        class="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
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
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                  <tr *ngIf="studentGrades().length === 0">
                    <td
                      [attr.colspan]="isSuperAdmin() ? 5 : 4"
                      class="px-4 py-4 text-center text-slate-400"
                    >
                      No official grades recorded yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="pt-4 mt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            (click)="closeDossier()"
            class="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 font-bold rounded-lg text-sm transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>

    <!-- Enrollment Modal -->
    <div
      *ngIf="isEnrollmentModalOpen()"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <div
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        (click)="closeEnrollmentModal()"
      ></div>
      <div class="glass-panel w-full max-w-sm p-6 relative z-10 animate-fade-in-up">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">
            {{ editingEnrollmentId() ? 'Edit Course' : 'Add Course' }}
          </h3>
          <button
            (click)="closeEnrollmentModal()"
            class="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>
        <form [formGroup]="enrollmentForm" (ngSubmit)="saveEnrollment()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
              >Course Code</label
            >
            <input
              type="text"
              formControlName="courseId"
              class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
              >Semester</label
            >
            <input
              type="text"
              formControlName="semester"
              class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
                >Progress (%)</label
              >
              <input
                type="number"
                formControlName="progress"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
                >Attendance (%)</label
              >
              <input
                type="number"
                formControlName="attendance"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>
          <div class="pt-2 flex justify-end gap-2">
            <button
              type="button"
              (click)="closeEnrollmentModal()"
              class="px-4 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="enrollmentForm.invalid"
              class="px-4 py-2 bg-mit-red text-white rounded-lg font-bold hover:bg-primary-600 text-sm disabled:opacity-50 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Grade Modal -->
    <div
      *ngIf="isGradeModalOpen()"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeGradeModal()"></div>
      <div class="glass-panel w-full max-w-sm p-6 relative z-10 animate-fade-in-up">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">
            {{ editingGradeId() ? 'Edit Grade' : 'Add Grade' }}
          </h3>
          <button
            (click)="closeGradeModal()"
            class="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>
        <form [formGroup]="gradeForm" (ngSubmit)="saveGrade()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
              >Course Code</label
            >
            <input
              type="text"
              formControlName="courseId"
              class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
                >Credits</label
              >
              <input
                type="number"
                formControlName="credits"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
                >Grade</label
              >
              <input
                type="text"
                formControlName="grade"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
                >GP</label
              >
              <input
                type="number"
                step="0.1"
                formControlName="gp"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>
          <div class="pt-2 flex justify-end gap-2">
            <button
              type="button"
              (click)="closeGradeModal()"
              class="px-4 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="gradeForm.invalid"
              class="px-4 py-2 bg-mit-red text-white rounded-lg font-bold hover:bg-primary-600 text-sm disabled:opacity-50 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
    <div *ngIf="isModalOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeModal()"></div>
      <div class="glass-panel w-full max-w-md p-6 relative z-10 animate-fade-in-up">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">
            {{ editingId() ? 'Edit Student' : 'Enroll New Student' }}
          </h3>
          <button
            (click)="closeModal()"
            class="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
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
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        <form [formGroup]="studentForm" (ngSubmit)="saveStudent()" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5"
              >Full Name</label
            >
            <input
              type="text"
              formControlName="name"
              class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5"
              >Email Address</label
            >
            <input
              type="email"
              formControlName="email"
              class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5"
              >Program</label
            >
            <select
              formControlName="program"
              class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white"
            >
              <option *ngFor="let p of programs()" [value]="p.name">{{ p.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5"
              >University</label
            >
            <select
              formControlName="universityId"
              class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white"
            >
              <option *ngFor="let uni of universities()" [value]="uni.id">{{ uni.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5"
              >Status</label
            >
            <select
              formControlName="status"
              class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5"
              >GPA</label
            >
            <input
              type="number"
              step="0.01"
              formControlName="gpa"
              class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-mit-red text-slate-900 dark:text-white"
            />
          </div>

          <div
            class="pt-4 flex gap-3 justify-end border-t border-slate-200 dark:border-slate-700 mt-6"
          >
            <button
              type="button"
              (click)="closeModal()"
              class="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="studentForm.invalid"
              class="px-5 py-2.5 bg-mit-red text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-primary-600 transition-all disabled:opacity-50"
            >
              {{ editingId() ? 'Update Student' : 'Enroll Student' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class StudentsComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private pdfService = inject(PdfService);
  private router = inject(Router);
  private authService = inject(AuthService);

  students = signal<Student[]>([]);
  universities = signal<any[]>([]);
  programs = signal<any[]>([]);
  courses = signal<any[]>([]);
  searchQuery = signal('');
  isModalOpen = signal(false);

  selectedStudent = signal<Student | null>(null);
  studentEnrollments = signal<any[]>([]);
  studentGrades = signal<any[]>([]);

  studentForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    program: ['', Validators.required],
    universityId: ['', Validators.required],
    status: ['Active', Validators.required],
    gpa: [0.0, [Validators.required, Validators.min(0), Validators.max(4.0)]]
  });

  isEnrollmentModalOpen = signal(false);
  editingEnrollmentId = signal<string | null>(null);

  isGradeModalOpen = signal(false);
  editingGradeId = signal<string | null>(null);

  enrollmentForm = this.fb.group({
    courseId: ['', Validators.required],
    semester: ['', Validators.required],
    progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    attendance: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
  });

  gradeForm = this.fb.group({
    courseId: ['', Validators.required],
    credits: [3, [Validators.required, Validators.min(1)]],
    gp: [0, [Validators.required, Validators.min(0), Validators.max(4.0)]],
    grade: ['', Validators.required],
  });

  // Whether current user is an admin (Super Admin / University Admin)
  isAdmin = computed(() => {
    const role = this.authService.currentUser()?.role || '';
    return role.toLowerCase().includes('admin');
  });

  isSuperAdmin = computed(() => {
    const role = this.authService.currentUser()?.role || '';
    return role === 'Super Admin';
  });

  filteredStudents = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.students().filter(
      (s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q),
    );
  });

  editingId = signal<string | null>(null);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<Student[]>('http://localhost:8080/students').subscribe((data) => {
      this.students.set(data);
    });
    this.http.get<any[]>('http://localhost:8080/universities').subscribe((data) => {
      this.universities.set(data);
    });
    this.http.get<any[]>('http://localhost:8080/programs').subscribe((data) => {
      this.programs.set(data);
      if (data.length > 0 && !this.studentForm.get('program')?.value) {
        this.studentForm.get('program')?.setValue(data[0].name);
      }
    });
    this.http.get<any[]>('http://localhost:8080/courses').subscribe((data) => {
      this.courses.set(data);
    });
  }

  exportCSV() {
    let csv = 'Student ID,Name,Email,Program,Status,GPA\n';
    this.filteredStudents().forEach((s) => {
      csv += `"${s.id}","${s.name}","${s.email}","${s.program}","${s.status}","${s.gpa.toFixed(2)}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'student_directory.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  openModal() {
    const firstUni = this.universities().length > 0 ? this.universities()[0].id : '';
    const firstProg = this.programs().length > 0 ? this.programs()[0].name : '';
    this.studentForm.reset({ program: firstProg, universityId: firstUni, status: 'Active', gpa: 0.0 });
    this.editingId.set(null);
    this.isModalOpen.set(true);
  }

  openEdit(student: Student) {
    // Prefill form and open modal in edit mode
    this.studentForm.reset({
      name: student.name,
      email: student.email,
      program: student.program,
      universityId: '',
      status: student.status,
      gpa: student.gpa
    });
    this.editingId.set(student.id);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  saveStudent() {
    if (!this.studentForm.valid) return;

    const formValue = this.studentForm.value;
    const editing = this.editingId();

    if (editing) {
      // Update existing student & user
      const updatedStudent = {
        name: formValue.name,
        email: formValue.email,
        program: formValue.program,
        status: formValue.status,
        gpa: formValue.gpa
      };

      this.http
        .patch<Student>(`http://localhost:8080/students/${editing}`, updatedStudent)
        .subscribe(
          (res) => {
            // Also patch user record if exists
            const updatedUser = {
              name: formValue.name,
              email: formValue.email,
              universityId: formValue.universityId,
            };
            this.http.patch(`http://localhost:8080/users/${editing}`, updatedUser).subscribe(
              () => {
                this.students.update((list) =>
                  list.map((s) => (s.id === editing ? { ...s, ...res } : s)),
                );
                this.editingId.set(null);
                this.closeModal();
              },
              (err) => {
                console.error('Failed to update user record', err);
                this.triggerLocalError('Failed to update user record');
              },
            );
          },
          (err) => {
            console.error('Failed to update student record', err);
            this.triggerLocalError('Failed to update student record');
          },
        );

      return;
    }

    // Create new student
    const studentId =
      'STU-' +
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');

    const newStudent: Student = {
      id: studentId,
      name: formValue.name!,
      email: formValue.email!,
      program: formValue.program!,
      status: (formValue.status as 'Active' | 'Inactive' | 'Graduated') || 'Active',
      gpa: formValue.gpa || 0.0,
    };

    const newUser = {
      id: studentId,
      name: formValue.name,
      email: formValue.email,
      password: 'password', // Default password
      role: 'Student',
      universityId: formValue.universityId,
    };

    // Atomic-like operation (Sequential for mock DB)
    this.http.post<Student>('http://localhost:8080/students', newStudent).subscribe((res) => {
      this.http.post('http://localhost:8080/users', newUser).subscribe(() => {
        this.students.update((s) => [...s, res]);
        this.closeModal();
      });
    });
  }

  deleteStudent(id: string) {
    if (!this.isAdmin()) return alert('Only admin users can delete students.');
    if (
      confirm(
        'Are you sure you want to remove this student? This will also revoke their login access.',
      )
    ) {
      this.http.delete(`http://localhost:8080/students/${id}`).subscribe(() => {
        this.http.delete(`http://localhost:8080/users/${id}`).subscribe(() => {
          this.students.update((s) => s.filter((student) => student.id !== id));
        });
      });
    }
  }

  openDossier(student: Student) {
    this.selectedStudent.set(student);
    this.studentEnrollments.set([]);
    this.studentGrades.set([]);

    this.http
      .get<any[]>(`http://localhost:8080/enrollments?studentId=${student.id}`)
      .subscribe((data) => {
        this.studentEnrollments.set(data);
      });

    this.http
      .get<any[]>(`http://localhost:8080/studentGrades?studentId=${student.id}`)
      .subscribe((data) => {
        this.studentGrades.set(data);
      });
  }

  closeDossier() {
    this.selectedStudent.set(null);
  }

  downloadTranscript() {
    const s = this.selectedStudent();
    if (s) {
      this.pdfService.generateOfficialTranscript(s, this.studentGrades(), this.courses());
    }
  }

  // Simple local error helper (replace with toast if available)
  private triggerLocalError(msg: string) {
    alert(msg);
  }

  viewMarksheet(id: string) {
    if (!id) return;
    this.router.navigate(['/admin/students', id, 'marksheet']);
  }

  // --- Enrollments CRUD ---
  openEnrollmentModal(enrollment?: any) {
    if (enrollment) {
      this.enrollmentForm.patchValue(enrollment);
      this.editingEnrollmentId.set(enrollment.id);
    } else {
      this.enrollmentForm.reset({ progress: 0, attendance: 0 });
      this.editingEnrollmentId.set(null);
    }
    this.isEnrollmentModalOpen.set(true);
  }

  closeEnrollmentModal() {
    this.isEnrollmentModalOpen.set(false);
  }

  saveEnrollment() {
    if (this.enrollmentForm.invalid) return;
    const student = this.selectedStudent();
    if (!student) return;

    const val = this.enrollmentForm.value;
    const editingId = this.editingEnrollmentId();

    if (editingId) {
      this.http.patch(`http://localhost:8080/enrollments/${editingId}`, val).subscribe(() => {
        this.studentEnrollments.update((list) =>
          list.map((e) => (e.id === editingId ? { ...e, ...val } : e)),
        );
        this.closeEnrollmentModal();
      });
    } else {
      const newEnrollment = {
        id: 'ENR-' + Math.floor(Math.random() * 10000).toString(),
        studentId: student.id,
        ...val,
      };
      this.http.post('http://localhost:8080/enrollments', newEnrollment).subscribe((res) => {
        this.studentEnrollments.update((list) => [...list, res]);
        this.closeEnrollmentModal();
      });
    }
  }

  deleteEnrollment(id: string) {
    if (confirm('Are you sure you want to remove this course enrollment?')) {
      this.http.delete(`http://localhost:8080/enrollments/${id}`).subscribe(() => {
        this.studentEnrollments.update((list) => list.filter((e) => e.id !== id));
      });
    }
  }

  // --- Grades CRUD ---
  openGradeModal(grade?: any) {
    if (grade) {
      this.gradeForm.patchValue(grade);
      this.editingGradeId.set(grade.id);
    } else {
      this.gradeForm.reset({ credits: 3, gp: 0 });
      this.editingGradeId.set(null);
    }
    this.isGradeModalOpen.set(true);
  }

  closeGradeModal() {
    this.isGradeModalOpen.set(false);
  }

  saveGrade() {
    if (this.gradeForm.invalid) return;
    const student = this.selectedStudent();
    if (!student) return;

    const val = this.gradeForm.value;
    const editingId = this.editingGradeId();

    if (editingId) {
      this.http.patch(`http://localhost:8080/studentGrades/${editingId}`, val).subscribe(() => {
        this.studentGrades.update((list) =>
          list.map((g) => (g.id === editingId ? { ...g, ...val } : g)),
        );
        this.closeGradeModal();
        this.updateStudentGpa();
      });
    } else {
      const newGrade = {
        id: 'GRD-' + Math.floor(Math.random() * 10000).toString(),
        studentId: student.id,
        ...val,
      };
      this.http.post('http://localhost:8080/studentGrades', newGrade).subscribe((res) => {
        this.studentGrades.update((list) => [...list, res]);
        this.closeGradeModal();
        this.updateStudentGpa();
      });
    }
  }

  deleteGrade(id: string) {
    if (confirm('Are you sure you want to remove this grade?')) {
      this.http.delete(`http://localhost:8080/studentGrades/${id}`).subscribe(() => {
        this.studentGrades.update((list) => list.filter((g) => g.id !== id));
        this.updateStudentGpa();
      });
    }
  }

  private updateStudentGpa() {
    const student = this.selectedStudent();
    if (!student) return;
    const grades = this.studentGrades();

    let totalCredits = 0;
    let totalPoints = 0;
    grades.forEach((g) => {
      totalCredits += g.credits || 0;
      totalPoints += (g.gp || 0) * (g.credits || 0);
    });

    const newGpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    this.http
      .patch(`http://localhost:8080/students/${student.id}`, { gpa: newGpa })
      .subscribe(() => {
        this.selectedStudent.set({ ...student, gpa: newGpa });
        this.students.update((list) =>
          list.map((s) => (s.id === student.id ? { ...s, gpa: newGpa } : s)),
        );
      });
  }
}
