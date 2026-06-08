import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 px-4 flex items-center justify-center">
      <div class="max-w-2xl w-full">
        <div id="receipt-box" class="glass-panel p-10 space-y-8 relative overflow-hidden bg-white dark:bg-slate-900 shadow-2xl rounded-3xl border border-slate-200 dark:border-slate-800">
          <!-- Receipt Header for PDF -->
          <div class="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-8">
            <div>
              <h2 class="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Receipt</h2>
              <p class="text-slate-500 font-medium">Smart University Ecosystem</p>
            </div>
            <div class="text-right">
              <div class="w-12 h-12 bg-mit-red text-white rounded-lg flex items-center justify-center font-bold text-2xl mx-auto md:ml-auto">S</div>
            </div>
          </div>
          
          <div class="text-center py-4">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Payment Received</h3>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Transaction ID</span>
              <span class="font-mono font-bold text-slate-900 dark:text-white">{{ tranId }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Date</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ today | date:'medium' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Method</span>
              <span class="font-bold text-slate-900 dark:text-white">SSLCommerz Gateway</span>
            </div>
            <div class="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-center">
              <span class="text-lg font-bold text-slate-900 dark:text-white">Total Amount</span>
              <span class="text-3xl font-black text-mit-red">{{ amount | number:'1.2-2' }} BDT</span>
            </div>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/50">
            <p class="text-sm text-blue-800 dark:text-blue-300 leading-relaxed italic text-center font-medium">
              "This is a computer-generated receipt and does not require a physical signature."
            </p>
          </div>

          <!-- Buttons (Hidden in PDF) -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4 no-print">
            <button (click)="downloadReceipt()" class="flex-1 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Download PDF
            </button>
            <a routerLink="/student/dashboard" class="flex-1 px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center">
              Go to Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `:host { display: block; }`,
    `@media print { .no-print { display: none !important; } }`
  ]
})
export class PaymentSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  
  tranId: string = 'REF-' + Math.random().toString(36).substring(7).toUpperCase();
  today = new Date();
  amount: number = 100.00;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['tran_id']) {
        this.tranId = params['tran_id'];
        // Try to find the invoice and mark it paid
        this.markInvoicePaid(this.tranId);
      }
    });
  }

  private markInvoicePaid(tranId: string) {
    if (!tranId) return;
    this.http.get<any[]>(`http://localhost:3000/invoices?tranId=${tranId}`).subscribe(invoices => {
      if (invoices && invoices.length > 0) {
        const inv = invoices[0];
        this.amount = inv.amount || this.amount;
        if (inv.status !== 'paid') {
          this.http.patch(`http://localhost:3000/invoices/${inv.id}`, { status: 'paid' }).subscribe({
            next: () => console.log('Invoice marked paid:', inv.id),
            error: err => console.error('Failed to update invoice status', err)
          });
        }
      }
    }, err => console.error('Failed to fetch invoice', err));
  }

  async downloadReceipt() {
    const element = document.getElementById('receipt-box');
    if (!element) return;

    // Hide buttons for the receipt capture
    const buttons = element.querySelector('.no-print');
    if (buttons) (buttons as HTMLElement).style.display = 'none';

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: null,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CU-Receipt-${this.tranId}.pdf`);
    } catch (err) {
      console.error('Receipt generation failed:', err);
    } finally {
      if (buttons) (buttons as HTMLElement).style.display = 'flex';
    }
  }
}
