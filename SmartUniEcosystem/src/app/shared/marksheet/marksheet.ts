import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PdfService } from '../../core/services/pdf.service';

@Component({
  selector: 'app-marksheet',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">Marksheet</h1>
          <p class="text-sm text-slate-500">Individual marksheet for the selected student.</p>
        </div>
        <div>
          <button (click)="downloadPdf()" class="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold">Download PDF</button>
        </div>
      </div>

      <div class="glass-panel p-4">
        <div *ngIf="student()" class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold">{{ student().name.charAt(0) }}</div>
          <div>
            <div class="font-bold text-lg">{{ student().name }}</div>
            <div class="text-xs text-slate-500">{{ student().id }} &bull; {{ student().email }}</div>
            <div class="text-xs text-slate-500">{{ student().program }}</div>
          </div>
        </div>
      </div>

      <div class="glass-panel overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b">
              <th class="px-4 py-2 text-xs font-bold text-slate-500">Course</th>
              <th class="px-4 py-2 text-xs font-bold text-slate-500 text-center">Credits</th>
              <th class="px-4 py-2 text-xs font-bold text-slate-500 text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let g of grades()" class="border-b">
              <td class="px-4 py-3 font-bold">{{ g.courseId }}</td>
              <td class="px-4 py-3 text-center">{{ g.credits }}</td>
              <td class="px-4 py-3 text-center font-bold">{{ g.grade }}</td>
            </tr>
            <tr *ngIf="grades().length === 0">
              <td colspan="3" class="px-4 py-8 text-center text-slate-500">No grades found for this student.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class MarksheetComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private pdfService = inject(PdfService);

  student = signal<any>(null);
  grades = signal<any[]>([]);
  courses = signal<any[]>([]);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || this.route.snapshot.queryParamMap.get('id') || '';
    this.loadData(id);
  }

  loadData(studentId: string) {
    const sid = studentId || '3';

    // Load student profile
    this.http.get<any[]>('http://localhost:3000/students').subscribe(students => {
      const match = students.find(s => s.id === sid);
      if (match) this.student.set(match);
      else this.student.set({ id: sid, name: 'Unknown Student', email: '', program: '' });
    });

    // Load courses
    this.http.get<any[]>('http://localhost:3000/courses').subscribe(data => this.courses.set(data || []));

    // Load grades
    this.http.get<any[]>('http://localhost:3000/studentGrades').subscribe(data => {
      const filtered = (data || []).filter(g => String(g.studentId) === String(sid));
      this.grades.set(filtered);
    });
  }

  downloadPdf() {
    if (this.student()) {
      this.pdfService.generateOfficialTranscript(this.student(), this.grades(), this.courses());
    }
  }
}
