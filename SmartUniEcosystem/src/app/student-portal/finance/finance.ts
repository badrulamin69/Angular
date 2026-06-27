import { Component, signal, inject, OnInit, computed, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { PdfService } from '../../core/services/pdf.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

@Component({
  selector: 'app-student-finance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Financial Gateway
          </h1>
          <p class="text-slate-500 mt-1">
            Manage tuition fees, view invoices, and make secure payments.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Payment Area -->
        <div class="lg:col-span-2 space-y-6">
          <div
            class="glass-card p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden border-none shadow-2xl"
          >
            <div
              class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"
            ></div>
            <div
              class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
            >
              <div>
                <p class="text-slate-400 font-medium uppercase tracking-wider text-sm mb-2">
                  Total Outstanding Balance
                </p>
                <h2 class="text-5xl font-black mb-1">\${{ balance() | number: '1.2-2' }}</h2>
                <p
                  *ngIf="balance() > 0"
                  class="text-sm text-amber-400 font-bold flex items-center gap-1 mt-2"
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
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Payment due for current semester
                </p>
                <p
                  *ngIf="balance() === 0"
                  class="text-sm text-emerald-400 font-bold flex items-center gap-1 mt-2"
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
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  All accounts settled
                </p>
              </div>
              <button
                *ngIf="balance() > 0"
                (click)="openPaymentModal()"
                class="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold shadow-lg hover:shadow-white/20 transition-all hover:-translate-y-1 flex items-center gap-2"
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
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                Pay Now
              </button>
            </div>
          </div>

          <h3 class="text-lg font-bold text-slate-900 dark:text-white mt-8 mb-4">
            Invoice History
          </h3>
          <div class="glass-panel overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr
                  class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700"
                >
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Invoice ID
                  </th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700/50">
                <tr
                  *ngFor="let inv of invoices()"
                  class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ inv.id }}</td>
                  <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ inv.date }}</td>
                  <td class="px-6 py-4 font-mono text-slate-700 dark:text-slate-300">
                    \${{ inv.amount | number: '1.2-2' }}
                  </td>
                  <td class="px-6 py-4">
                    <span
                      [ngClass]="{
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400':
                          inv.status === 'Unpaid',
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400':
                          inv.status === 'Paid',
                      }"
                      class="px-2.5 py-1 rounded-md text-xs font-bold"
                      >{{ inv.status }}</span
                    >
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button
                      (click)="downloadInvoice(inv)"
                      class="text-blue-600 dark:text-blue-400 hover:underline font-bold text-sm"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
                <tr *ngIf="invoices().length === 0">
                  <td colspan="5" class="px-6 py-12 text-center text-slate-500 font-medium">
                    No invoice records found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Scholarship & Grants -->
        <div class="space-y-6">
          <div class="glass-card p-6 border-t-4 border-t-emerald-500">
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-bold text-slate-900 dark:text-white">Active Scholarship</h3>
              <span
                class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400"
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
                  <path d="M12 2v20" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </span>
            </div>
            <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-1">
              25% Waiver
            </p>
            <p class="text-sm text-slate-500">Merit Based Scholarship</p>
            <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p class="text-xs text-slate-400 leading-relaxed">
                Must maintain a minimum CGPA of 3.50 to retain this waiver for the next semester.
              </p>
            </div>
          </div>

          <!-- Accepted Payment Methods Card -->
          <div class="glass-card p-6">
            <h3 class="font-bold text-slate-900 dark:text-white mb-4">Accepted Payment Methods</h3>
            <div class="space-y-3">
              <div
                class="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30"
              >
                <div
                  class="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black"
                >
                  VISA
                </div>
                <div
                  class="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white text-[8px] font-black leading-tight text-center"
                >
                  MC
                </div>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >Visa / Mastercard</span
                >
              </div>
              <div
                class="flex items-center gap-3 p-3 rounded-xl bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-800/30"
              >
                <div
                  class="w-9 h-9 rounded-full bg-pink-600 flex items-center justify-center text-white text-[9px] font-black"
                >
                  bKash
                </div>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >bKash Mobile Banking</span
                >
              </div>
              <div
                class="flex items-center gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30"
              >
                <div
                  class="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-[9px] font-black"
                >
                  NGD
                </div>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >Nagad Mobile Banking</span
                >
              </div>
              <div
                class="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30"
              >
                <div
                  class="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-[9px] font-black"
                >
                  RKT
                </div>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >Rocket (DBBL) Banking</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================== -->
      <!-- PAYMENT MODAL (Multi-Step)     -->
      <!-- ============================== -->
      <div *ngIf="isModalOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="fixed inset-0 bg-slate-900/70 backdrop-blur-md"
          (click)="closePaymentModal()"
        ></div>
        <div
          class="glass-panel w-full max-w-lg relative z-10 overflow-hidden rounded-3xl shadow-2xl animate-fade-in-up"
          style="max-height: 90vh; overflow-y: auto;"
        >
          <!-- Modal Header -->
          <div
            class="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-900"
          >
            <div>
              <h3 class="text-xl font-black text-slate-900 dark:text-white">
                {{
                  payStep() === 'select'
                    ? 'Choose Payment Method'
                    : payStep() === 'form'
                      ? 'Enter Payment Details'
                      : payStep() === 'processing'
                        ? 'Processing Payment'
                        : 'Payment Successful!'
                }}
              </h3>
              <p class="text-sm text-slate-500 mt-0.5" *ngIf="payStep() === 'select'">
                Amount Due:
                <span class="font-bold text-mit-red">\${{ balance() | number: '1.2-2' }}</span>
              </p>
            </div>
            <button
              (click)="closePaymentModal()"
              *ngIf="payStep() !== 'processing'"
              class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" x2="6" y1="6" y2="18" />
                <line x1="6" x2="18" y1="6" y2="18" />
              </svg>
            </button>
          </div>

          <!-- ---- STEP 1: SELECT GATEWAY ---- -->
          <div *ngIf="payStep() === 'select'" class="p-6 space-y-3 bg-white dark:bg-slate-900">
            <!-- Card Payment -->
            <button
              (click)="selectMethod('card')"
              class="w-full p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-4 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
            >
              <div class="flex gap-1.5">
                <div
                  class="w-10 h-7 rounded bg-blue-700 flex items-center justify-center text-white text-[9px] font-black"
                >
                  VISA
                </div>
                <div
                  class="w-10 h-7 rounded bg-orange-500 flex items-center justify-center text-white text-[8px] font-black leading-tight text-center"
                >
                  MC
                </div>
              </div>
              <div class="text-left flex-1">
                <p
                  class="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400"
                >
                  Credit / Debit Card
                </p>
                <p class="text-xs text-slate-400">Visa, Mastercard — all major cards accepted</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-slate-300 group-hover:text-blue-500"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            <!-- bKash -->
            <button
              (click)="selectMethod('bkash')"
              class="w-full p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-4 hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all group"
            >
              <div
                class="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white text-[10px] font-black"
              >
                bK
              </div>
              <div class="text-left flex-1">
                <p
                  class="font-bold text-slate-800 dark:text-slate-200 group-hover:text-pink-700 dark:group-hover:text-pink-400"
                >
                  bKash Mobile Banking
                </p>
                <p class="text-xs text-slate-400">Send money from your bKash wallet instantly</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-slate-300 group-hover:text-pink-500"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            <!-- Nagad -->
            <button
              (click)="selectMethod('nagad')"
              class="w-full p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-4 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all group"
            >
              <div
                class="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-black"
              >
                NG
              </div>
              <div class="text-left flex-1">
                <p
                  class="font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-700 dark:group-hover:text-orange-400"
                >
                  Nagad Mobile Banking
                </p>
                <p class="text-xs text-slate-400">Bangladesh Post Office digital wallet</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-slate-300 group-hover:text-orange-500"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            <!-- Rocket -->
            <button
              (click)="selectMethod('rocket')"
              class="w-full p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-4 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all group"
            >
              <div
                class="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] font-black"
              >
                RKT
              </div>
              <div class="text-left flex-1">
                <p
                  class="font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-400"
                >
                  Rocket (DBBL) Banking
                </p>
                <p class="text-xs text-slate-400">Dutch-Bangla Bank mobile banking service</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-slate-300 group-hover:text-purple-500"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            <div class="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
              256-bit SSL encrypted &bull; Secure transaction
            </div>
          </div>

          <!-- ---- STEP 2: PAYMENT FORM ---- -->
          <div *ngIf="payStep() === 'form'" class="p-6 space-y-5 bg-white dark:bg-slate-900">
            <!-- Back button -->
            <button
              (click)="payStep.set('select')"
              class="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back
            </button>

            <!-- Method badge -->
            <div [ngClass]="getMethodBgClass()" class="p-4 rounded-2xl flex items-center gap-3">
              <div
                [ngClass]="getMethodIconClass()"
                class="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black"
              >
                {{ getMethodShortLabel() }}
              </div>
              <div>
                <p class="font-bold text-slate-800 dark:text-slate-100">{{ getMethodLabel() }}</p>
                <p class="text-xs text-slate-500">
                  Amount to pay: <span class="font-bold">\${{ balance() | number: '1.2-2' }}</span>
                </p>
              </div>
            </div>

            <!-- CARD FORM -->
            <div *ngIf="selectedMethod() === 'card'" class="space-y-4">
              <div>
                <label
                  class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
                  >Card Number</label
                >
                <input
                  type="text"
                  [(ngModel)]="cardNumber"
                  maxlength="19"
                  placeholder="1234 5678 9012 3456"
                  (input)="formatCardNumber($event)"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label
                  class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
                  >Cardholder Name</label
                >
                <input
                  type="text"
                  [(ngModel)]="cardName"
                  placeholder="As printed on card"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
                    >Expiry</label
                  >
                  <div class="flex gap-2">
                    <select
                      [(ngModel)]="expiryMonth"
                      class="flex-1 px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">MM</option>
                      <option *ngFor="let m of months" [value]="m">{{ m }}</option>
                    </select>
                    <select
                      [(ngModel)]="expiryYear"
                      class="flex-1 px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">YY</option>
                      <option *ngFor="let y of years" [value]="y">{{ y }}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
                    >CVV</label
                  >
                  <input
                    [type]="showCvv ? 'text' : 'password'"
                    [(ngModel)]="cvv"
                    maxlength="4"
                    placeholder="•••"
                    class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    (click)="showCvv = !showCvv"
                    class="text-[10px] text-slate-400 mt-1 hover:text-slate-600"
                  >
                    {{ showCvv ? 'Hide' : 'Show' }} CVV
                  </button>
                </div>
              </div>
              <p *ngIf="formError()" class="text-xs text-rose-500 font-bold">{{ formError() }}</p>
              <button
                (click)="processPayment()"
                class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-base transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
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
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                Pay \${{ balance() | number: '1.2-2' }}
              </button>
            </div>

            <!-- MOBILE BANKING FORM (bKash / Nagad / Rocket) -->
            <div *ngIf="selectedMethod() !== 'card'" class="space-y-4">
              <div>
                <label
                  class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
                  >Registered Mobile Number</label
                >
                <div class="flex">
                  <span
                    class="px-3 py-3 bg-slate-100 dark:bg-slate-700 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-xl text-slate-500 font-mono text-sm"
                    >+880</span
                  >
                  <input
                    type="tel"
                    [(ngModel)]="mobileNumber"
                    maxlength="10"
                    placeholder="1XXXXXXXXX"
                    class="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-r-xl font-mono text-slate-900 dark:text-white outline-none focus:ring-2 transition-all"
                    [ngClass]="getMobileRingClass()"
                  />
                </div>
              </div>
              <div>
                <label
                  class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
                  >{{
                    selectedMethod() === 'bkash'
                      ? 'bKash'
                      : selectedMethod() === 'nagad'
                        ? 'Nagad'
                        : 'Rocket'
                  }}
                  PIN</label
                >
                <input
                  [type]="showPin ? 'text' : 'password'"
                  [(ngModel)]="mobilePin"
                  maxlength="6"
                  placeholder="Enter your 5-digit PIN"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white outline-none focus:ring-2 transition-all"
                  [ngClass]="getMobileRingClass()"
                />
                <button
                  type="button"
                  (click)="showPin = !showPin"
                  class="text-[10px] text-slate-400 mt-1 hover:text-slate-600"
                >
                  {{ showPin ? 'Hide' : 'Show' }} PIN
                </button>
              </div>
              <div class="p-4 rounded-xl text-sm" [ngClass]="getMobileInfoClass()">
                <p class="font-semibold">How it works:</p>
                <p class="mt-1 opacity-80">
                  Enter your {{ getMethodLabel() }} registered number and PIN. A confirmation
                  request will be sent to your mobile. Approve it to complete the payment.
                </p>
              </div>
              <p *ngIf="formError()" class="text-xs text-rose-500 font-bold">{{ formError() }}</p>
              <button
                (click)="processPayment()"
                [ngClass]="getPayBtnClass()"
                class="w-full py-4 text-white rounded-2xl font-black text-base transition-all shadow-lg hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
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
                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                  <path d="M12 18h.01" />
                </svg>
                Pay via {{ getMethodLabel() }}
              </button>
            </div>
          </div>

          <!-- ---- STEP 3: PROCESSING ---- -->
          <div
            *ngIf="payStep() === 'processing'"
            class="p-12 flex flex-col items-center justify-center gap-6 bg-white dark:bg-slate-900"
          >
            <div class="relative">
              <div
                class="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-slate-800"
              ></div>
              <div
                class="absolute inset-0 w-20 h-20 rounded-full border-4 border-t-mit-red animate-spin border-l-transparent border-r-transparent border-b-transparent"
              ></div>
            </div>
            <div class="text-center">
              <h4 class="text-lg font-bold text-slate-900 dark:text-white">
                Processing Securely...
              </h4>
              <p class="text-sm text-slate-500 mt-1">Please do not close this window</p>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
              Your payment is being verified via {{ getMethodLabel() }}
            </div>
          </div>

          <!-- ---- STEP 4: SUCCESS ---- -->
          <div *ngIf="payStep() === 'success'" class="p-6 space-y-5 bg-white dark:bg-slate-900">
            <div class="text-center py-4">
              <div
                class="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-emerald-600 dark:text-emerald-400"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h4 class="text-2xl font-black text-slate-900 dark:text-white">Payment Confirmed!</h4>
              <p class="text-slate-500 mt-1 text-sm">
                Your tuition payment has been processed successfully.
              </p>
            </div>

            <!-- Receipt details -->
            <div
              #successReceipt
              class="space-y-3 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"
            >
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">Transaction ID</span>
                <span class="font-mono font-bold text-slate-900 dark:text-white">{{
                  transactionId()
                }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">Payment Method</span>
                <span class="font-bold text-slate-900 dark:text-white">{{ getMethodLabel() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">Date & Time</span>
                <span class="font-bold text-slate-900 dark:text-white">{{ today() }}</span>
              </div>
              <div
                class="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-600"
              >
                <span class="font-bold text-slate-900 dark:text-white">Amount Paid</span>
                <span class="text-xl font-black text-emerald-600 dark:text-emerald-400"
                  >\${{ paidAmount() | number: '1.2-2' }}</span
                >
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <button
                (click)="downloadReceipt()"
                class="flex-1 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-lg"
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Download Receipt
              </button>
              <button
                (click)="finishPayment()"
                class="flex-1 py-3.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- HIDDEN RECEIPT FOR PDF -->
    <div style="position: absolute; left: -9999px; top: -9999px;">
      <div
        #printReceipt
        style="width: 794px; min-height: 400px; background: white; padding: 60px; font-family: sans-serif; color: #0f172a; box-sizing: border-box;"
      >
        <div
          style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #a31d1d; padding-bottom: 24px; margin-bottom: 32px;"
        >
          <div style="display: flex; align-items: center; gap: 16px;">
            <div
              style="width: 52px; height: 52px; background: #a31d1d; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 900;"
            >
              S
            </div>
            <div>
              <div
                style="font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px;"
              >
                Smart University
              </div>
              <div
                style="font-size: 10px; font-weight: 700; color: #64748b; letter-spacing: 3px; margin-top: 2px;"
              >
                OFFICIAL PAYMENT RECEIPT
              </div>
            </div>
          </div>
          <div style="text-align: right;">
            <div
              style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;"
            >
              Transaction ID
            </div>
            <div style="font-size: 16px; font-weight: 900; color: #a31d1d;">
              {{ transactionId() }}
            </div>
            <div style="font-size: 10px; font-weight: 600; color: #64748b; margin-top: 4px;">
              Date: {{ today() }}
            </div>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px;">
          <div>
            <div
              style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;"
            >
              Student Name
            </div>
            <div style="font-size: 14px; font-weight: 700;">{{ currentUserName() }}</div>
          </div>
          <div>
            <div
              style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;"
            >
              Payment Method
            </div>
            <div style="font-size: 14px; font-weight: 700;">{{ getMethodLabel() }}</div>
          </div>
          <div>
            <div
              style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;"
            >
              Description
            </div>
            <div style="font-size: 14px; font-weight: 700;">Semester Tuition Fee</div>
          </div>
          <div>
            <div
              style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;"
            >
              Status
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #16a34a;">
              PAID &amp; CONFIRMED
            </div>
          </div>
        </div>
        <div
          style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; display: flex; justify-content: space-between; align-items: center;"
        >
          <div>
            <div
              style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;"
            >
              Total Amount Paid
            </div>
            <div style="font-size: 32px; font-weight: 900; color: #a31d1d; margin-top: 4px;">
              \${{ paidAmount() | number: '1.2-2' }}
            </div>
          </div>
          <div
            style="text-align: center; border: 2px solid #a31d1d; border-radius: 12px; padding: 12px 20px;"
          >
            <div
              style="font-size: 8px; font-weight: 900; color: #a31d1d; text-transform: uppercase; letter-spacing: 2px;"
            >
              PAYMENT
            </div>
            <div
              style="font-size: 8px; font-weight: 900; color: #a31d1d; text-transform: uppercase; letter-spacing: 2px;"
            >
              VERIFIED
            </div>
          </div>
        </div>
        <div
          style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-end;"
        >
          <div>
            <div style="font-size: 10px; font-weight: 700; color: #94a3b8;">
              Smart University Finance Office
            </div>
            <div style="font-size: 9px; color: #cbd5e1; margin-top: 2px;">
              Campus OS v4.2.0 &bull; Auto-generated &bull; No signature required
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class StudentFinanceComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private pdfService = inject(PdfService);

  @ViewChild('printReceipt') receiptElement!: ElementRef;

  invoices = signal<any[]>([]);
  isModalOpen = signal(false);
  payStep = signal<'select' | 'form' | 'processing' | 'success'>('select');
  selectedMethod = signal<string>('');
  formError = signal('');
  transactionId = signal('');
  paidAmount = signal(0);
  today = signal(new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }));
  currentUserName = signal('');

  // Card form fields
  cardNumber = '';
  cardName = '';
  expiryMonth = '';
  expiryYear = '';
  cvv = '';
  showCvv = false;

  // Mobile banking fields
  mobileNumber = '';
  mobilePin = '';
  showPin = false;

  months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years = ['26', '27', '28', '29', '30', '31', '32'];

  balance = computed(() => {
    return this.invoices()
      .filter((i) => i.status === 'Unpaid')
      .reduce((acc, i) => acc + i.amount, 0);
  });

  ngOnInit() {
    this.loadData();
    const user = this.authService.currentUser();
    if (user) this.currentUserName.set(user.name || '');
  }

  loadData() {
    const user = this.authService.currentUser();
    if (!user) return;
    this.http.get<any[]>('http://localhost:8080/invoices').subscribe((data) => {
      this.invoices.set(data.filter((i) => i.studentId === user.id));
    });
  }

  openPaymentModal() {
    this.payStep.set('select');
    this.formError.set('');
    this.cardNumber = '';
    this.cardName = '';
    this.expiryMonth = '';
    this.expiryYear = '';
    this.cvv = '';
    this.mobileNumber = '';
    this.mobilePin = '';
    this.isModalOpen.set(true);
  }

  closePaymentModal() {
    if (this.payStep() === 'success') this.loadData();
    this.isModalOpen.set(false);
  }

  selectMethod(method: string) {
    this.selectedMethod.set(method);
    this.formError.set('');
    this.payStep.set('form');
  }

  formatCardNumber(event: any) {
    let val = event.target.value.replace(/\D/g, '').substring(0, 16);
    this.cardNumber = val.replace(/(.{4})/g, '$1 ').trim();
    event.target.value = this.cardNumber;
  }

  processPayment() {
    this.formError.set('');
    // Validate card form
    if (this.selectedMethod() === 'card') {
      const raw = this.cardNumber.replace(/\s/g, '');
      if (raw.length < 16) {
        this.formError.set('Please enter a valid 16-digit card number.');
        return;
      }
      if (!this.cardName.trim()) {
        this.formError.set('Please enter the cardholder name.');
        return;
      }
      if (!this.expiryMonth || !this.expiryYear) {
        this.formError.set('Please select the card expiry date.');
        return;
      }
      if (this.cvv.length < 3) {
        this.formError.set('Please enter a valid CVV.');
        return;
      }
    } else {
      if (this.mobileNumber.length < 10) {
        this.formError.set('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (this.mobilePin.length < 4) {
        this.formError.set('Please enter your PIN (minimum 4 digits).');
        return;
      }
    }

    // Go to processing step
    this.payStep.set('processing');

    // Simulate 2.5-second gateway processing
    setTimeout(() => {
      const txnId = 'TXN-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      this.transactionId.set(txnId);
      this.paidAmount.set(this.balance());
      this.today.set(
        new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
      );

      // Mark all unpaid invoices as Paid in the DB
      const unpaid = this.invoices().filter((i) => i.status === 'Unpaid');
      unpaid.forEach((inv) => {
        this.http
          .patch(`http://localhost:8080/invoices/${inv.id}`, {
            status: 'Paid',
            tranId: txnId,
            paidDate: new Date().toISOString(),
            paymentMethod: this.getMethodLabel(),
          })
          .subscribe({ error: (err) => console.error('Failed to update invoice:', err) });
      });

      this.payStep.set('success');
    }, 2500);
  }

  async downloadReceipt() {
    if (!this.receiptElement?.nativeElement) return;
    try {
      const canvas = await html2canvas(this.receiptElement.nativeElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4', compress: true });
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'JPEG', 0, 0, pw, ph, undefined, 'FAST');
      pdf.save(`Payment_Receipt_${this.transactionId()}.pdf`);
    } catch (err) {
      console.error('Receipt PDF error:', err);
    }
  }

  finishPayment() {
    this.loadData();
    this.closePaymentModal();
  }

  downloadInvoice(invoice: any) {
    this.pdfService.generateInvoicePDF(invoice);
  }

  // --- Method display helpers ---
  getMethodLabel(): string {
    const m = this.selectedMethod();
    if (m === 'card') return 'Credit / Debit Card';
    if (m === 'bkash') return 'bKash';
    if (m === 'nagad') return 'Nagad';
    if (m === 'rocket') return 'Rocket (DBBL)';
    return m;
  }

  getMethodShortLabel(): string {
    const m = this.selectedMethod();
    if (m === 'card') return '💳';
    if (m === 'bkash') return 'bK';
    if (m === 'nagad') return 'NG';
    if (m === 'rocket') return 'RKT';
    return m[0];
  }

  getMethodBgClass(): string {
    const m = this.selectedMethod();
    if (m === 'card')
      return 'bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30';
    if (m === 'bkash')
      return 'bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-800/30';
    if (m === 'nagad')
      return 'bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30';
    if (m === 'rocket')
      return 'bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30';
    return '';
  }

  getMethodIconClass(): string {
    const m = this.selectedMethod();
    if (m === 'card') return 'bg-blue-600';
    if (m === 'bkash') return 'bg-pink-600';
    if (m === 'nagad') return 'bg-orange-500';
    if (m === 'rocket') return 'bg-purple-600';
    return 'bg-slate-500';
  }

  getMobileRingClass(): string {
    const m = this.selectedMethod();
    if (m === 'bkash') return 'focus:ring-pink-500';
    if (m === 'nagad') return 'focus:ring-orange-500';
    if (m === 'rocket') return 'focus:ring-purple-500';
    return 'focus:ring-blue-500';
  }

  getMobileInfoClass(): string {
    const m = this.selectedMethod();
    if (m === 'bkash')
      return 'bg-pink-50 dark:bg-pink-900/10 text-pink-800 dark:text-pink-300 border border-pink-100 dark:border-pink-800/30';
    if (m === 'nagad')
      return 'bg-orange-50 dark:bg-orange-900/10 text-orange-800 dark:text-orange-300 border border-orange-100 dark:border-orange-800/30';
    if (m === 'rocket')
      return 'bg-purple-50 dark:bg-purple-900/10 text-purple-800 dark:text-purple-300 border border-purple-100 dark:border-purple-800/30';
    return '';
  }

  getPayBtnClass(): string {
    const m = this.selectedMethod();
    if (m === 'bkash')
      return 'bg-pink-600 hover:bg-pink-700 shadow-pink-600/30 hover:shadow-pink-600/50';
    if (m === 'nagad')
      return 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30 hover:shadow-orange-500/50';
    if (m === 'rocket')
      return 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30 hover:shadow-purple-600/50';
    return 'bg-blue-600 hover:bg-blue-700';
  }
}
