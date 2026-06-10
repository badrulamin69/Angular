import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 px-4">
      <div class="max-w-xl mx-auto">
        <div class="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">

          <!-- ---- STEP: SELECT ---- -->
          <ng-container *ngIf="step() === 'select'">
            <div class="bg-gradient-to-r from-mit-red to-orange-500 p-8 text-white">
              <h2 class="text-3xl font-bold">Payment Gateway</h2>
              <p class="text-white/80 mt-2">Select your preferred payment method to continue</p>
            </div>
            <div class="p-8 space-y-4">
              <!-- Amount -->
              <div class="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <span class="text-slate-500 dark:text-slate-400">Description</span>
                <span class="font-bold text-slate-900 dark:text-white">Semester Tuition Fee</span>
              </div>
              <div class="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <span class="text-xl font-bold text-slate-900 dark:text-white">Total Amount</span>
                <span class="text-3xl font-black text-mit-red">100.00 BDT</span>
              </div>

              <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider pt-2">Choose Payment Method</p>

              <!-- Card -->
              <button (click)="selectMethod('card')" class="w-full p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-4 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group">
                <div class="flex gap-1.5">
                  <div class="w-10 h-7 rounded bg-blue-700 flex items-center justify-center text-white text-[9px] font-black">VISA</div>
                  <div class="w-10 h-7 rounded bg-orange-500 flex items-center justify-center text-white text-[8px] font-black">MC</div>
                </div>
                <div class="text-left flex-1">
                  <p class="font-bold text-slate-800 dark:text-slate-200">Credit / Debit Card</p>
                  <p class="text-xs text-slate-400">Visa, Mastercard</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-300 group-hover:text-blue-500"><path d="m9 18 6-6-6-6"/></svg>
              </button>

              <!-- bKash -->
              <button (click)="selectMethod('bkash')" class="w-full p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-4 hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all group">
                <div class="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white text-[10px] font-black">bK</div>
                <div class="text-left flex-1">
                  <p class="font-bold text-slate-800 dark:text-slate-200">bKash Mobile Banking</p>
                  <p class="text-xs text-slate-400">Send from bKash wallet</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-300 group-hover:text-pink-500"><path d="m9 18 6-6-6-6"/></svg>
              </button>

              <!-- Nagad -->
              <button (click)="selectMethod('nagad')" class="w-full p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-4 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all group">
                <div class="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-black">NG</div>
                <div class="text-left flex-1">
                  <p class="font-bold text-slate-800 dark:text-slate-200">Nagad Mobile Banking</p>
                  <p class="text-xs text-slate-400">Bangladesh Post Office digital wallet</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-300 group-hover:text-orange-500"><path d="m9 18 6-6-6-6"/></svg>
              </button>

              <!-- Rocket -->
              <button (click)="selectMethod('rocket')" class="w-full p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-4 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all group">
                <div class="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] font-black">RKT</div>
                <div class="text-left flex-1">
                  <p class="font-bold text-slate-800 dark:text-slate-200">Rocket (DBBL) Banking</p>
                  <p class="text-xs text-slate-400">Dutch-Bangla Bank mobile banking</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-300 group-hover:text-purple-500"><path d="m9 18 6-6-6-6"/></svg>
              </button>

              <p class="text-center text-xs text-slate-400 dark:text-slate-500 pt-2">
                By proceeding, you agree to the University's terms of service and refund policy.
              </p>
            </div>
          </ng-container>

          <!-- ---- STEP: FORM ---- -->
          <ng-container *ngIf="step() === 'form'">
            <div [ngClass]="getHeaderClass()" class="p-6 text-white">
              <button (click)="step.set('select')" class="flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>Back
              </button>
              <h2 class="text-2xl font-bold">{{ getMethodLabel() }}</h2>
              <p class="text-white/80 mt-1">Amount: <span class="font-black">100.00 BDT</span></p>
            </div>
            <div class="p-8 space-y-4">
              <!-- Card fields -->
              <ng-container *ngIf="selectedMethod() === 'card'">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Card Number</label>
                  <input type="text" [(ngModel)]="cardNumber" maxlength="19" placeholder="1234 5678 9012 3456" (input)="formatCardNumber($event)"
                    class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cardholder Name</label>
                  <input type="text" [(ngModel)]="cardName" placeholder="As printed on card"
                    class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Expiry</label>
                    <div class="flex gap-2">
                      <select [(ngModel)]="expiryMonth" class="flex-1 px-2 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">MM</option>
                        <option *ngFor="let m of months" [value]="m">{{ m }}</option>
                      </select>
                      <select [(ngModel)]="expiryYear" class="flex-1 px-2 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">YY</option>
                        <option *ngFor="let y of years" [value]="y">{{ y }}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">CVV</label>
                    <input [type]="showCvv ? 'text' : 'password'" [(ngModel)]="cvv" maxlength="4" placeholder="•••"
                      class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                    <button type="button" (click)="showCvv = !showCvv" class="text-[10px] text-slate-400 mt-1">{{ showCvv ? 'Hide' : 'Show' }} CVV</button>
                  </div>
                </div>
              </ng-container>

              <!-- Mobile fields -->
              <ng-container *ngIf="selectedMethod() !== 'card'">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Registered Mobile Number</label>
                  <div class="flex">
                    <span class="px-3 py-3 bg-slate-100 dark:bg-slate-700 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-xl text-slate-500 font-mono text-sm">+880</span>
                    <input type="tel" [(ngModel)]="mobileNumber" maxlength="10" placeholder="1XXXXXXXXX"
                      class="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-r-xl font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">PIN</label>
                  <input [type]="showPin ? 'text' : 'password'" [(ngModel)]="mobilePin" maxlength="6" placeholder="Enter your PIN"
                    class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                  <button type="button" (click)="showPin = !showPin" class="text-[10px] text-slate-400 mt-1">{{ showPin ? 'Hide' : 'Show' }} PIN</button>
                </div>
              </ng-container>

              <p *ngIf="formError()" class="text-xs text-rose-500 font-bold">{{ formError() }}</p>

              <button (click)="processPayment()" [ngClass]="getPayBtnClass()" class="w-full py-4 text-white rounded-2xl font-black text-base transition-all shadow-lg hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2">
                Pay 100.00 BDT
              </button>
            </div>
          </ng-container>

          <!-- ---- STEP: PROCESSING ---- -->
          <ng-container *ngIf="step() === 'processing'">
            <div class="p-16 flex flex-col items-center justify-center gap-6">
              <div class="relative">
                <div class="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
                <div class="absolute inset-0 w-20 h-20 rounded-full border-4 border-t-mit-red animate-spin border-l-transparent border-r-transparent border-b-transparent"></div>
              </div>
              <div class="text-center">
                <h4 class="text-lg font-bold text-slate-900 dark:text-white">Processing Payment...</h4>
                <p class="text-sm text-slate-500 mt-1">Connecting to {{ getMethodLabel() }} gateway</p>
              </div>
            </div>
          </ng-container>

          <!-- ---- STEP: SUCCESS ---- -->
          <ng-container *ngIf="step() === 'success'">
            <div class="p-8 space-y-5">
              <div class="text-center py-4">
                <div class="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600 dark:text-emerald-400"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <h4 class="text-2xl font-black text-slate-900 dark:text-white">Payment Confirmed!</h4>
                <p class="text-slate-500 mt-1 text-sm">Your payment was processed successfully.</p>
              </div>
              <div class="space-y-3 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">Transaction ID</span>
                  <span class="font-mono font-bold text-slate-900 dark:text-white">{{ transactionId() }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">Method</span>
                  <span class="font-bold text-slate-900 dark:text-white">{{ getMethodLabel() }}</span>
                </div>
                <div class="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-600">
                  <span class="font-bold text-slate-900 dark:text-white">Amount Paid</span>
                  <span class="text-xl font-black text-emerald-600">100.00 BDT</span>
                </div>
              </div>
              <a routerLink="/student/finance" class="block w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-center hover:scale-[1.01] transition-all shadow-lg">
                Return to Finance Portal
              </a>
            </div>
          </ng-container>

        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class PaymentDemo {
  private router = inject(Router);

  step = signal<'select' | 'form' | 'processing' | 'success'>('select');
  selectedMethod = signal('');
  formError = signal('');
  transactionId = signal('');

  cardNumber = ''; cardName = ''; expiryMonth = ''; expiryYear = ''; cvv = '';
  showCvv = false;
  mobileNumber = ''; mobilePin = ''; showPin = false;

  months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  years = ['26','27','28','29','30','31','32'];

  selectMethod(m: string) { this.selectedMethod.set(m); this.formError.set(''); this.step.set('form'); }

  formatCardNumber(event: any) {
    let val = event.target.value.replace(/\D/g, '').substring(0, 16);
    this.cardNumber = val.replace(/(.{4})/g, '$1 ').trim();
    event.target.value = this.cardNumber;
  }

  processPayment() {
    this.formError.set('');
    if (this.selectedMethod() === 'card') {
      if (this.cardNumber.replace(/\s/g, '').length < 16) { this.formError.set('Enter a valid 16-digit card number.'); return; }
      if (!this.cardName.trim()) { this.formError.set('Enter the cardholder name.'); return; }
      if (!this.expiryMonth || !this.expiryYear) { this.formError.set('Select card expiry date.'); return; }
      if (this.cvv.length < 3) { this.formError.set('Enter a valid CVV.'); return; }
    } else {
      if (this.mobileNumber.length < 10) { this.formError.set('Enter a valid 10-digit mobile number.'); return; }
      if (this.mobilePin.length < 4) { this.formError.set('Enter your PIN.'); return; }
    }
    this.step.set('processing');
    setTimeout(() => {
      this.transactionId.set('TXN-' + Math.random().toString(36).substring(2, 8).toUpperCase());
      this.step.set('success');
    }, 2500);
  }

  getMethodLabel(): string {
    const m = this.selectedMethod();
    if (m === 'card') return 'Credit / Debit Card';
    if (m === 'bkash') return 'bKash';
    if (m === 'nagad') return 'Nagad';
    if (m === 'rocket') return 'Rocket (DBBL)';
    return m;
  }

  getHeaderClass(): string {
    const m = this.selectedMethod();
    if (m === 'bkash') return 'bg-pink-600';
    if (m === 'nagad') return 'bg-orange-500';
    if (m === 'rocket') return 'bg-purple-600';
    return 'bg-gradient-to-r from-blue-600 to-blue-700';
  }

  getPayBtnClass(): string {
    const m = this.selectedMethod();
    if (m === 'bkash') return 'bg-pink-600 hover:bg-pink-700';
    if (m === 'nagad') return 'bg-orange-500 hover:bg-orange-600';
    if (m === 'rocket') return 'bg-purple-600 hover:bg-purple-700';
    return 'bg-blue-600 hover:bg-blue-700';
  }
}
