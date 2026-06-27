import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lms-showcase',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lms-showcase.html',
})
export class LmsShowcase {
  courses = [
    {
      title: 'Advanced Machine Learning',
      instructor: 'Dr. Alan Turing',
      progress: 75,
      image: 'bg-blue-500',
    },
    {
      title: 'Quantum Computing Fundamentals',
      instructor: 'Dr. Richard Feynman',
      progress: 30,
      image: 'bg-purple-500',
    },
    {
      title: 'Enterprise Architecture',
      instructor: 'Prof. Grace Hopper',
      progress: 90,
      image: 'bg-emerald-500',
    },
  ];
}
