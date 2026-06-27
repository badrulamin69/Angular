import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './hero.html',
})
export class Hero implements OnInit {
  private readonly contentService = inject(ContentService);
  readonly hero = signal({ eyebrow: '', title: '', description: '' });

  ngOnInit() {
    this.contentService.getHeroContent().subscribe((content) => this.hero.set(content));
  }
}
