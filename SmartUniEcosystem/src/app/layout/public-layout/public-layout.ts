import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { NewsTickerComponent } from '../../components/news-ticker/news-ticker';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Footer, NewsTickerComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-brand-light dark:bg-brand-dark transition-colors duration-300">
      <app-navbar></app-navbar>
      <div class="pt-20">
        <app-news-ticker></app-news-ticker>
      </div>
      
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
      
      <app-footer></app-footer>
    </div>
  `
})
export class PublicLayoutComponent {}
