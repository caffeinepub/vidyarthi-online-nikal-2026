import React, { useState } from 'react';
import { useSchools, useAddSchool, useUpdateSchool, useDeleteSchool } from '../hooks/useQueries';
import { SchoolExtra } from '../lib/localStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, School } from 'lucide-react';

const emptyForm = { udise: '', name: '', taluka: '', district: '', year: '', className: '' };

export default function SchoolInfoPage() {
  const { data: schools = [], isLoading } = useSchools();
  const addSchool = useAddSchool();
  const updateSchool = useUpdateSchool();
  const deleteSchool = useDeleteSchool();

  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<SchoolExtra | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (s: SchoolExtra) => { setEditItem(s); setForm({ udise: s.udise, name: s.name, taluka: s.taluka, district: s.district, year: s.year, className: s.className }); setOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await updateSchool.mutateAsync({ ...editItem, ...form });
      } else {
        await addSchool.mutateAsync(form);
      }
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteSchool.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl gradient-blue text-white">
            <School size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground devanagari">शाळा माहिती</h1>
            <p className="text-xs text-muted-foreground">School Information</p>
          </div>
        </div>
        <Button onClick={openAdd} className="gradient-orange text-white border-0 rounded-xl gap-2 hover:opacity-90">
          <Plus size={16} />
          <span className="devanagari">नवीन शाळा</span>
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="devanagari font-semibold">युडायस नंबर</TableHead>
                <TableHead className="devanagari font-semibold">शाळेचे नाव</TableHead>
                <TableHead className="devanagari font-semibold hidden sm:table-cell">तालुका</TableHead>
                <TableHead className="devanagari font-semibold hidden md:table-cell">जिल्हा</TableHead>
                <TableHead className="devanagari font-semibold hidden md:table-cell">वर्ष</TableHead>
                <TableHead className="devanagari font-semibold hidden lg:table-cell">इयत्ता</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">लोड होत आहे...</TableCell></TableRow>
              ) : schools.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground devanagari">कोणतीही शाळा नाही. नवीन शाळा जोडा.</TableCell></TableRow>
              ) : (
                schools.map(s => (
                  <TableRow key={s.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-sm">{s.udise}</TableCell>
                    <TableCell className="font-medium devanagari">{s.name}</TableCell>
                    <TableCell className="hidden sm:table-cell devanagari">{s.taluka}</TableCell>
                    <TableCell className="hidden md:table-cell devanagari">{s.district}</TableCell>
                    <TableCell className="hidden md:table-cell">{s.year}</TableCell>
                    <TableCell className="hidden lg:table-cell devanagari">{s.className}</TableCell>
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

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="devanagari">{editItem ? 'शाळा माहिती संपादित करा' : 'नवीन शाळा जोडा'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label className="devanagari text-sm">युडायस नंबर *</Label>
              <Input value={form.udise} onChange={e => setForm(f => ({ ...f, udise: e.target.value }))} placeholder="UDISE Number" required />
            </div>
            <div>
              <Label className="devanagari text-sm">शाळेचे नाव *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="School Name" required className="devanagari" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="devanagari text-sm">तालुका *</Label>
                <Input value={form.taluka} onChange={e => setForm(f => ({ ...f, taluka: e.target.value }))} placeholder="Taluka" required className="devanagari" />
              </div>
              <div>
                <Label className="devanagari text-sm">जिल्हा *</Label>
                <Input value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} placeholder="District" required className="devanagari" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="devanagari text-sm">वर्ष *</Label>
                <Input value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2025-26" required />
              </div>
              <div>
                <Label className="devanagari text-sm">इयत्ता *</Label>
                <Input value={form.className} onChange={e => setForm(f => ({ ...f, className: e.target.value }))} placeholder="उदा. 1 ते 5" required className="devanagari" />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>रद्द करा</Button>
              <Button type="submit" disabled={saving} className="gradient-orange text-white border-0 hover:opacity-90">
                {saving ? 'सेव्ह होत आहे...' : 'सेव्ह करा'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="devanagari">शाळा हटवायची का?</AlertDialogTitle>
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
