import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { Features } from '../../components/features/features';
import { Ecosystem } from '../../components/ecosystem/ecosystem';
import { LmsShowcase } from '../../components/lms-showcase/lms-showcase';
import { AnalyticsShowcase } from '../../components/analytics-showcase/analytics-showcase';
import { LiveClass } from '../../components/live-class/live-class';
import { Testimonials } from '../../components/testimonials/testimonials';
import { Pricing } from '../../components/pricing/pricing';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Hero,
    Features,
    Ecosystem,
    LmsShowcase,
    AnalyticsShowcase,
    LiveClass,
    Testimonials,
    Pricing,
  ],
  templateUrl: './home.html',
})
export class Home {}
