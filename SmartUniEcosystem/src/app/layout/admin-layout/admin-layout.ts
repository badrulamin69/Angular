import { Component, computed, inject, HostListener, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './admin-layout.html'
})
export class AdminLayoutComponent implements OnInit {
  authService = inject(AuthService);
  http = inject(HttpClient);
  router = inject(Router);
  
  user = computed(() => this.authService.currentUser());
  
  isSidebarOpen = true;
  isDropdownOpen = false;
  isNotificationsOpen = signal(false);
  notifications = signal<any[]>([]);
  searchQuery = signal('');

  unreadNotificationsCount = computed(() => {
    return this.notifications().filter(n => !n.read).length;
  });

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    const currentUser = this.user();
    if (currentUser) {
      this.http.get<any[]>(`http://localhost:3000/notifications`).subscribe(data => {
        // Filter notifications by user or load all admin notifications
        this.notifications.set(data);
      });
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isNotificationsOpen.set(false);
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleNotifications(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = false;
    this.isNotificationsOpen.set(!this.isNotificationsOpen());
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.isDropdownOpen = false;
    this.isNotificationsOpen.set(false);
  }

  markAsRead(id: string) {
    this.http.patch<any>(`http://localhost:3000/notifications/${id}`, { read: true }).subscribe(() => {
      this.notifications.update(list => list.map(n => n.id === id ? { ...n, read: true } : n));
    });
  }

  clearAll() {
    // Mark all as read
    const unread = this.notifications().filter(n => !n.read);
    unread.forEach(n => {
      this.http.patch<any>(`http://localhost:3000/notifications/${n.id}`, { read: true }).subscribe();
    });
    this.notifications.update(list => list.map(n => ({ ...n, read: true })));
  }

  triggerSearch() {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return;
    
    // Perform navigation/search redirection based on keyword match
    if (q.includes('stud') || q.includes('enroll')) {
      this.router.navigate(['/admin/students'], { queryParams: { q } });
    } else if (q.includes('course') || q.includes('major') || q.includes('class')) {
      this.router.navigate(['/admin/courses'], { queryParams: { q } });
    } else if (q.includes('fac') || q.includes('dept')) {
      this.router.navigate(['/admin/faculties'], { queryParams: { q } });
    } else if (q.includes('teacher') || q.includes('staff') || q.includes('emp')) {
      this.router.navigate(['/admin/teachers'], { queryParams: { q } });
    } else if (q.includes('pay') || q.includes('invoice') || q.includes('finance') || q.includes('fee')) {
      this.router.navigate(['/admin/finance'], { queryParams: { q } });
    } else {
      // General dashboard filter or fallback
      this.router.navigate(['/admin/dashboard']);
    }
  }

  logout() {
    this.authService.logout();
  }
}
