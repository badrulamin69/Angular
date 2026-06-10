import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PdfService } from '../../core/services/pdf.service';
import { DynamicActionButtonComponent } from '../../shared/components/dynamic-action-button/dynamic-action-button.component';
import { DynamicAction } from '../../core/services/icon-resolver.service';

interface Faculty {
  id: string;
  name: string;
  bnName: string;
  universityId: string;
}

interface University {
  id: string;
  name: string;
  location: string;
  status: string;
}

interface Department {
  id: string;
  name: string;
  bnName: string;
  facultyId: string;
  universityId: string;
  headId?: string;
}

@Component({
  selector: 'app-faculties',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DynamicActionButtonComponent],
  templateUrl: './faculties.html'
})
export class FacultiesComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private pdfService = inject(PdfService);
  
  departments = signal<Department[]>([]);
  faculties = signal<Faculty[]>([]);
  universities = signal<University[]>([]);
  searchQuery = signal('');
  selectedUniversity = signal('');
  selectedFaculty = signal('');
  
  deptForm = this.fb.group({
    name: ['', Validators.required],
    bnName: ['', Validators.required],
    facultyId: ['', Validators.required],
    universityId: ['', Validators.required]
  });

  // Computed signal for filtered results
  filteredDepartments = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const uni = this.selectedUniversity();
    const fac = this.selectedFaculty();
    
    return this.departments().filter(dept => {
      const matchesSearch = 
        dept.name.toLowerCase().includes(query) || 
        dept.bnName.toLowerCase().includes(query) ||
        dept.id.toLowerCase().includes(query);
      const matchesUni = !uni || dept.universityId === uni;
      const matchesFac = !fac || dept.facultyId === fac;
      return matchesSearch && matchesUni && matchesFac;
    });
  });

  // Group departments by faculty
  departmentsByFaculty = computed(() => {
    const departments = this.filteredDepartments();
    const faculties = this.faculties();
    
    return faculties.map(faculty => ({
      ...faculty,
      departments: departments.filter(d => d.facultyId === faculty.id)
    })).filter(f => f.departments.length > 0);
  });

  isModalOpen = signal(false);
  
  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<Department[]>('http://localhost:3000/departments').subscribe(data => {
      this.departments.set(data);
    });
    this.http.get<Faculty[]>('http://localhost:3000/faculties').subscribe(data => {
      this.faculties.set(data);
    });
    this.http.get<University[]>('http://localhost:3000/universities').subscribe(data => {
      this.universities.set(data);
    });
  }

  getFacultyName(id: string) {
    return this.faculties().find(f => f.id === id)?.name || id;
  }

  getUniversityName(id: string) {
    return this.universities().find(u => u.id === id)?.name || 'Unknown University';
  }

  openModal() {
    const firstUni = this.universities().length > 0 ? this.universities()[0].id : '';
    const firstFac = this.faculties().length > 0 ? this.faculties()[0].id : '';
    this.deptForm.reset({ 
      universityId: firstUni,
      facultyId: firstFac
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  saveDepartment() {
    if (this.deptForm.valid) {
      const formValue = this.deptForm.value;
      const newDept: Department = {
        id: 'D' + (this.departments().length + 1),
        name: formValue.name!,
        bnName: formValue.bnName!,
        facultyId: formValue.facultyId!,
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

  exportCSV() {
    let csv = 'Department ID,Name,Bengali Name,Faculty ID,University ID\n';
    this.departments().forEach(d => {
      csv += `"${d.id}","${d.name}","${d.bnName}","${d.facultyId}","${d.universityId}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'Faculties_Departments_Structure.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getAction(type: 'exportCsv' | 'exportPdf' | 'openModal' | 'delete', item?: Department): DynamicAction | undefined {
    switch (type) {
      case 'exportCsv':
        return { label: 'Export CSV', icon: 'download', type: 'secondary', size: 'sm', tooltip: 'Export all departments to CSV', ariaLabel: 'Export departments as CSV' } as DynamicAction;
      case 'exportPdf':
        return { label: 'Export PDF', icon: 'download', type: 'secondary', size: 'sm', tooltip: 'Export faculty structure to PDF', ariaLabel: 'Export departments as PDF' } as DynamicAction;
      case 'openModal':
        return { label: 'Add Department', icon: 'arrow-right', type: 'primary', size: 'sm', tooltip: 'Create new department', ariaLabel: 'Add a new department' } as DynamicAction;
      case 'delete':
        return { label: 'Delete', icon: 'arrow-right', type: 'danger', size: 'sm', tooltip: `Delete department ${item?.name || ''}`, ariaLabel: `Delete ${item?.name || 'department'}` } as DynamicAction;
      default:
        return undefined;
    }
  }

  exportPDF() {
    this.pdfService.generateFacultiesPDF(this.faculties(), this.departments());
  }
}
