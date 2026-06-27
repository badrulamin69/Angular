import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-finance-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Billing & Invoices
          </h1>
          <p class="text-slate-500 mt-1">
            Manage per-credit billing, generate bulk invoices, and track payments.
          </p>
        </div>
        <button
          (click)="generateBulkInvoices()"
          class="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2"
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" x2="12" y1="18" y2="12" />
            <line x1="9" x2="15" y1="15" y2="15" />
          </svg>
          Generate Batch Invoices
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Controls -->
        <div class="space-y-4">
          <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider">
            Per Credit Rate System
          </h3>
          <div class="glass-panel p-5 space-y-4" *ngIf="rates()">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1"
                >Undergraduate Rate ($)</label
              >
              <input
                type="number"
                [(ngModel)]="rates()!.undergradRate"
                class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-emerald-500 text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1"
                >Postgraduate Rate ($)</label
              >
              <input
                type="number"
                [(ngModel)]="rates()!.gradRate"
                class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-emerald-500 text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1"
                >Lab/Facility Fee ($)</label
              >
              <input
                type="number"
                [(ngModel)]="rates()!.facilityFee"
                class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-emerald-500 text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>
            <button
              (click)="updateRates()"
              class="w-full py-2 bg-emerald-500 text-white font-bold rounded-lg shadow-sm hover:bg-emerald-600 transition-colors text-sm"
            >
              Update Global Rates
            </button>
          </div>
        </div>

        <!-- Invoices List -->
        <div class="lg:col-span-3 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">
              Active Student Invoices
            </h3>
            <div class="flex gap-2">
              <button
                (click)="filterStatus.set('All')"
                [class.bg-slate-200]="filterStatus() === 'All'"
                class="px-3 py-1 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-bold transition-colors"
              >
                All
              </button>
              <button
                (click)="filterStatus.set('Unpaid')"
                [class.bg-rose-100]="filterStatus() === 'Unpaid'"
                class="px-3 py-1 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded text-xs font-bold transition-colors"
              >
                Unpaid
              </button>
              <button
                (click)="filterStatus.set('Paid')"
                [class.bg-emerald-100]="filterStatus() === 'Paid'"
                class="px-3 py-1 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs font-bold transition-colors"
              >
                Paid
              </button>
            </div>
          </div>

          <div class="glass-panel overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr
                  class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700"
                >
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Invoice / Student
                  </th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Amount
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
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr
                  *ngFor="let inv of filteredInvoices()"
                  class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td class="px-6 py-4">
                    <p class="font-bold text-slate-900 dark:text-white">{{ inv.id }}</p>
                    <p class="text-xs text-slate-500 mt-0.5">
                      {{ inv.studentName }} ({{ inv.studentId }})
                    </p>
                  </td>
                  <td class="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                    {{ inv.credits }} Credits
                  </td>
                  <td class="px-6 py-4 font-mono font-black text-slate-900 dark:text-white">
                    \${{ inv.amount | number: '1.2-2' }}
                  </td>
                  <td class="px-6 py-4">
                    <span
                      [ngClass]="{
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400':
                          inv.status === 'Paid',
                        'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400':
                          inv.status === 'Unpaid',
                      }"
                      class="px-2.5 py-1 rounded-md text-xs font-bold"
                      >{{ inv.status }}</span
                    >
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button
                      *ngIf="inv.status === 'Unpaid'"
                      (click)="logPayment(inv)"
                      class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all"
                    >
                      Log Payment
                    </button>
                    <span *ngIf="inv.status === 'Paid'" class="text-xs font-bold text-slate-400"
                      >Processed</span
                    >
                  </td>
                </tr>
                <tr *ngIf="filteredInvoices().length === 0">
                  <td colspan="5" class="px-6 py-12 text-center text-slate-500 font-medium">
                    No invoices found for the selected filter.
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
export class FinanceBillingComponent implements OnInit {
  private http = inject(HttpClient);

  invoices = signal<any[]>([]);
  rates = signal<any>(null);
  filterStatus = signal<'All' | 'Paid' | 'Unpaid'>('All');

  filteredInvoices = computed(() => {
    const status = this.filterStatus();
    if (status === 'All') return this.invoices();
    return this.invoices().filter((i) => i.status === status);
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http
      .get<any[]>('http://localhost:8080/invoices')
      .subscribe((data) => this.invoices.set(data));
    this.http
      .get<any>('http://localhost:8080/financialRates')
      .subscribe((data) => this.rates.set(data));
  }

  updateRates() {
    this.http.patch('http://localhost:8080/financialRates', this.rates()).subscribe(() => {
      alert('Global rates updated successfully!');
    });
  }

  logPayment(invoice: any) {
    this.http
      .patch(`http://localhost:8080/invoices/${invoice.id}`, { status: 'Paid' })
      .subscribe((res) => {
        this.invoices.update((prev) =>
          prev.map((i) => (i.id === invoice.id ? { ...i, status: 'Paid' } : i)),
        );
      });
  }

  generateBulkInvoices() {
    // Simulation logic
    alert('Bulk invoice generation process started for the new semester.');
  }
}
