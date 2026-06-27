import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacultyService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080';

  getCourses(facultyId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courses?instructorId=${facultyId}`);
  }

  getCourseContent(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courseContent?courseId=${courseId}`);
  }

  getSubmissions(facultyId: string): Observable<any[]> {
    // Get courses first, then get submissions for those courses
    return this.getCourses(facultyId).pipe(
      switchMap((courses) => {
        if (courses.length === 0) return of([]);
        const courseIds = courses.map((c) => c.id);
        return this.http
          .get<any[]>(`${this.baseUrl}/submissions`)
          .pipe(map((submissions) => submissions.filter((s) => courseIds.includes(s.courseId))));
      }),
    );
  }

  getAssignments(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/assignments?courseId=${courseId}`);
  }

  getAttendance(facultyId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/attendance?userId=${facultyId}`);
  }

  getTasks(facultyId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tasks?assignedTo=${facultyId}`);
  }

  getLeaveRequests(facultyId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/leaveRequests?userId=${facultyId}`);
  }

  updateSubmission(submissionId: string, data: Partial<any>): Observable<any> {
    return this.http.patch(`${this.baseUrl}/submissions/${submissionId}`, data);
  }

  getStudentsByCourse(courseCode: string): Observable<any[]> {
    // In our mock db, enrollments link students to courseId (which is code in some places, id in others)
    // Let's assume enrollment.courseId matches course.code or course.id
    return this.http.get<any[]>(`${this.baseUrl}/enrollments?courseId=${courseCode}`).pipe(
      switchMap((enrollments) => {
        if (enrollments.length === 0) return of([]);
        const studentIds = enrollments.map((e) => e.studentId);
        return this.http
          .get<any[]>(`${this.baseUrl}/students`)
          .pipe(map((students) => students.filter((s) => studentIds.includes(s.id))));
      }),
    );
  }

  uploadCourseContent(content: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/courseContent`, content);
  }

  updateCourse(courseId: string, data: Partial<any>): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/courses/${courseId}`, data);
  }
}
