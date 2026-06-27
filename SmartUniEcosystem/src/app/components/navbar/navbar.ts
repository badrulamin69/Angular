import { Component, HostListener, signal, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
  templateUrl: './navbar.html',
})
export class Navbar {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  private http = inject(HttpClient);

  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  faculties = signal<any[]>([]);

  user = computed(() => this.authService.currentUser());

  // Mega menu states
  activeMenu = signal<string | null>(null);

  ngOnInit() {
    this.checkScroll();
    this.loadFaculties();
  }

  loadFaculties() {
    this.http.get<any[]>('http://localhost:8080/faculties').subscribe((data) => {
      this.faculties.set(data);
    });
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.checkScroll();
  }

  checkScroll() {
    if (typeof window !== 'undefined') {
      this.isScrolled.set(window.scrollY > 20);
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((v) => !v);
  }

  openMenu(menu: string) {
    this.activeMenu.set(menu);
  }

  closeMenu() {
    this.activeMenu.set(null);
  }

  subscribeNewsletter() {
    alert('Thank you for subscribing to our newsletter!');
  }

  getDashboardLink(): string {
    const role = this.user()?.role;
    if (role === 'Super Admin' || role === 'University Admin') return '/admin/dashboard';
    if (role === 'Student') return '/student/dashboard';
    if (role === 'Faculty' || role === 'Professor') return '/faculty/dashboard';
    if (role === 'Staff' || role === 'Accountant') return '/staff/dashboard';
    return '/shared/hub';
  }
}
