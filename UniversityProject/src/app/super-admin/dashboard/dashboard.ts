import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface SystemStats {
  totalUniversities: number;
  totalStudents: number;
  totalRevenue: number;
  activeUsers: number;
}

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class SuperAdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  stats = signal<SystemStats | null>(null);

  ngOnInit() {
    this.http.get<SystemStats>('http://localhost:3000/systemStats').subscribe(data => {
      this.stats.set(data);
    });
  }
}
