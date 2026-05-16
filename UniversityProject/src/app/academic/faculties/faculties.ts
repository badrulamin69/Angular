import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface University {
  id: string;
  name: string;
  location: string;
  status: string;
}

interface Department {
  id: string;
  name: string;
  headId: string;
  universityId: string;
}

@Component({
  selector: 'app-faculties',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './faculties.html'
})
export class FacultiesComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  
  departments = signal<Department[]>([]);
  universities = signal<University[]>([]);
  searchQuery = signal('');
  selectedUniversity = signal('');
  
  deptForm = this.fb.group({
    name: ['', Validators.required],
    headId: ['', Validators.required],
    universityId: ['', Validators.required]
  });

  // Computed signal for filtered results
  filteredDepartments = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const uni = this.selectedUniversity();
    
    return this.departments().filter(dept => {
      const matchesSearch = dept.name.toLowerCase().includes(query) || dept.id.toLowerCase().includes(query);
      const matchesUni = !uni || dept.universityId === uni;
      return matchesSearch && matchesUni;
    });
  });

  isModalOpen = signal(false);
  
  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<Department[]>('http://localhost:3000/departments').subscribe(data => {
      this.departments.set(data);
    });
    this.http.get<University[]>('http://localhost:3000/universities').subscribe(data => {
      this.universities.set(data);
    });
  }

  openModal() {
    const firstUni = this.universities().length > 0 ? this.universities()[0].id : '';
    this.deptForm.reset({ universityId: firstUni });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  saveDepartment() {
    if (this.deptForm.valid) {
      const formValue = this.deptForm.value;
      const newDept: Department = {
        id: 'DEPT-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        name: formValue.name!,
        headId: formValue.headId!,
        universityId: formValue.universityId!
      };

      this.http.post<Department>('http://localhost:3000/departments', newDept).subscribe(res => {
        this.departments.update(d => [...d, res]);
        this.closeModal();
      });
    }
  }

  deleteDepartment(id: string) {
    if (confirm('Are you sure you want to delete this department?')) {
      this.http.delete(`http://localhost:3000/departments/${id}`).subscribe(() => {
        this.departments.update(d => d.filter(dept => dept.id !== id));
      });
    }
  }
}
