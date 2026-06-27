const fs = require('fs');
const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

let sql = '';
// Students
db.students.forEach(s => {
    let name = s.name ? s.name.replace(/'/g, "''") : '';
    sql += `INSERT INTO students (id, name, email, program, status, gpa) VALUES ('${s.id}', '${name}', '${s.email}', '${s.program}', '${s.status}', ${s.gpa});\n`;
});
// Users
db.users.forEach(u => {
    let name = u.name ? u.name.replace(/'/g, "''") : '';
    sql += `INSERT INTO users (id, name, email, role, password, university_id) VALUES ('${u.id}', '${name}', '${u.email}', '${u.role}', '${u.password}', '${u.universityId || ''}');\n`;
});
// Enrollments
if (db.enrollments) {
    db.enrollments.forEach(e => {
        sql += `INSERT INTO enrollments (id, student_id, course_id, semester, progress, attendance, completed_assignments, total_assignments) VALUES ('${e.id}', '${e.studentId}', '${e.courseId}', '${e.semester}', ${e.progress || 0}, ${e.attendance || 0}, ${e.completedAssignments || 0}, ${e.totalAssignments || 0});\n`;
    });
}
// Grades
if (db.studentGrades) {
    db.studentGrades.forEach(g => {
        sql += `INSERT INTO student_grades (id, student_id, course_id, grade, gp, credits) VALUES ('${g.id}', '${g.studentId}', '${g.courseId}', '${g.grade}', ${g.gp || 0}, ${g.credits || 0});\n`;
    });
}

fs.writeFileSync('backend/src/main/resources/data.sql', sql);
console.log('data.sql generated successfully.');
