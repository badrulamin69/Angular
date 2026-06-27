import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
      .get<any[]>('http://localhost:8080/faculties')
      .subscribe((data) => this.faculties.set(data));
    this.http
      .get<any[]>('http://localhost:8080/departments')
      .subscribe((data) => this.departments.set(data));
  }

  getDepartmentsForFaculty(facultyId: string) {
    return this.departments().filter((d) => d.facultyId === facultyId);
  }
}
