import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.html',
})
export class Testimonials implements OnInit {
  private readonly contentService = inject(ContentService);
  readonly testimonials = signal<any[]>([]);

  ngOnInit() {
    this.contentService.getTestimonials().subscribe((data) => this.testimonials.set(data));
  }
}
