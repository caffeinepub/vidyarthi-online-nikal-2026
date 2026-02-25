# Specification

## Summary
**Goal:** Build "Vidyarthi Nikal 2026," a full student result management web app on the Internet Computer (ICP) with a Motoko backend and React frontend, supporting three roles: Admin, Teacher, and Student.

**Planned changes:**

### Backend (Motoko Canister)
- Stable variable storage for five entities: School, Teacher, Student, Result, TeacherLogin
- CRUD operations (add, edit, delete, fetch) exposed for each entity
- Query functions for stats: total students by UDISE, students with results, students without results
- Result model covers Semester 1 and Semester 2, each with 9 subject grades (श्रेणी), special progress, hobby, and improvement notes

### Authentication
- Admin login: hardcoded username `admin` / password `admin`
- Teacher login: mobile number validated against TeacherLogin canister records
- Student login: UDISE + class + division + attendance number validated against Student records
- Session stored in React state; logout clears session and redirects to login

### Frontend Pages & Navigation
- **Login page:** colorful gradient hero area with three role-selection cards (Admin, Teacher, Student)
- **Collapsible sidebar:** 8 menu items with role-based visibility; collapses to icon-only on mobile
  - Admin: all 8 pages
  - Teacher: Home, School Info, Teacher Info, Student Info, Enter Result, Progress Report, Student Result Print
  - Student: Student Result Print only
- **Home page:** three colored stat cards — Total Students, Students with Results, Students without Results (scoped by UDISE for teacher; all schools for admin)
- **School Info page:** Add/Edit/Delete school records (UDISE, School Name, Taluka, District, Year, Class) in a modal form + data table
- **Teacher Info page:** Add/Edit/Delete teacher records; entering UDISE auto-fills School Name, Taluka, District; all 9 fields in form + data table
- **Student Info page:** Add/Edit/Delete student records; UDISE auto-fills school fields; teacher dropdown filters by UDISE and auto-fills Class/Division; all 11 fields + data table
- **Enter Result page:** UDISE dropdown → student dropdown → auto-fill Name/Class/Division; Semester 1 and Semester 2 sections each with 9 subject grade dropdowns (अ1, अ2, ब1, ब2, क1, क2, ड, इ1, ई2), Special Progress, Hobby, Needs Improvement fields; save to canister; data table with Edit/Delete
- **Progress Report page:** Four dropdowns (UDISE, Class, Division, Attendance Number) + Search button; displays formatted report with school info, student info, Sem 1 & Sem 2 results; Print button (browser print) and Download button
- **Student Result Print page:** Identical to Progress Report; accessible to all roles; student role has dropdowns pre-filled with their own credentials
- **Teacher Manage page (Admin only):** Add/Edit/Delete TeacherLogin records (UDISE + Mobile Number) in a modal form + data table

### Visual Theme
- Vibrant, mobile-first design with warm gradient color palette (orange/green accents, avoid blue/purple dominance)
- Colorful stat cards, bold typography, card-based layouts
- Smooth sidebar collapse/expand animation with colored icons
- Clean, modern data tables and forms optimized for mobile screens

**User-visible outcome:** Admin, teachers, and students can log in with their respective credentials. Admin and teachers can manage school, teacher, and student records, enter semester results, and view/print/download formatted progress reports. Students can view and print their own results. All data persists permanently in the canister and syncs across devices.
