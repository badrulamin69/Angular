import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { authGuard, roleGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/public-layout/public-layout').then(m => m.PublicLayoutComponent),
    children: [
      { path: '', component: Home },
      { path: 'about', component: About },
      { path: 'platform', loadComponent: () => import('./pages/platform/platform').then(m => m.PlatformComponent) },
      { path: 'programs', loadComponent: () => import('./pages/programs-listing/programs-listing').then(m => m.ProgramsListingComponent) },
      { path: 'contact', component: Contact },
      { 
        path: 'login', 
        loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent) 
      },
      { 
        path: 'admissions', 
        loadComponent: () => import('./pages/admission-home/admission-home').then(m => m.AdmissionHome) 
      },
      { 
        path: 'apply', 
        loadComponent: () => import('./pages/apply/apply').then(m => m.ApplyComponent) 
      },
      { 
        path: 'student-registration', 
        loadComponent: () => import('./pages/student-registration/student-registration').then(m => m.StudentRegistrationComponent) 
      }
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./layout/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./super-admin/dashboard/dashboard').then(m => m.SuperAdminDashboardComponent) },
      { path: 'analytics', loadComponent: () => import('./analytics/analytics-dashboard/analytics-dashboard').then(m => m.AnalyticsDashboardComponent) },
      { path: 'faculties', loadComponent: () => import('./academic/faculties/faculties').then(m => m.FacultiesComponent) },
      { path: 'courses', loadComponent: () => import('./academic/courses/courses').then(m => m.CoursesComponent) },
      { path: 'programs', loadComponent: () => import('./academic/programs/programs').then(m => m.ProgramsComponent) },
      { path: 'students', loadComponent: () => import('./student/students/students').then(m => m.StudentsComponent) },
      { path: 'teachers', loadComponent: () => import('./faculty/teachers/teachers').then(m => m.TeachersComponent) },
      { path: 'finance', loadComponent: () => import('./finance/finance-dashboard/finance-dashboard').then(m => m.FinanceDashboardComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'faculty',
    loadComponent: () => import('./layout/faculty-layout/faculty-layout').then(m => m.FacultyLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./faculty-portal/dashboard/dashboard').then(m => m.FacultyDashboardComponent) },
      { path: 'courses', loadComponent: () => import('./faculty-portal/courses/courses').then(m => m.FacultyCoursesComponent) },
      { path: 'exams', loadComponent: () => import('./faculty-portal/exams/exams').then(m => m.FacultyExamsComponent) },
      { path: 'attendance', loadComponent: () => import('./faculty-portal/attendance/attendance').then(m => m.FacultyAttendanceComponent) },
      { path: 'grading', loadComponent: () => import('./faculty-portal/grading/grading').then(m => m.FacultyGradingComponent) },
      { path: 'advising', loadComponent: () => import('./faculty-portal/advising/advising').then(m => m.FacultyAdvisingComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'staff',
    loadComponent: () => import('./layout/staff-layout/staff-layout').then(m => m.StaffLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./staff-portal/dashboard/dashboard').then(m => m.StaffDashboardComponent) },
      { path: 'admissions', loadComponent: () => import('./staff-portal/admissions/admissions').then(m => m.StaffAdmissionsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'lms',
    loadComponent: () => import('./layout/lms-layout/lms-layout').then(m => m.LmsLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./lms-portal/dashboard/dashboard').then(m => m.LmsDashboardComponent) },
      { path: 'courses', loadComponent: () => import('./lms-portal/courses/courses').then(m => m.LmsCoursesComponent) },
      { path: 'assignments', loadComponent: () => import('./lms-portal/assignments/assignments').then(m => m.LmsAssignmentsComponent) },
      { path: 'discussion', loadComponent: () => import('./lms-portal/discussion/discussion').then(m => m.LmsDiscussionComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'exam',
    loadComponent: () => import('./layout/exam-layout/exam-layout').then(m => m.ExamLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./exam-portal/dashboard/dashboard').then(m => m.ExamDashboardComponent) },
      { path: 'processing', loadComponent: () => import('./exam-portal/processing/processing').then(m => m.ExamProcessingComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'finance',
    loadComponent: () => import('./layout/finance-layout/finance-layout').then(m => m.FinanceLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./finance-portal/dashboard/dashboard').then(m => m.FinanceDashboardComponent) },
      { path: 'billing', loadComponent: () => import('./finance-portal/billing/billing').then(m => m.FinanceBillingComponent) },
      { path: 'grants', loadComponent: () => import('./finance-portal/grants/grants').then(m => m.FinanceGrantsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'shared',
    loadComponent: () => import('./layout/shared-layout/shared-layout').then(m => m.SharedLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'hub', loadComponent: () => import('./shared-portal/hub/hub').then(m => m.SharedHubComponent) },
      { path: 'communication', loadComponent: () => import('./shared-portal/communication/communication').then(m => m.SharedCommunicationComponent) },
      { path: 'settings', loadComponent: () => import('./shared-portal/settings/settings').then(m => m.SharedSettingsComponent) },
      { path: '', redirectTo: 'hub', pathMatch: 'full' }
    ]
  },
  {
    path: 'student',
    loadComponent: () => import('./layout/student-layout/student-layout').then(m => m.StudentLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./student-portal/dashboard/dashboard').then(m => m.StudentDashboardComponent) },
      { path: 'courses', loadComponent: () => import('./student-portal/courses/courses').then(m => m.StudentCoursesComponent) },
      { path: 'registration', loadComponent: () => import('./student-portal/registration/registration').then(m => m.StudentRegistrationComponent) },
      { path: 'exams', loadComponent: () => import('./student-portal/exams/exams').then(m => m.StudentExamsComponent) },
      { path: 'finance', loadComponent: () => import('./student-portal/finance/finance').then(m => m.StudentFinanceComponent) },
      { path: 'transcript', loadComponent: () => import('./student-portal/transcript/transcript').then(m => m.StudentTranscriptComponent) },
      { path: 'payment', loadComponent: () => import('./pages/payment-demo/payment-demo').then(m => m.PaymentDemo) },
      { path: 'payment-success', loadComponent: () => import('./pages/payment-success/payment-success').then(m => m.PaymentSuccessComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
