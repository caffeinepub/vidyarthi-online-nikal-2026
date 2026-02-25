import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSchools, saveSchools, getTeachers, saveTeachers,
  getStudents, saveStudents, getResults, saveResults,
  getTeacherLogins, saveTeacherLogins,
  nextSchoolId, nextTeacherId, nextStudentId, nextResultId, nextTeacherLoginId,
  SchoolExtra, TeacherExtra, StudentExtra, ResultExtra, TeacherLogin
} from '../lib/localStorage';

// ---- Schools ----
export function useSchools() {
  return useQuery<SchoolExtra[]>({
    queryKey: ['schools'],
    queryFn: () => getSchools(),
    staleTime: 0,
  });
}

export function useAddSchool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<SchoolExtra, 'id'>) => {
      const schools = getSchools();
      const newSchool: SchoolExtra = { ...data, id: nextSchoolId() };
      saveSchools([...schools, newSchool]);
      return newSchool;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['schools'] }),
  });
}

export function useUpdateSchool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: SchoolExtra) => {
      const schools = getSchools().map(s => s.id === data.id ? data : s);
      saveSchools(schools);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['schools'] }),
  });
}

export function useDeleteSchool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      saveSchools(getSchools().filter(s => s.id !== id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['schools'] }),
  });
}

// ---- Teachers ----
export function useTeachers() {
  return useQuery<TeacherExtra[]>({
    queryKey: ['teachers'],
    queryFn: () => getTeachers(),
    staleTime: 0,
  });
}

export function useAddTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<TeacherExtra, 'id'>) => {
      const teachers = getTeachers();
      const newTeacher: TeacherExtra = { ...data, id: nextTeacherId() };
      saveTeachers([...teachers, newTeacher]);
      return newTeacher;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teachers'] }),
  });
}

export function useUpdateTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: TeacherExtra) => {
      saveTeachers(getTeachers().map(t => t.id === data.id ? data : t));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teachers'] }),
  });
}

export function useDeleteTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      saveTeachers(getTeachers().filter(t => t.id !== id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teachers'] }),
  });
}

// ---- Students ----
export function useStudents() {
  return useQuery<StudentExtra[]>({
    queryKey: ['students'],
    queryFn: () => getStudents(),
    staleTime: 0,
  });
}

export function useAddStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<StudentExtra, 'id'>) => {
      const students = getStudents();
      const newStudent: StudentExtra = { ...data, id: nextStudentId() };
      saveStudents([...students, newStudent]);
      return newStudent;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  });
}

export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: StudentExtra) => {
      saveStudents(getStudents().map(s => s.id === data.id ? data : s));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      saveStudents(getStudents().filter(s => s.id !== id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  });
}

// ---- Results ----
export function useResults() {
  return useQuery<ResultExtra[]>({
    queryKey: ['results'],
    queryFn: () => getResults(),
    staleTime: 0,
  });
}

export function useAddResult() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<ResultExtra, 'id'>) => {
      const results = getResults();
      const newResult: ResultExtra = { ...data, id: nextResultId() };
      saveResults([...results, newResult]);
      return newResult;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['results'] }),
  });
}

export function useUpdateResult() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ResultExtra) => {
      saveResults(getResults().map(r => r.id === data.id ? data : r));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['results'] }),
  });
}

export function useDeleteResult() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      saveResults(getResults().filter(r => r.id !== id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['results'] }),
  });
}

// ---- Teacher Logins ----
export function useTeacherLogins() {
  return useQuery<TeacherLogin[]>({
    queryKey: ['teacherLogins'],
    queryFn: () => getTeacherLogins(),
    staleTime: 0,
  });
}

export function useAddTeacherLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<TeacherLogin, 'id'>) => {
      const logins = getTeacherLogins();
      const newLogin: TeacherLogin = { ...data, id: nextTeacherLoginId() };
      saveTeacherLogins([...logins, newLogin]);
      return newLogin;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teacherLogins'] }),
  });
}

export function useUpdateTeacherLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: TeacherLogin) => {
      saveTeacherLogins(getTeacherLogins().map(l => l.id === data.id ? data : l));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teacherLogins'] }),
  });
}

export function useDeleteTeacherLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      saveTeacherLogins(getTeacherLogins().filter(l => l.id !== id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teacherLogins'] }),
  });
}
