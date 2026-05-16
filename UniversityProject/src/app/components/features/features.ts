import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.html'
})
export class Features {
  features = [
    {
      title: 'University ERP',
      description: 'Streamline administrative workflows, faculty management, and campus operations with a unified intelligent system.',
      icon: 'svg-erp',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      title: 'Intelligent LMS',
      description: 'Next-generation learning management with interactive courses, real-time collaboration, and automated assessments.',
      icon: 'svg-lms',
      color: 'from-mit-red to-orange-500'
    },
    {
      title: 'Examination Engine',
      description: 'Secure, proctored digital examinations with automated grading and detailed performance analytics.',
      icon: 'svg-exam',
      color: 'from-emerald-500 to-teal-400'
    },
    {
      title: 'Financial Management',
      description: 'Comprehensive tuition tracking, payroll, grants management, and real-time financial reporting.',
      icon: 'svg-finance',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Student Analytics',
      description: 'AI-driven insights into student performance, predicting dropouts and recommending personalized learning paths.',
      icon: 'svg-analytics',
      color: 'from-amber-500 to-yellow-400'
    },
    {
      title: 'Multi-campus Control',
      description: 'Manage multiple physical and virtual campuses from a single pane of glass with granular role-based access.',
      icon: 'svg-campus',
      color: 'from-indigo-500 to-blue-500'
    }
  ];
}
