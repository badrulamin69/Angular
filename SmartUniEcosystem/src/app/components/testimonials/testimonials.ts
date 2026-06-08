import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.html'
})
export class Testimonials {
  testimonials = [
    { quote: 'This platform completely transformed how we manage our multi-campus university. The AI analytics alone saved us millions in optimized resource allocation.', name: 'Dr. Sarah Jenkins', role: 'University President', org: 'Global Tech University' },
    { quote: 'The LMS is incredibly intuitive. Student engagement has increased by 40% since we migrated to Academy Management ecosystem.', name: 'Prof. James Wilson', role: 'Head of Computer Science', org: 'Innovation Institute' }
  ];
}
