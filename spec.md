# Vidyarthi Online Nikal 2026

## Current State
- Teacher login uses only mobile number to authenticate (checks against TeacherLogin records)
- After teacher login, udise is stored in session from the matching TeacherLogin record
- All pages (Home, School Info, Teacher Info, Student Info, Enter Result, Progress Report, Student Result Print) use the session udise to filter data for teachers
- The filtering logic is already present in HomePage but may not be complete across all other pages

## Requested Changes (Diff)

### Add
- U-DISE number input field in Teacher login form (alongside existing mobile number field)
- Validation: both mobile number AND U-DISE number must match a registered TeacherLogin record

### Modify
- Teacher login: validate that teacherMobile AND teacherUdise both match a single TeacherLogin record
- School Info page: filter schools by teacher's udise (show only the teacher's school)
- Teacher Info page: filter teachers by teacher's udise (show only teachers from that school)
- Student Info page: filter students by teacher's udise (show only students from that school)
- Enter Result page: filter results by teacher's udise (show only results for their school's students); pre-fill UDISE dropdown to teacher's UDISE
- Progress Report page: filter/restrict to teacher's udise
- Student Result Print page: filter/restrict to teacher's udise

### Remove
- Nothing removed

## Implementation Plan
1. Update LoginPage.tsx: add `teacherUdise` state, add U-DISE input field in teacher form, update handleTeacherLogin to validate both mobile AND udise match same record
2. Ensure AuthContext TeacherSession always carries udise (already supported)
3. Update SchoolInfoPage.tsx: filter schools by teacher's udise when role is teacher
4. Update TeacherInfoPage.tsx: filter teachers by udise when role is teacher
5. Update StudentInfoPage.tsx: filter students by udise when role is teacher (already partially done, ensure table shows filtered data)
6. Update EnterResultPage.tsx: filter results by udise for teacher; pre-select UDISE dropdown to teacher's udise
7. Update ProgressReportPage.tsx: restrict udise dropdown to teacher's udise when role is teacher
8. Update StudentResultPrintPage.tsx: restrict udise dropdown to teacher's udise when role is teacher
