import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-communication',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Chat & Support</h1>
          <p class="text-slate-500 mt-1">Internal messaging, Help Center, and IT Support Tickets.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Live Chat Widget -->
        <div class="lg:col-span-2 flex flex-col h-[600px] glass-panel overflow-hidden">
          <div class="h-16 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden relative">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AdminGroup" alt="Group" class="w-full h-full object-cover">
                <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white dark:border-slate-900 rounded-full"></span>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 dark:text-white">IT Support Center</h4>
                <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Online</p>
              </div>
            </div>
            <button class="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
          </div>
          
          <div class="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4 flex flex-col">
            <!-- Timestamp -->
            <div class="text-center"><span class="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">Today, 10:42 AM</span></div>
            
            <!-- Message -->
            <div class="flex items-end gap-2 max-w-[80%]">
              <div class="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AdminGroup" alt="Agent"></div>
              <div class="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-sm text-sm text-slate-700 dark:text-slate-300">
                Hello! How can the IT department help you today?
              </div>
            </div>
            
            <!-- Message (Self) -->
            <div class="flex items-end gap-2 max-w-[80%] self-end flex-row-reverse">
              <div class="bg-sky-500 p-3 rounded-2xl rounded-br-sm text-sm text-white shadow-md shadow-sky-500/20">
                Hi, I am having trouble accessing the updated course syllabus PDF from the network drive.
              </div>
            </div>
            
             <!-- Message -->
             <div class="flex items-end gap-2 max-w-[80%]">
              <div class="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AdminGroup" alt="Agent"></div>
              <div class="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-sm text-sm text-slate-700 dark:text-slate-300">
                I can help with that. Are you connected to the university VPN?
              </div>
            </div>
          </div>
          
          <div class="h-20 border-t border-slate-200 dark:border-slate-800 p-4 flex gap-2 bg-white/50 dark:bg-slate-900/50">
            <button class="w-12 h-12 flex items-center justify-center shrink-0 text-slate-400 hover:text-sky-500 transition-colors bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-900/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <input type="text" placeholder="Type your message..." class="flex-1 px-4 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
            <button class="w-12 h-12 flex items-center justify-center shrink-0 text-white bg-sky-500 rounded-xl hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>

        <!-- Help Center / Tickets -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Support Tickets</h3>
          <div class="glass-panel p-5 space-y-4">
            <button class="w-full py-2.5 border-2 border-dashed border-sky-500 text-sky-600 dark:text-sky-400 font-bold rounded-xl hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors text-sm flex justify-center items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
              Open New Ticket
            </button>
            
            <div class="space-y-3">
              <!-- Ticket -->
              <div class="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-sky-500 transition-colors cursor-pointer group">
                <div class="flex justify-between items-start mb-1">
                  <span class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-500">#TK-4029</span>
                  <span class="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded text-[10px] font-bold">In Progress</span>
                </div>
                <p class="text-sm text-slate-500 line-clamp-1">VPN Access Issue on MacOS</p>
              </div>

              <!-- Ticket -->
              <div class="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-sky-500 transition-colors cursor-pointer group opacity-70 hover:opacity-100">
                <div class="flex justify-between items-start mb-1">
                  <span class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-500">#TK-3911</span>
                  <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded text-[10px] font-bold">Resolved</span>
                </div>
                <p class="text-sm text-slate-500 line-clamp-1">Password reset request</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SharedCommunicationComponent {}
