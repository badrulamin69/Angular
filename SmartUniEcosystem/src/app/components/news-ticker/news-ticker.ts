import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news-ticker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="news-ticker-container border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
      <div class="flex items-center h-12 container mx-auto px-4 overflow-hidden relative">
        <!-- Label -->
        <div class="absolute left-0 z-10 h-full flex items-center px-4 bg-mit-red text-white font-black text-xs uppercase tracking-widest shadow-[10px_0_20px_-5px_rgba(163,31,52,0.3)]">
          Breaking News
        </div>

        <!-- Scrolling Content -->
        <div class="ticker-wrapper flex items-center h-full pl-32 whitespace-nowrap">
          <div class="ticker-content flex gap-12 animate-scroll group-hover:pause">
            @for (news of newsItems(); track $index) {
              <div class="flex items-center gap-3">
                <div class="w-1.5 h-1.5 rounded-full bg-mit-red/50"></div>
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-mit-red transition-colors cursor-default">
                  {{ news }}
                </span>
              </div>
            }
            <!-- Duplicate content for seamless loop -->
            @for (news of newsItems(); track 'dup-'+$index) {
              <div class="flex items-center gap-3">
                <div class="w-1.5 h-1.5 rounded-full bg-mit-red/50"></div>
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-mit-red transition-colors cursor-default">
                  {{ news }}
                </span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .news-ticker-container {
      position: relative;
      z-index: 40;
    }

    .ticker-wrapper {
      width: 100%;
      overflow: hidden;
    }

    .ticker-content {
      display: inline-flex;
      animation: scroll 40s linear infinite;
    }

    .ticker-content:hover {
      animation-play-state: paused;
    }

    @keyframes scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    /* Support for slow motion */
    :host {
      display: block;
    }
  `]
})
export class NewsTickerComponent {
  newsItems = signal([
    "Admission for Fall 2026 is now open. Apply before July 15th to avail early bird scholarships.",
    "Smart University ranked #1 in Innovation for the third consecutive year by Global Tech Review.",
    "Upcoming International Webinar on AI & Blockchain at the Faculty of Engineering on June 10th.",
    "New Research Wing 'The Hawking Lab' inaugurated at the Faculty of Science.",
    "Inter-University Football Championship begins next week at the Central Stadium.",
    "Library hours extended to 24/7 during the final examination month."
  ]);
}
