import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-lms-showcase',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lms-showcase.html',
})
export class LmsShowcase implements OnInit {
  private readonly contentService = inject(ContentService);
  readonly courses = signal<any[]>([]);

  ngOnInit() {
    this.contentService.getLmsShowcase().subscribe((data) => this.courses.set(data));
  }
}
