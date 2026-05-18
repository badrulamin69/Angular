import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface SystemStats {
  totalUniversities: number;
  totalStudents: number;
  totalRevenue: number;
  activeUsers: number;
}

import { RouterModule } from '@angular/router';
import { PdfService } from '../../core/services/pdf.service';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html'
})
export class SuperAdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private pdfService = inject(PdfService);
  stats = signal<SystemStats | null>(null);

  ngOnInit() {
    this.http.get<SystemStats>('http://localhost:3000/systemStats').subscribe(data => {
      this.stats.set(data);
    });
  }

  exportReport() {
    if (this.stats()) {
      this.pdfService.generateGlobalSystemReport(this.stats());
    } else {
      alert('System stats not loaded yet.');
    }
  }

  onboardUniversity() {
    alert('Redirecting to University Onboarding wizard...');
  }
}
