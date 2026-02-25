import React, { useState } from 'react';
import { useTeachers, useAddTeacher, useUpdateTeacher, useDeleteTeacher, useSchools } from '../hooks/useQueries';
import { TeacherExtra, SchoolExtra } from '../lib/localStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';

const emptyForm = { name: '', dob: '', className: '', division: '', mobile: '', udise: '', schoolName: '', taluka: '', district: '' };

export default function TeacherInfoPage() {
  const { data: teachers = [], isLoading } = useTeachers();
  const { data: schools = [] } = useSchools();
  const addTeacher = useAddTeacher();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();

  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<TeacherExtra | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (t: TeacherExtra) => {
    setEditItem(t);
    setForm({ name: t.name, dob: t.dob, className: t.className, division: t.division, mobile: t.mobile, udise: t.udise, schoolName: t.schoolName, taluka: t.taluka, district: t.district });
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
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await updateTeacher.mutateAsync({ ...editItem, ...form });
      } else {
        await addTeacher.mutateAsync(form);
      }
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteTeacher.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl gradient-green text-white">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground devanagari">शिक्षक माहिती</h1>
            <p className="text-xs text-muted-foreground">Teacher Information</p>
          </div>
        </div>
        <Button onClick={openAdd} className="gradient-green text-white border-0 rounded-xl gap-2 hover:opacity-90">
          <Plus size={16} />
          <span className="devanagari">नवीन शिक्षक</span>
        </Button>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="devanagari font-semibold">नाव</TableHead>
                <TableHead className="devanagari font-semibold hidden sm:table-cell">मोबाईल</TableHead>
                <TableHead className="devanagari font-semibold hidden sm:table-cell">इयत्ता</TableHead>
                <TableHead className="devanagari font-semibold hidden md:table-cell">तुकडी</TableHead>
                <TableHead className="devanagari font-semibold hidden md:table-cell">युडायस</TableHead>
                <TableHead className="devanagari font-semibold hidden lg:table-cell">शाळा</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">लोड होत आहे...</TableCell></TableRow>
              ) : teachers.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground devanagari">कोणताही शिक्षक नाही.</TableCell></TableRow>
              ) : (
                teachers.map(t => (
                  <TableRow key={t.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium devanagari">{t.name}</TableCell>
                    <TableCell className="hidden sm:table-cell font-mono text-sm">{t.mobile}</TableCell>
                    <TableCell className="hidden sm:table-cell devanagari">{t.className}</TableCell>
                    <TableCell className="hidden md:table-cell devanagari">{t.division}</TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-sm">{t.udise}</TableCell>
                    <TableCell className="hidden lg:table-cell devanagari">{t.schoolName}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(t)} className="h-7 w-7 p-0 text-blue-500 hover:bg-blue-50">
                          <Pencil size={13} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setDeleteId(t.id)} className="h-7 w-7 p-0 text-red-500 hover:bg-red-50">
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
            <DialogTitle className="devanagari">{editItem ? 'शिक्षक माहिती संपादित करा' : 'नवीन शिक्षक जोडा'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label className="devanagari text-sm">शिक्षक नाव *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Teacher Name" required className="devanagari" />
            </div>
            <div>
              <Label className="devanagari text-sm">जन्म दिनांक *</Label>
              <Input type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="devanagari text-sm">इयत्ता *</Label>
                <Input value={form.className} onChange={e => setForm(f => ({ ...f, className: e.target.value }))} placeholder="उदा. 5" required className="devanagari" />
              </div>
              <div>
                <Label className="devanagari text-sm">तुकडी *</Label>
                <Input value={form.division} onChange={e => setForm(f => ({ ...f, division: e.target.value }))} placeholder="उदा. अ" required className="devanagari" />
              </div>
            </div>
            <div>
              <Label className="devanagari text-sm">मोबाईल नंबर *</Label>
              <Input value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} placeholder="10 digit mobile" required maxLength={10} />
            </div>
            <div>
              <Label className="devanagari text-sm">शाळेचा युडायस नंबर *</Label>
              <Input
                value={form.udise}
                onChange={e => handleUdiseChange(e.target.value)}
                placeholder="UDISE Number"
                required
                list="school-udise-list"
              />
              <datalist id="school-udise-list">
                {schools.map((s: SchoolExtra) => <option key={s.id} value={s.udise}>{s.name}</option>)}
              </datalist>
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
              <Button type="submit" disabled={saving} className="gradient-green text-white border-0 hover:opacity-90">
                {saving ? 'सेव्ह होत आहे...' : 'सेव्ह करा'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="devanagari">शिक्षक हटवायचे का?</AlertDialogTitle>
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
