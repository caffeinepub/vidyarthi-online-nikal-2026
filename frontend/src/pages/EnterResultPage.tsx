import React, { useState } from 'react';
import { useStudents, useResults, useAddResult, useUpdateResult, useDeleteResult, useSchools } from '../hooks/useQueries';
import { ResultExtra, StudentExtra, SchoolExtra, SemesterResult } from '../lib/localStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, ClipboardList } from 'lucide-react';

const SUBJECTS = [
  'भाषा', 'हिंदी', 'इंग्रजी', 'गणित',
  'परिसर अभ्यास भाग1/सा. विज्ञान',
  'परिसर अभ्यास भाग2/सा. शास्त्र',
  'कला', 'कार्यानुभव', 'शारीरिक शिक्षण'
];

const GRADES = ['अ1', 'अ2', 'ब1', 'ब2', 'क1', 'क2', 'ड', 'इ1', 'ई2'];

const emptySemester = (): SemesterResult => ({
  subjects: SUBJECTS.map(s => ({ subject: s, grade: '' })),
  specialProgress: '',
  hobby: '',
  improvement: '',
});

const emptyForm = () => ({
  udise: '',
  studentId: 0,
  studentName: '',
  className: '',
  division: '',
  attendanceNo: '',
  semester1: emptySemester(),
  semester2: emptySemester(),
});

interface FormState {
  udise: string;
  studentId: number;
  studentName: string;
  className: string;
  division: string;
  attendanceNo: string;
  semester1: SemesterResult;
  semester2: SemesterResult;
}

// ─── SemesterSection defined OUTSIDE the parent component ───────────────────
// This is critical: defining it inside EnterResultPage would cause React to
// treat it as a new component type on every render, unmounting/remounting the
// textareas and stealing keyboard focus on mobile devices.
interface SemesterSectionProps {
  sem: 'semester1' | 'semester2';
  label: string;
  semData: SemesterResult;
  onGradeChange: (subjectIdx: number, grade: string) => void;
  onFieldChange: (field: 'specialProgress' | 'hobby' | 'improvement', value: string) => void;
}

const textareaClass =
  'devanagari text-sm resize-none w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[70px]';

