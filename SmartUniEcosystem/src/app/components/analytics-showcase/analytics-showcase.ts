import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PdfService } from '../../core/services/pdf.service';

@Component({
  selector: 'app-analytics-showcase',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './analytics-showcase.html',
})
export class AnalyticsShowcase {
  private pdfService = inject(PdfService);

  exportReport() {
    this.pdfService.generateExecutiveAnalyticsSummary();
  }
}
