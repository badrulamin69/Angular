import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Footer],
  template: `
    <div class="min-h-screen flex flex-col bg-brand-light dark:bg-brand-dark transition-colors duration-300">
      <app-navbar></app-navbar>
      
      <main class="flex-grow pt-20">
        <router-outlet></router-outlet>
      </main>
      
      <app-footer></app-footer>
    </div>
  `
})
export class PublicLayoutComponent {}
