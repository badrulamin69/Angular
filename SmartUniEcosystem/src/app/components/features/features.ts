import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService, ContentItem } from '../../core/services/content.service';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.html',
})
export class Features implements OnInit {
  private readonly contentService = inject(ContentService);
  readonly features = signal<ContentItem[]>([]);

  ngOnInit() {
    this.contentService.getFeatures().subscribe((items) => this.features.set(items));
  }
}
