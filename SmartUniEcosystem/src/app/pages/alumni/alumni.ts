import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alumni',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <section class="relative py-24 px-4 overflow-hidden">
        <div class="container mx-auto max-w-6xl">
          <div class="mb-16 text-center">
            <span class="inline-flex items-center px-4 py-2 rounded-full bg-mit-red/10 text-mit-red text-xs font-black uppercase tracking-[0.35em] mb-4">Alumni Directory</span>
            <h1 class="text-4xl md:text-5xl font-black tracking-tight mb-4">Graduated Students, Faculty, and Officers</h1>
            <p class="text-slate-600 dark:text-slate-300 text-lg max-w-3xl mx-auto">Browse the full alumni directory with rich profile details for students, teachers, and staff officers. Every record includes contact, department, passing year, and session/batch information.</p>
          </div>

          <div class="grid gap-6 lg:grid-cols-3 mb-16">
            <div class="glass-panel p-6 rounded-3xl shadow-xl">
              <h2 class="text-xl font-bold mb-3">Student Alumni</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Former graduates carrying the legacy of campus excellence.</p>
              <p class="mt-6 text-3xl font-black text-mit-red">{{ studentAlumni().length }}</p>
            </div>
            <div class="glass-panel p-6 rounded-3xl shadow-xl">
              <h2 class="text-xl font-bold mb-3">Teacher Alumni</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Ex-faculty members and retired academic leaders.</p>
              <p class="mt-6 text-3xl font-black text-emerald-600">{{ teacherAlumni().length }}</p>
            </div>
            <div class="glass-panel p-6 rounded-3xl shadow-xl">
              <h2 class="text-xl font-bold mb-3">Staff / Officers</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Administrative alumni who built the university operations.</p>
              <p class="mt-6 text-3xl font-black text-sky-600">{{ staffAlumni().length }}</p>
            </div>
          </div>

          <section class="space-y-12">
            <div>
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                <div>
                  <h2 class="text-2xl font-bold">Student Alumni Profiles</h2>
                  <p class="text-slate-500 dark:text-slate-400">Completed student graduates with passing year, session, department and contact details.</p>
                </div>
              </div>
              <div class="grid gap-4">
                <div *ngFor="let alum of studentAlumni()" class="glass-panel p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
                  <div class="flex flex-col md:flex-row md:justify-between gap-4">
                    <div>
                      <p class="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400 font-black mb-2">Student</p>
                      <h3 class="text-2xl font-bold">{{ alum.name }}</h3>
                      <p class="text-sm text-slate-600 dark:text-slate-300">{{ alum.department }} • {{ alum.session }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm text-slate-500 dark:text-slate-400">Passing Year</p>
                      <p class="text-xl font-bold text-mit-red">{{ alum.passingYear }}</p>
                    </div>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mt-6 text-sm text-slate-600 dark:text-slate-300">
                    <div><span class="font-semibold">Email</span><br>{{ alum.email }}</div>
                    <div><span class="font-semibold">Phone</span><br>{{ alum.phone }}</div>
                    <div><span class="font-semibold">Batch</span><br>{{ alum.batch }}</div>
                    <div class="col-span-1 lg:col-span-2"><span class="font-semibold">Address</span><br>{{ alum.address }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                <div>
                  <h2 class="text-2xl font-bold">Teacher Alumni Profiles</h2>
                  <p class="text-slate-500 dark:text-slate-400">Retired or past teachers who once shaped academic instruction.</p>
                </div>
              </div>
              <div class="grid gap-4">
                <div *ngFor="let alum of teacherAlumni()" class="glass-panel p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
                  <div class="flex flex-col md:flex-row md:justify-between gap-4">
                    <div>
                      <p class="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400 font-black mb-2">Teacher</p>
                      <h3 class="text-2xl font-bold">{{ alum.name }}</h3>
                      <p class="text-sm text-slate-600 dark:text-slate-300">{{ alum.department }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm text-slate-500 dark:text-slate-400">Last Academic Session</p>
                      <p class="text-xl font-bold text-emerald-600">{{ alum.session }}</p>
                    </div>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mt-6 text-sm text-slate-600 dark:text-slate-300">
                    <div><span class="font-semibold">Email</span><br>{{ alum.email }}</div>
                    <div><span class="font-semibold">Phone</span><br>{{ alum.phone }}</div>
                    <div><span class="font-semibold">Batch</span><br>{{ alum.batch }}</div>
                    <div class="col-span-1 lg:col-span-2"><span class="font-semibold">Address</span><br>{{ alum.address }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                <div>
                  <h2 class="text-2xl font-bold">Staff & Officer Alumni Profiles</h2>
                  <p class="text-slate-500 dark:text-slate-400">Administrative alumni who once directed campus operations.</p>
                </div>
              </div>
              <div class="grid gap-4">
                <div *ngFor="let alum of staffAlumni()" class="glass-panel p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
                  <div class="flex flex-col md:flex-row md:justify-between gap-4">
                    <div>
                      <p class="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400 font-black mb-2">Staff / Officer</p>
                      <h3 class="text-2xl font-bold">{{ alum.name }}</h3>
                      <p class="text-sm text-slate-600 dark:text-slate-300">{{ alum.department }} • {{ alum.role }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm text-slate-500 dark:text-slate-400">Last Active</p>
                      <p class="text-xl font-bold text-sky-600">{{ alum.session }}</p>
                    </div>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mt-6 text-sm text-slate-600 dark:text-slate-300">
                    <div><span class="font-semibold">Email</span><br>{{ alum.email }}</div>
                    <div><span class="font-semibold">Phone</span><br>{{ alum.phone }}</div>
                    <div><span class="font-semibold">Batch</span><br>{{ alum.batch }}</div>
                    <div class="col-span-1 lg:col-span-2"><span class="font-semibold">Address</span><br>{{ alum.address }}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  `
})
export class AlumniPageComponent {
  studentAlumni = signal([
    {
      name: 'Ayesha Rahman',
      email: 'ayesha.rahman@gmail.com',
      phone: '+880 1711 223344',
      address: 'House 12, Road 3, Dhaka',
      department: 'Computer Science',
      passingYear: '2024',
      session: '2019-2024',
      batch: 'B20'
    },
    {
      name: 'Rashed Khan',
      email: 'rashed.khan@gmail.com',
      phone: '+880 1812 334455',
      address: 'House 5, Dhanmondi, Dhaka',
      department: 'Business Administration',
      passingYear: '2023',
      session: '2018-2023',
      batch: 'B19'
    },
    {
      name: 'Sadia Hossain',
      email: 'sadia.hossain@gmail.com',
      phone: '+880 1912 445566',
      address: 'Bashundhara R/A, Dhaka',
      department: 'Electrical Engineering',
      passingYear: '2025',
      session: '2020-2025',
      batch: 'B21'
    }
  ]);

  teacherAlumni = signal([
    {
      name: 'Dr. Farhan Islam',
      email: 'farhan.islam@gmail.com',
      phone: '+880 1715 667788',
      address: 'Banani, Dhaka',
      department: 'Mechanical Engineering',
      passingYear: '2024',
      session: '2010-2024',
      batch: 'Faculty-2010'
    },
    {
      name: 'Prof. Laila Chowdhury',
      email: 'laila.chowdhury@gmail.com',
      phone: '+880 1817 778899',
      address: 'Uttara, Dhaka',
      department: 'Business Studies',
      passingYear: '2023',
      session: '2012-2023',
      batch: 'Faculty-2012'
    }
  ]);

  staffAlumni = signal([
    {
      name: 'Rezaul Karim',
      email: 'rezaul.karim@gmail.com',
      phone: '+880 1719 889900',
      address: 'Mirpur, Dhaka',
      department: 'Registrar Office',
      role: 'Administrative Officer',
      passingYear: '2025',
      session: '2015-2025',
      batch: 'Staff-2015'
    },
    {
      name: 'Anika Yasmin',
      email: 'anika.yasmin@gmail.com',
      phone: '+880 1813 990011',
      address: 'Gulshan, Dhaka',
      department: 'Finance Department',
      role: 'Accounts Manager',
      passingYear: '2024',
      session: '2014-2024',
      batch: 'Staff-2014'
    }
  ]);
}
