import React, { useState } from 'react';
import { useStudents, useAddStudent, useUpdateStudent, useDeleteStudent, useSchools, useTeachers } from '../hooks/useQueries';
import { StudentExtra, SchoolExtra, TeacherExtra } from '../lib/localStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';

const emptyForm = {
  udise: '', teacherName: '', className: '', division: '',
  studentName: '', attendanceNo: '', dob: '', motherName: '',
  schoolName: '', taluka: '', district: ''
};

export default function StudentInfoPage() {
  const { data: students = [], isLoading } = useStudents();
  const { data: schools = [] } = useSchools();
  const { data: teachers = [] } = useTeachers();
  const addStudent = useAddStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<StudentExtra | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const filteredTeachers = teachers.filter((t: TeacherExtra) => t.udise === form.udise);

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (s: StudentExtra) => {
    setEditItem(s);
    setForm({
      udise: s.udise, teacherName: s.teacherName, className: s.className, division: s.division,
      studentName: s.studentName, attendanceNo: s.attendanceNo, dob: s.dob, motherName: s.motherName,
      schoolName: s.schoolName, taluka: s.taluka, district: s.district
    });
    setOpen(true);
  };

  const handleUdiseChange = (udise: string) => {
    const school = schools.find((s: SchoolExtra) => s.udise === udise);
    setForm(f => ({
      ...f,
      udise,
      schoolName: school?.name || '',
      taluka: school?.taluka || '',
      district: school?.district || '',
      teacherName: '',
      className: '',
      division: '',
    }));
  };

  const handleTeacherChange = (teacherName: string) => {
    const teacher = teachers.find((t: TeacherExtra) => t.name === teacherName && t.udise === form.udise);
    setForm(f => ({
      ...f,
      teacherName,
      className: teacher?.className || '',
      division: teacher?.division || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await updateStudent.mutateAsync({ ...editItem, ...form });
      } else {
        await addStudent.mutateAsync(form);
      }
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteStudent.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl gradient-yellow text-white">
            <GraduationCap size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground devanagari">विद्यार्थी माहिती</h1>
            <p className="text-xs text-muted-foreground">Student Information</p>
          </div>
        </div>
        <Button onClick={openAdd} className="gradient-yellow text-white border-0 rounded-xl gap-2 hover:opacity-90" style={{ color: 'oklch(0.18 0.04 260)' }}>
          <Plus size={16} />
          <span className="devanagari">नवीन विद्यार्थी</span>
        </Button>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="devanagari font-semibold">विद्यार्थी नाव</TableHead>
                <TableHead className="devanagari font-semibold hidden sm:table-cell">हजेरी नं.</TableHead>
                <TableHead className="devanagari font-semibold hidden sm:table-cell">इयत्ता</TableHead>
                <TableHead className="devanagari font-semibold hidden md:table-cell">तुकडी</TableHead>
                <TableHead className="devanagari font-semibold hidden md:table-cell">युडायस</TableHead>
                <TableHead className="devanagari font-semibold hidden lg:table-cell">शिक्षक</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">लोड होत आहे...</TableCell></TableRow>
              ) : students.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground devanagari">कोणताही विद्यार्थी नाही.</TableCell></TableRow>
              ) : (
                students.map(s => (
                  <TableRow key={s.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium devanagari">{s.studentName}</TableCell>
                    <TableCell className="hidden sm:table-cell">{s.attendanceNo}</TableCell>
                    <TableCell className="hidden sm:table-cell devanagari">{s.className}</TableCell>
                    <TableCell className="hidden md:table-cell devanagari">{s.division}</TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-sm">{s.udise}</TableCell>
                    <TableCell className="hidden lg:table-cell devanagari">{s.teacherName}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(s)} className="h-7 w-7 p-0 text-blue-500 hover:bg-blue-50">
                          <Pencil size={13} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setDeleteId(s.id)} className="h-7 w-7 p-0 text-red-500 hover:bg-red-50">
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="devanagari">{editItem ? 'विद्यार्थी माहिती संपादित करा' : 'नवीन विद्यार्थी जोडा'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label className="devanagari text-sm">युडायस नंबर *</Label>
              <Input
                value={form.udise}
                onChange={e => handleUdiseChange(e.target.value)}
                placeholder="UDISE Number"
                required
                list="student-udise-list"
              />
              <datalist id="student-udise-list">
                {schools.map((s: SchoolExtra) => <option key={s.id} value={s.udise}>{s.name}</option>)}
              </datalist>
            </div>
            <div>
              <Label className="devanagari text-sm">शिक्षक नाव *</Label>
              <Select value={form.teacherName} onValueChange={handleTeacherChange}>
                <SelectTrigger className="devanagari">
                  <SelectValue placeholder="शिक्षक निवडा" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTeachers.length === 0 ? (
                    <SelectItem value="_none" disabled>प्रथम युडायस नंबर टाका</SelectItem>
                  ) : (
                    filteredTeachers.map((t: TeacherExtra) => (
                      <SelectItem key={t.id} value={t.name} className="devanagari">{t.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="devanagari text-sm">इयत्ता (ऑटो)</Label>
                <Input value={form.className} readOnly className="bg-muted devanagari" placeholder="Auto" />
              </div>
              <div>
                <Label className="devanagari text-sm">तुकडी (ऑटो)</Label>
                <Input value={form.division} readOnly className="bg-muted devanagari" placeholder="Auto" />
              </div>
            </div>
            <div>
              <Label className="devanagari text-sm">विद्यार्थी नाव *</Label>
              <Input value={form.studentName} onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))} placeholder="Student Name" required className="devanagari" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="devanagari text-sm">हजेरी नंबर *</Label>
                <Input value={form.attendanceNo} onChange={e => setForm(f => ({ ...f, attendanceNo: e.target.value }))} placeholder="Attendance No" required />
              </div>
              <div>
                <Label className="devanagari text-sm">जन्म दिनांक *</Label>
                <Input type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} required />
              </div>
            </div>
            <div>
              <Label className="devanagari text-sm">आईचे नाव *</Label>
              <Input value={form.motherName} onChange={e => setForm(f => ({ ...f, motherName: e.target.value }))} placeholder="Mother's Name" required className="devanagari" />
            </div>
            <div>
              <Label className="devanagari text-sm">शाळेचे नाव (ऑटो)</Label>
              <Input value={form.schoolName} readOnly className="bg-muted devanagari" placeholder="Auto from UDISE" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="devanagari text-sm">तालुका (ऑटो)</Label>
                <Input value={form.taluka} readOnly className="bg-muted devanagari" placeholder="Auto" />
              </div>
              <div>
                <Label className="devanagari text-sm">जिल्हा (ऑटो)</Label>
                <Input value={form.district} readOnly className="bg-muted devanagari" placeholder="Auto" />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>रद्द करा</Button>
              <Button type="submit" disabled={saving} className="gradient-yellow border-0 hover:opacity-90 devanagari" style={{ color: 'oklch(0.18 0.04 260)' }}>
                {saving ? 'सेव्ह होत आहे...' : 'सेव्ह करा'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="devanagari">विद्यार्थी हटवायचा का?</AlertDialogTitle>
            <AlertDialogDescription className="devanagari">ही माहिती कायमची हटवली जाईल.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="devanagari">रद्द करा</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="gradient-red text-white border-0 hover:opacity-90 devanagari">हटवा</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
