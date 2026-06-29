import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pricing.html',
})
export class Pricing implements OnInit {
  private http = inject(HttpClient);

  isAnnual = signal(true);
  plans = signal<any[]>([]);

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/pricingPlans`).subscribe((data) => {
      this.plans.set(data);
    });
  }

  toggleAnnual(value: boolean) {
    this.isAnnual.set(value);
  }
}
