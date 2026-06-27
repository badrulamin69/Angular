import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['super@smartuni.edu', [Validators.required, Validators.email]],
    password: ['password', Validators.required],
  });

  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email!, password!).subscribe({
        next: () => {
          this.isLoading = false;
          // Route based on role
          const role = this.authService.currentUser()?.role;
          if (role === 'Super Admin' || role === 'University Admin' || role === 'Department Head') {
            this.router.navigate(['/admin/dashboard']);
          } else if (role === 'Student') {
            this.router.navigate(['/student/dashboard']);
          } else if (
            role === 'Faculty Member' ||
            role === 'Professor' ||
            role === 'Lecturer' ||
            role === 'Advisor'
          ) {
            this.router.navigate(['/faculty/dashboard']);
          } else if (
            role === 'Accounts Officer' ||
            role === 'Librarian' ||
            role === 'Admission Officer' ||
            role === 'General Staff' ||
            role === 'Registrar Officer'
          ) {
            this.router.navigate(['/staff/dashboard']);
          } else {
            this.router.navigate(['/admin/dashboard']); // Fallback
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Invalid credentials. Please try again.';
        },
      });
    }
  }
}
