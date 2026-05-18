import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 px-4">
      <div class="max-w-xl mx-auto">
        <div class="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
          <!-- Header -->
          <div class="bg-gradient-to-r from-mit-red to-orange-500 p-8 text-white">
            <h2 class="text-3xl font-bold">Payment Gateway</h2>
            <p class="text-white/80 mt-2">Secure SSLCommerz Integration for University Management</p>
          </div>

          <!-- Body -->
          <div class="p-8 space-y-6">
            <div class="space-y-4">
              <div class="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <span class="text-slate-500 dark:text-slate-400">Description</span>
                <span class="font-bold text-slate-900 dark:text-white">Semester Tuition Fee</span>
              </div>
              <div class="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <span class="text-slate-500 dark:text-slate-400">Transaction ID</span>
                <span class="font-mono text-sm text-slate-700 dark:text-slate-300">REF-AUTO-GENERATED</span>
              </div>
              <div class="flex justify-between items-center pt-2">
                <span class="text-xl font-bold text-slate-900 dark:text-white">Total Amount</span>
                <span class="text-3xl font-black text-mit-red">100.00 BDT</span>
              </div>
            </div>

            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl flex gap-4">
              <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              </div>
              <div>
                <h4 class="font-bold text-blue-900 dark:text-blue-300">Secure Payment</h4>
                <p class="text-sm text-blue-700/70 dark:text-blue-400/70">You will be redirected to the SSLCommerz secure payment page to complete your transaction.</p>
              </div>
            </div>

            <button 
              (click)="initiatePayment()"
              class="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/10 flex items-center justify-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              Pay via SSLCommerz
            </button>

            <p class="text-center text-xs text-slate-400 dark:text-slate-500">
              By clicking "Pay", you agree to the University's terms of service and refund policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class PaymentDemo {
  initiatePayment() {
    // Simply redirect to our Node.js server's /init endpoint
    window.location.href = 'http://localhost:3030/init';
  }
}
