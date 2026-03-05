import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pencil,
  Phone,
  Plus,
  School,
  Settings,
  ShieldOff,
  Trash2,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  useAddTeacherLogin,
  useDeleteTeacherLogin,
  useSchools,
  useTeacherLogins,
  useUpdateTeacherLogin,
} from "../hooks/useQueries";
import type { SchoolExtra, TeacherLogin } from "../lib/localStorage";

const emptyForm = { udise: "", mobile: "" };

export default function TeacherManagePage() {
  const { session } = useAuth();

  // Admin-only access guard
  if (session?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-fade-in">
        <div className="p-5 rounded-full bg-destructive/10 text-destructive">
          <ShieldOff size={48} />
        </div>
        <h2 className="text-2xl font-bold text-foreground devanagari">
          प्रवेश नाकारला
        </h2>
        <p className="text-muted-foreground devanagari text-center max-w-sm">
          हे पृष्ठ फक्त Admin साठी आहे. तुम्हाला या पृष्ठावर प्रवेश करण्याची परवानगी नाही.
        </p>
        <p className="text-sm text-muted-foreground">
          Access Denied — Admin only page.
        </p>
      </div>
    );
  }

  return <TeacherManageContent />;
}

function TeacherManageContent() {
  const { data: logins = [], isLoading } = useTeacherLogins();
  const { data: schools = [] } = useSchools();
  const addLogin = useAddTeacherLogin();
  const updateLogin = useUpdateTeacherLogin();
  const deleteLogin = useDeleteTeacherLogin();

  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<TeacherLogin | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm);
    setOpen(true);
  };
  const openEdit = (l: TeacherLogin) => {
    setEditItem(l);
    setForm({ udise: l.udise, mobile: l.mobile });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await updateLogin.mutateAsync({ ...editItem, ...form });
      } else {
        await addLogin.mutateAsync(form);
      }
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteLogin.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const getSchoolName = (udise: string) => {
    const school = schools.find((s: SchoolExtra) => s.udise === udise);
    return school?.name || "-";
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl gradient-red text-white">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground devanagari">
              Teacher Manage
            </h1>
            <p className="text-xs text-muted-foreground">
              शिक्षक लॉगिन व्यवस्थापन (Admin Only)
            </p>
          </div>
        </div>
        <Button
          onClick={openAdd}
          className="gradient-red text-white border-0 rounded-xl gap-2 hover:opacity-90"
        >
          <Plus size={16} />
          <span className="devanagari">नवीन शिक्षक</span>
        </Button>
      </div>

      {/* Info Banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800 devanagari">
        <p className="font-semibold mb-1">📌 माहिती:</p>
        <p>
          येथे नोंदणी केलेल्या मोबाईल नंबरने शिक्षक लॉगिन करू शकतात. प्रत्येक शिक्षकाचा मोबाईल
          नंबर आणि शाळेचा युडायस नंबर येथे जोडा.
        </p>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="devanagari font-semibold">
                  युडायस नंबर
                </TableHead>
                <TableHead className="devanagari font-semibold">
                  शाळेचे नाव
                </TableHead>
                <TableHead className="devanagari font-semibold">
                  मोबाईल नंबर
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    लोड होत आहे...
                  </TableCell>
                </TableRow>
              ) : logins.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground devanagari"
                  >
                    कोणताही शिक्षक लॉगिन नाही. नवीन शिक्षक जोडा.
                  </TableCell>
                </TableRow>
              ) : (
                logins.map((l) => (
                  <TableRow key={l.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-sm">
                      {l.udise}
                    </TableCell>
                    <TableCell className="devanagari">
                      {getSchoolName(l.udise)}
                    </TableCell>
                    <TableCell className="font-mono">{l.mobile}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(l)}
                          className="h-7 w-7 p-0 text-blue-500 hover:bg-blue-50"
                        >
                          <Pencil size={13} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteId(l.id)}
                          className="h-7 w-7 p-0 text-red-500 hover:bg-red-50"
                        >
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
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="devanagari">
              {editItem ? "शिक्षक लॉगिन संपादित करा" : "नवीन शिक्षक लॉगिन जोडा"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="devanagari text-sm flex items-center gap-1.5 mb-1">
                <School size={14} />
                शाळेचा युडायस नंबर *
              </Label>
              <Input
                value={form.udise}
                onChange={(e) =>
                  setForm((f) => ({ ...f, udise: e.target.value }))
                }
                placeholder="UDISE Number"
                required
                list="manage-udise-list"
              />
              <datalist id="manage-udise-list">
                {schools.map((s: SchoolExtra) => (
                  <option key={s.id} value={s.udise}>
                    {s.name}
                  </option>
                ))}
              </datalist>
              {form.udise && (
                <p className="text-xs text-muted-foreground mt-1 devanagari">
                  शाळा: {getSchoolName(form.udise)}
                </p>
              )}
            </div>
            <div>
              <Label className="devanagari text-sm flex items-center gap-1.5 mb-1">
                <Phone size={14} />
                शिक्षक मोबाईल नंबर *
              </Label>
              <Input
                value={form.mobile}
                onChange={(e) =>
                  setForm((f) => ({ ...f, mobile: e.target.value }))
                }
                placeholder="10 digit mobile number"
                required
                maxLength={10}
                pattern="[0-9]{10}"
                title="10 digit mobile number"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                रद्द करा
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="gradient-red text-white border-0 hover:opacity-90 devanagari"
              >
                {saving ? "सेव्ह होत आहे..." : editItem ? "अपडेट करा" : "जोडा"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="devanagari">
              शिक्षक लॉगिन हटवायचा का?
            </AlertDialogTitle>
            <AlertDialogDescription className="devanagari">
              ही माहिती कायमची हटवली जाईल.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="devanagari">
              रद्द करा
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="gradient-red text-white border-0 hover:opacity-90 devanagari"
            >
              हटवा
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
