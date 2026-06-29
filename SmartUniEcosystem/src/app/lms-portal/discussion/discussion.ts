import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-lms-discussion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Learning Community
          </h1>
          <p class="text-slate-500 mt-1">Connect with peers and instructors in your courses.</p>
        </div>
        <button
          (click)="openNewTopic()"
          class="px-5 py-2.5 bg-violet-600 text-white rounded-xl shadow-lg shadow-violet-500/30 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          New Topic
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Topic List -->
        <div class="lg:col-span-3 space-y-4">
          <div
            *ngFor="let topic of discussions()"
            (click)="selectTopic(topic)"
            class="glass-panel p-5 cursor-pointer hover:border-violet-500/50 transition-all group"
            [class.border-violet-500]="selectedTopic()?.id === topic.id"
          >
            <div class="flex justify-between items-start mb-3">
              <span
                class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded"
                >{{ topic.courseId }}</span
              >
              <span class="text-xs text-slate-400">{{ topic.date }}</span>
            </div>
            <h3
              class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors"
            >
              {{ topic.title }}
            </h3>
            <p class="text-sm text-slate-500 line-clamp-2 mt-2">{{ topic.content }}</p>

            <div class="mt-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <img
                    [src]="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + topic.userId"
                    alt="Author"
                  />
                </div>
                <span class="text-xs font-bold text-slate-600 dark:text-slate-400"
                  >User #{{ topic.userId }}</span
                >
              </div>
              <span
                class="text-xs font-bold text-violet-500 bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded"
              >
                {{ getReplyCount(topic.id) }} Replies
              </span>
            </div>
          </div>

          <div
            *ngIf="discussions().length === 0"
            class="p-12 text-center text-slate-500 glass-panel"
          >
            No discussion topics found. Start the conversation!
          </div>
        </div>

        <!-- Selected Topic Detail / Sidebar -->
        <div class="space-y-4">
          <div *ngIf="selectedTopic()" class="glass-card p-6 border-t-4 border-t-violet-500">
            <h4 class="font-bold text-slate-900 dark:text-white mb-4">Replies</h4>
            <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <div
                *ngFor="let reply of getReplies(selectedTopic()!.id)"
                class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <p class="text-sm text-slate-700 dark:text-slate-300">{{ reply.content }}</p>
                <div class="mt-2 flex items-center justify-between">
                  <span class="text-[10px] font-bold text-slate-400">User #{{ reply.userId }}</span>
                  <span class="text-[10px] text-slate-400">{{ reply.date }}</span>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <textarea
                [(ngModel)]="newReplyContent"
                rows="3"
                placeholder="Write a reply..."
                class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-violet-500 text-sm resize-none"
              ></textarea>
              <button
                (click)="postReply()"
                [disabled]="!newReplyContent"
                class="w-full mt-2 py-2 bg-violet-600 text-white rounded-lg font-bold text-xs disabled:opacity-50 transition-all"
              >
                Post Reply
              </button>
            </div>
          </div>

          <div *ngIf="!selectedTopic()" class="glass-panel p-6 text-center opacity-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mx-auto mb-2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p class="text-xs font-bold">Select a topic to view conversation</p>
          </div>
        </div>
      </div>
    </div>

    <!-- New Topic Modal Simulation -->
    <div
      *ngIf="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
    >
      <div class="glass-panel max-w-lg w-full p-6 shadow-2xl animate-scale-in">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Start New Discussion</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
            <input
              [(ngModel)]="newTopic.title"
              type="text"
              class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-violet-500 text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Content</label>
            <textarea
              [(ngModel)]="newTopic.content"
              rows="4"
              class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-violet-500 text-sm resize-none"
            ></textarea>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button
            (click)="isModalOpen = false"
            class="flex-1 py-2 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            (click)="saveTopic()"
            [disabled]="!newTopic.title || !newTopic.content"
            class="flex-1 py-2 bg-violet-600 text-white font-bold rounded-xl shadow-lg shadow-violet-500/30"
          >
            Post Topic
          </button>
        </div>
      </div>
    </div>
  `,
})
export class LmsDiscussionComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  discussions = signal<any[]>([]);
  replies = signal<any[]>([]);
  selectedTopic = signal<any>(null);

  isModalOpen = false;
  newTopic = { title: '', content: '', courseId: 'CS-101' };
  newReplyContent = '';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<any[]>(`${environment.apiUrl}/discussions`).subscribe((data) => {
      this.discussions.set(data);
    });
    this.http.get<any[]>(`${environment.apiUrl}/replies`).subscribe((data) => {
      this.replies.set(data);
    });
  }

  selectTopic(topic: any) {
    this.selectedTopic.set(topic);
  }

  getReplies(discussionId: string) {
    return this.replies().filter((r) => r.discussionId === discussionId);
  }

  getReplyCount(discussionId: string) {
    return this.getReplies(discussionId).length;
  }

  openNewTopic() {
    this.newTopic = { title: '', content: '', courseId: 'CS-101' };
    this.isModalOpen = true;
  }

  saveTopic() {
    const user = this.authService.currentUser();
    if (!user) return;

    const topic = {
      ...this.newTopic,
      userId: user.id,
      date: new Date().toISOString().split('T')[0],
    };

    this.http.post<any>(`${environment.apiUrl}/discussions`, topic).subscribe((res) => {
      this.discussions.update((d) => [res, ...d]);
      this.isModalOpen = false;
    });
  }

  postReply() {
    const user = this.authService.currentUser();
    const topic = this.selectedTopic();
    if (!user || !topic) return;

    const reply = {
      discussionId: topic.id,
      userId: user.id,
      content: this.newReplyContent,
      date: new Date().toISOString().split('T')[0],
    };

    this.http.post<any>(`${environment.apiUrl}/replies`, reply).subscribe((res) => {
      this.replies.update((r) => [...r, res]);
      this.newReplyContent = '';
    });
  }
}
