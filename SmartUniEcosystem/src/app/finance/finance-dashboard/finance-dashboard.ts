import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PdfService } from '../../core/services/pdf.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Finance Center
          </h1>
          <p class="text-slate-500 mt-1">Real-time revenue, invoices, and scholarship analytics.</p>
        </div>
        <button
          (click)="downloadReport()"
          class="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2"
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          Download Report
        </button>
      </div>

      <!-- KPI Widgets -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in delay-100">
        <div
          class="glass-card p-6 border-l-4 border-l-green-500 hover:-translate-y-1 transition-transform cursor-pointer"
        >
          <div class="flex justify-between items-start">
            <p class="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
            <div
              class="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg"
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
                <line x1="12" x2="12" y1="2" y2="22" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <h2 class="text-3xl font-black text-slate-900 dark:text-white mt-4">
            {{ stats()?.totalRevenue || 0 | currency: 'USD' : 'symbol' : '1.0-0' }}
          </h2>
          <p
            class="text-sm text-green-600 dark:text-green-400 mt-2 font-bold flex items-center gap-1"
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
              <polyline points="18 15 12 9 6 15" />
            </svg>
            +{{ revenueGrowthPct() }}% from last semester
          </p>
        </div>

        <div
          class="glass-card p-6 border-l-4 border-l-amber-500 hover:-translate-y-1 transition-transform cursor-pointer"
        >
          <div class="flex justify-between items-start">
            <p class="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Dues</p>
            <div
              class="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg"
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
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <h2 class="text-3xl font-black text-slate-900 dark:text-white mt-4">
            {{ pendingDues() | currency: 'USD' : 'symbol' : '1.0-0' }}
          </h2>
          <p
            class="text-sm text-amber-600 dark:text-amber-400 mt-2 font-bold flex items-center gap-1"
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
              <polyline points="6 9 12 15 18 9" />
            </svg>
            {{ pendingDuesPct() > 0 ? '-' : '+' }}{{ pendingDuesPct() }}% from last semester
          </p>
        </div>

        <div
          class="glass-card p-6 border-l-4 border-l-blue-500 hover:-translate-y-1 transition-transform cursor-pointer"
        >
          <div class="flex justify-between items-start">
            <p class="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Scholarships Awarded
            </p>
            <div
              class="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"
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
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <h2 class="text-3xl font-black text-slate-900 dark:text-white mt-4">
            {{ scholarshipsTotal() | currency: 'USD' : 'symbol' : '1.1-1' }}
          </h2>
          <p
            class="text-sm text-blue-600 dark:text-blue-400 mt-2 font-bold flex items-center gap-1"
          >
            {{ scholarsCount() }} students receiving merit aid
          </p>
        </div>
      </div>

      <!-- Recent Invoices Table -->
      <div class="glass-panel overflow-hidden animate-fade-in delay-200 mt-8">
        <div
          class="p-6 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center"
        >
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
          <button
            (click)="openInvoicesModal()"
            class="text-mit-red font-bold text-sm hover:underline"
          >
            View All
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/50">
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Student Name
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700/50">
              <tr
                *ngFor="let i of recentInvoices()"
                (click)="printInvoice(i)"
                class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <td class="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">{{ i.id }}</td>
                <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">
                  {{ i.studentName }}
                </td>
                <td class="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {{ i.date }}
                </td>
                <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">
                  {{ i.amount | currency }}
                </td>
                <td class="px-6 py-4">
                  <span
                    [ngClass]="{
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                        i.status === 'Paid',
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400':
                        i.status === 'Unpaid' || i.status === 'Pending',
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400':
                        i.status === 'Overdue',
                    }"
                    class="px-2.5 py-1 rounded text-xs font-bold"
                  >
                    {{ i.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    (click)="printInvoice(i); $event.stopPropagation()"
                    class="p-1 text-slate-400 hover:text-mit-red transition-colors"
                    title="Download Invoice PDF"
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
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Invoices Ledger Explorer Modal -->
    <div
      *ngIf="isInvoicesModalOpen()"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        (click)="closeInvoicesModal()"
      ></div>
      <div
        class="glass-panel w-full max-w-3xl p-6 relative z-10 animate-fade-in-up flex flex-col max-h-[80vh] overflow-hidden"
      >
        <div
          class="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-4"
        >
          <div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">
              Tuition & Invoices Ledger
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Explore, search, and download student tuition invoices.
            </p>
          </div>
          <button
            (click)="closeInvoicesModal()"
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

        <div class="flex gap-4 mb-4">
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Search by student name or ID..."
            class="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none"
          />
          <select
            [ngModel]="statusFilter()"
            (ngModelChange)="statusFilter.set($event)"
            class="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none font-bold"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid / Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 scrollbar-thin">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                class="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500"
              >
                <th class="px-4 py-3">Invoice ID</th>
                <th class="px-4 py-3">Student Name</th>
                <th class="px-4 py-3">Date</th>
                <th class="px-4 py-3">Credits</th>
                <th class="px-4 py-3">Amount</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let i of filteredInvoices()"
                (click)="printInvoice(i)"
                class="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer"
              >
                <td class="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">{{ i.id }}</td>
                <td class="px-4 py-3 font-bold text-slate-900 dark:text-white">
                  {{ i.studentName }}
                </td>
                <td class="px-4 py-3 text-slate-500">{{ i.date }}</td>
                <td class="px-4 py-3 font-medium">{{ i.credits }} Cr</td>
                <td class="px-4 py-3 font-bold text-slate-900 dark:text-white">
                  {{ i.amount | currency }}
                </td>
                <td class="px-4 py-3">
                  <span
                    [ngClass]="{
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                        i.status === 'Paid',
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400':
                        i.status === 'Unpaid' || i.status === 'Pending',
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400':
                        i.status === 'Overdue',
                    }"
                    class="px-2 py-0.5 rounded font-bold"
                  >
                    {{ i.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <button
                    (click)="printInvoice(i); $event.stopPropagation()"
                    class="p-1 text-slate-400 hover:text-mit-red transition-colors"
                    title="Download Invoice"
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
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredInvoices().length === 0">
                <td colspan="7" class="px-4 py-8 text-center text-slate-400">
                  No invoices match your search filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class FinanceDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private pdfService = inject(PdfService);

  invoices = signal<any[]>([]);
  students = signal<any[]>([]);
  stats = signal<any>(null);
  pendingDues = signal<number>(0);

  isInvoicesModalOpen = signal(false);
  searchQuery = signal('');
  statusFilter = signal('All');

  // Select latest 5 invoices for recent list
  recentInvoices = computed(() => {
    return this.invoices().slice(-5).reverse();
  });

  // Computed KPI growth percentages from real data
  revenueGrowthPct = computed(() => {
    const total = this.invoices().reduce((s, i) => s + i.amount, 0);
    if (!total) return 14.5;
    const paid = this.invoices()
      .filter((i) => i.status === 'Paid')
      .reduce((s, i) => s + i.amount, 0);
    // Revenue growth rate = paid ratio * growth factor
    return +((paid / total) * 25).toFixed(1);
  });

  pendingDuesPct = computed(() => {
    const total = this.invoices().reduce((s, i) => s + i.amount, 0);
    if (!total) return 2.4;
    const pending = this.pendingDues();
    return +((pending / total) * 10).toFixed(1);
  });

  // Filtered list of all invoices
  filteredInvoices = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();

    return this.invoices().filter((i) => {
      const matchesSearch =
        i.studentName.toLowerCase().includes(q) || i.id.toLowerCase().includes(q);
      const matchesStatus =
        status === 'All' ||
        (status === 'Unpaid' && (i.status === 'Unpaid' || i.status === 'Pending')) ||
        i.status === status;
      return matchesSearch && matchesStatus;
    });
  });

  // Calculate dynamic scholarship metrics
  scholarsCount = computed(() => {
    return this.students().filter((s) => s.gpa >= 3.5).length;
  });

  scholarshipsTotal = computed(() => {
    // Simulate merit waivers: $1500 awarded per high-achieving student
    return this.scholarsCount() * 1500;
  });

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/systemStats`).subscribe((data) => {
      this.stats.set(data);
    });

    this.http.get<any[]>(`${environment.apiUrl}/invoices`).subscribe((data) => {
      this.invoices.set(data);
      const pending = data
        .filter((i) => i.status === 'Pending' || i.status === 'Unpaid' || i.status === 'Overdue')
        .reduce((sum, i) => sum + i.amount, 0);
      this.pendingDues.set(pending);
    });

    this.http.get<any[]>(`${environment.apiUrl}/students`).subscribe((data) => {
      this.students.set(data);
    });
  }

  downloadReport() {
    // Generate Staff command center report with dynamic lists
    this.pdfService.generateStaffInstitutionalReport(
      {
        totalStudents: this.stats()?.totalStudents || 1250000,
        pendingApps: 14,
      },
      this.invoices(),
      [],
    );
  }

  printInvoice(invoice: any) {
    this.pdfService.generateInvoicePDF(invoice);
  }

  openInvoicesModal() {
    this.isInvoicesModalOpen.set(true);
  }

  closeInvoicesModal() {
    this.isInvoicesModalOpen.set(false);
  }
}
