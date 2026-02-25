// Local storage helpers for app data persistence (supplementary to canister)
const PREFIX = 'nikal2026_';

export function lsGet<T>(key: string): T | null {
  try {
    const val = localStorage.getItem(PREFIX + key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

export function lsSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function lsRemove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

// Extended school data (extra fields not in backend)
export interface SchoolExtra {
  id: number;
  udise: string;
  name: string;
  taluka: string;
  district: string;
  year: string;
  className: string;
}

export interface TeacherExtra {
  id: number;
  name: string;
  dob: string;
  className: string;
  division: string;
  mobile: string;
  udise: string;
  schoolName: string;
  taluka: string;
  district: string;
}

export interface StudentExtra {
  id: number;
  udise: string;
  teacherName: string;
  className: string;
  division: string;
  studentName: string;
  attendanceNo: string;
  dob: string;
  motherName: string;
  schoolName: string;
  taluka: string;
  district: string;
  backendId?: number;
}

export interface SubjectGrade {
  subject: string;
  grade: string;
}

export interface SemesterResult {
  subjects: SubjectGrade[];
  specialProgress: string;
  hobby: string;
  improvement: string;
}

export interface ResultExtra {
  id: number;
  studentId: number;
  udise: string;
  studentName: string;
  className: string;
  division: string;
  attendanceNo: string;
  semester1: SemesterResult;
  semester2: SemesterResult;
}

export interface TeacherLogin {
  id: number;
  udise: string;
  mobile: string;
}

// CRUD helpers
export function getSchools(): SchoolExtra[] {
  return lsGet<SchoolExtra[]>('schools') || [];
}
export function saveSchools(schools: SchoolExtra[]): void {
  lsSet('schools', schools);
}

export function getTeachers(): TeacherExtra[] {
  return lsGet<TeacherExtra[]>('teachers') || [];
}
export function saveTeachers(teachers: TeacherExtra[]): void {
  lsSet('teachers', teachers);
}

export function getStudents(): StudentExtra[] {
  return lsGet<StudentExtra[]>('students') || [];
}
export function saveStudents(students: StudentExtra[]): void {
  lsSet('students', students);
}

export function getResults(): ResultExtra[] {
  return lsGet<ResultExtra[]>('results') || [];
}
export function saveResults(results: ResultExtra[]): void {
  lsSet('results', results);
}

export function getTeacherLogins(): TeacherLogin[] {
  return lsGet<TeacherLogin[]>('teacherLogins') || [];
}
export function saveTeacherLogins(logins: TeacherLogin[]): void {
  lsSet('teacherLogins', logins);
}

let _schoolCounter = lsGet<number>('schoolCounter') || 1;
let _teacherCounter = lsGet<number>('teacherCounter') || 1;
let _studentCounter = lsGet<number>('studentCounter') || 1;
let _resultCounter = lsGet<number>('resultCounter') || 1;
let _teacherLoginCounter = lsGet<number>('teacherLoginCounter') || 1;

export function nextSchoolId(): number {
  const id = _schoolCounter++;
  lsSet('schoolCounter', _schoolCounter);
  return id;
}
export function nextTeacherId(): number {
  const id = _teacherCounter++;
  lsSet('teacherCounter', _teacherCounter);
  return id;
}
export function nextStudentId(): number {
  const id = _studentCounter++;
  lsSet('studentCounter', _studentCounter);
  return id;
}
export function nextResultId(): number {
  const id = _resultCounter++;
  lsSet('resultCounter', _resultCounter);
  return id;
}
export function nextTeacherLoginId(): number {
  const id = _teacherLoginCounter++;
  lsSet('teacherLoginCounter', _teacherLoginCounter);
  return id;
}
