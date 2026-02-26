# Specification

## Summary
**Goal:** Enable teacher login via mobile number + U-DISE number, and filter all portal pages to show only data belonging to the logged-in teacher's U-DISE number.

**Planned changes:**
- Update the Teacher tab on the Login page to accept both a Mobile Number field and a U-DISE Number field; authenticate against stored TeacherLogin records and save the U-DISE in the auth session on success.
- Home page: filter student stats, result counts, and progress bar to the teacher's U-DISE; admins see all schools.
- School Info page: teachers see only their own school record; Add/Edit/Delete controls hidden for teacher role; admins retain full CRUD.
- Teacher Info page: teachers see only teacher records matching their U-DISE; admins see all.
- Student Info page: teachers see only students from their U-DISE school; U-DISE field in add/edit form is pre-filled and read-only for teachers; admins see all.
- Enter Results page: student list scoped to teacher's U-DISE; admins see all.
- Progress Report page: U-DISE filter field pre-filled and locked to teacher's U-DISE; admins can enter any U-DISE.
- Student Result Print page: U-DISE filter field pre-filled and locked to teacher's U-DISE; admins can enter any U-DISE.
- Sidebar navigation: ensure teacher role has visible links to all pages — Home, School Info, Teacher Info, Student Info, Enter Results, Progress Report, and Student Result Print.

**User-visible outcome:** Teachers can log in with their mobile number and U-DISE number and will only see data relevant to their school across all pages of the portal, while admins continue to have unrestricted access to all data.