function SemesterSection({ sem, label, semData, onGradeChange, onFieldChange }: SemesterSectionProps) {
  return (
    <div className="space-y-3">
      <div className={`p-3 rounded-xl text-white font-bold devanagari text-center ${sem === 'semester1' ? 'gradient-orange' : 'gradient-green'}`}>
        {label}
      </div>
      <div className="space-y-2">
        {semData.subjects.map((subj, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="flex-1 text-sm devanagari text-foreground">{subj.subject}</span>
            <Select value={subj.grade} onValueChange={v => onGradeChange(idx, v)}>
              <SelectTrigger className="w-24 h-8 text-sm">
                <SelectValue placeholder="श्रेणी" />
              </SelectTrigger>
              <SelectContent>
                {GRADES.map(g => (
                  <SelectItem key={g} value={g} className="devanagari">{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      <div className="space-y-3 pt-2">
        <div>
          <Label className="devanagari text-xs font-semibold mb-1 block">✨ विशेष प्रगती</Label>
          <textarea
            value={semData.specialProgress}
            onChange={e => onFieldChange('specialProgress', e.target.value)}
            placeholder="विशेष प्रगती येथे लिहा..."
            rows={2}
            className={textareaClass}
          />
        </div>
        <div>
          <Label className="devanagari text-xs font-semibold mb-1 block">🎨 आवड/छंद</Label>
          <textarea
            value={semData.hobby}
            onChange={e => onFieldChange('hobby', e.target.value)}
            placeholder="आवड/छंद येथे लिहा..."
            rows={2}
            className={textareaClass}
          />
        </div>
        <div>
          <Label className="devanagari text-xs font-semibold mb-1 block">📝 सुधारणा आवश्यक</Label>
          <textarea
            value={semData.improvement}
            onChange={e => onFieldChange('improvement', e.target.value)}
            placeholder="सुधारणा आवश्यक येथे लिहा..."
            rows={2}
            className={textareaClass}
          />
        </div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function EnterResultPage() {
  const { data: students = [] } = useStudents();
  const { data: schools = [] } = useSchools();
  const { data: results = [], isLoading } = useResults();
  const addResult = useAddResult();
  const updateResult = useUpdateResult();
  const deleteResult = useDeleteResult();

  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<ResultExtra | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const filteredStudents = students.filter((s: StudentExtra) => s.udise === form.udise);

  const openAdd = () => { setEditItem(null); setForm(emptyForm()); setOpen(true); };
  const openEdit = (r: ResultExtra) => {
    setEditItem(r);
    setForm({
      udise: r.udise,
      studentId: r.studentId,
      studentName: r.studentName,
      className: r.className,
      division: r.division,
      attendanceNo: r.attendanceNo,
      semester1: r.semester1,
      semester2: r.semester2,
    });
    setOpen(true);
  };

  const handleUdiseChange = (udise: string) => {
    setForm(f => ({ ...f, udise, studentId: 0, studentName: '', className: '', division: '', attendanceNo: '' }));
  };

  const handleStudentChange = (studentId: string) => {
    const id = parseInt(studentId);
    const student = students.find((s: StudentExtra) => s.id === id);
    if (student) {
      setForm(f => ({
        ...f,
        studentId: id,
        studentName: student.studentName,
        className: student.className,
        division: student.division,
        attendanceNo: student.attendanceNo,
      }));
    }
  };

  const updateGrade = (sem: 'semester1' | 'semester2', subjectIdx: number, grade: string) => {
    setForm(f => ({
      ...f,
      [sem]: {
        ...f[sem],
        subjects: f[sem].subjects.map((s, i) => i === subjectIdx ? { ...s, grade } : s),
      }
    }));
  };

  const updateSemField = (sem: 'semester1' | 'semester2', field: 'specialProgress' | 'hobby' | 'improvement', value: string) => {
    setForm(f => ({ ...f, [sem]: { ...f[sem], [field]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId) return;
    setSaving(true);
    try {
      const data: Omit<ResultExtra, 'id'> = {
        studentId: form.studentId,
        udise: form.udise,
        studentName: form.studentName,
        className: form.className,
        division: form.division,
        attendanceNo: form.attendanceNo,
        semester1: form.semester1,
        semester2: form.semester2,
      };
      if (editItem) {
        await updateResult.mutateAsync({ ...editItem, ...data });
      } else {
        await addResult.mutateAsync(data);
      }
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteResult.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl gradient-purple text-white">
            <ClipboardList size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground devanagari">निकाल भरा</h1>
            <p className="text-xs text-muted-foreground">Enter Result</p>
          </div>
        </div>
        <Button onClick={openAdd} className="gradient-purple text-white border-0 rounded-xl gap-2 hover:opacity-90">
          <Plus size={16} />
          <span className="devanagari">नवीन निकाल</span>
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">लोड होत आहे...</TableCell></TableRow>
              ) : results.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground devanagari">कोणताही निकाल नाही.</TableCell></TableRow>
              ) : (
                results.map(r => (
                  <TableRow key={r.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium devanagari">{r.studentName}</TableCell>
                    <TableCell className="hidden sm:table-cell">{r.attendanceNo}</TableCell>
                    <TableCell className="hidden sm:table-cell devanagari">{r.className}</TableCell>
                    <TableCell className="hidden md:table-cell devanagari">{r.division}</TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-sm">{r.udise}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(r)} className="h-7 w-7 p-0 text-blue-500 hover:bg-blue-50">
                          <Pencil size={13} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setDeleteId(r.id)} className="h-7 w-7 p-0 text-red-500 hover:bg-red-50">
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
        <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="devanagari">{editItem ? 'निकाल संपादित करा' : 'नवीन निकाल भरा'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Selection */}
            <div className="bg-muted/30 rounded-xl p-3 space-y-3">
              <div>
                <Label className="devanagari text-sm">युडायस नंबर *</Label>
                <Select value={form.udise} onValueChange={handleUdiseChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="युडायस निवडा" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((s: SchoolExtra) => (
                      <SelectItem key={s.id} value={s.udise}>{s.udise} - {s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="devanagari text-sm">विद्यार्थी नाव *</Label>
                <Select value={form.studentId ? String(form.studentId) : ''} onValueChange={handleStudentChange}>
                  <SelectTrigger className="devanagari">
                    <SelectValue placeholder="विद्यार्थी निवडा" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStudents.length === 0 ? (
                      <SelectItem value="_none" disabled>प्रथम युडायस निवडा</SelectItem>
                    ) : (
                      filteredStudents.map((s: StudentExtra) => (
                        <SelectItem key={s.id} value={String(s.id)} className="devanagari">
                          {s.studentName} (हजेरी: {s.attendanceNo})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="devanagari text-xs">इयत्ता</Label>
                  <Input value={form.className} readOnly className="bg-muted text-sm h-8 devanagari" />
                </div>
                <div>
                  <Label className="devanagari text-xs">तुकडी</Label>
                  <Input value={form.division} readOnly className="bg-muted text-sm h-8 devanagari" />
                </div>
                <div>
                  <Label className="devanagari text-xs">हजेरी नं.</Label>
                  <Input value={form.attendanceNo} readOnly className="bg-muted text-sm h-8" />
                </div>
              </div>
            </div>

            {/* Semester 1 */}
            <SemesterSection
              sem="semester1"
              label="प्रथम सत्र निकाल"
              semData={form.semester1}
              onGradeChange={(idx, grade) => updateGrade('semester1', idx, grade)}
              onFieldChange={(field, value) => updateSemField('semester1', field, value)}
            />

            {/* Semester 2 */}
            <SemesterSection
              sem="semester2"
              label="द्वितीय सत्र निकाल"
              semData={form.semester2}
              onGradeChange={(idx, grade) => updateGrade('semester2', idx, grade)}
              onFieldChange={(field, value) => updateSemField('semester2', field, value)}
            />

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>रद्द करा</Button>
              <Button type="submit" disabled={saving || !form.studentId} className="gradient-purple text-white border-0 hover:opacity-90">
                {saving ? 'सेव्ह होत आहे...' : 'सेव्ह करा'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="devanagari">निकाल हटवायचा का?</AlertDialogTitle>
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
