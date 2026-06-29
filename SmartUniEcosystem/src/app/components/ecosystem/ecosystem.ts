import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-ecosystem',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ecosystem.html',
})
export class Ecosystem {
  private http = inject(HttpClient);

  faculties = signal<any[]>([]);
  departments = signal<any[]>([]);

  ngOnInit() {
    this.http
      .get<any[]>(`${environment.apiUrl}/faculties`)
      .subscribe((data) => this.faculties.set(data));
    this.http
      .get<any[]>(`${environment.apiUrl}/departments`)
      .subscribe((data) => this.departments.set(data));
  }

  getDepartmentsForFaculty(facultyId: string) {
    return this.departments().filter((d) => d.facultyId === facultyId);
  }
}
