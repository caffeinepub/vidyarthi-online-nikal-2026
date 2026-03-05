import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileText, Printer, Search } from "lucide-react";
import React, { useState } from "react";
import ReportCard from "../components/ReportCard";
import { useAuth } from "../contexts/AuthContext";
import { useResults, useSchools, useStudents } from "../hooks/useQueries";
import type {
  ResultExtra,
  SchoolExtra,
  StudentExtra,
} from "../lib/localStorage";

export default function ProgressReportPage() {
  const { session } = useAuth();
  const { data: allSchools = [] } = useSchools();
  const { data: students = [] } = useStudents();
  const { data: results = [] } = useResults();

  // Teachers see only their school; admins see all
  const teacherUdise = session?.role === "teacher" ? session.udise : null;
  const schools = teacherUdise
    ? allSchools.filter((s: SchoolExtra) => s.udise === teacherUdise)
    : allSchools;

  const [udise, setUdise] = useState(teacherUdise || "");
  const [className, setClassName] = useState("");
  const [division, setDivision] = useState("");
  const [attendanceNo, setAttendanceNo] = useState("");
  const [reportData, setReportData] = useState<{
    school: SchoolExtra;
    student: StudentExtra;
    result: ResultExtra;
  } | null>(null);
  const [error, setError] = useState("");

  const filteredByUdise = students.filter(
    (s: StudentExtra) => s.udise === udise,
  );
  const classes = [...new Set(filteredByUdise.map((s) => s.className))];
  const filteredByClass = filteredByUdise.filter(
    (s) => s.className === className,
  );
  const divisions = [...new Set(filteredByClass.map((s) => s.division))];
  const filteredByDivision = filteredByClass.filter(
    (s) => s.division === division,
  );
  const attendanceNos = filteredByDivision.map((s) => s.attendanceNo);

  const handleSearch = () => {
    setError("");
    setReportData(null);

    const student = students.find(
      (s: StudentExtra) =>
        s.udise === udise &&
        s.className === className &&
        s.division === division &&
        s.attendanceNo === attendanceNo,
    );

    if (!student) {
      setError("विद्यार्थी सापडला नाही!");
      return;
    }

    const school = schools.find((s: SchoolExtra) => s.udise === udise);
    if (!school) {
      setError("शाळा माहिती सापडली नाही!");
      return;
    }

    const result = results.find((r: ResultExtra) => r.studentId === student.id);
    if (!result) {
      setError("या विद्यार्थ्याचा निकाल अद्याप भरलेला नाही!");
      return;
    }

    setReportData({ school, student, result });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!reportData) return;
    const el = document.getElementById("report-card");
    if (!el) return;
    const html = `<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8"/>
  <title>प्रगती पत्रक - ${reportData.student.studentName}</title>
  <style>
    body { font-family: 'Noto Sans Devanagari', Arial, sans-serif; padding: 20px; color: #000; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #999; padding: 6px 10px; font-size: 13px; }
    th { background: #f0f0f0; }
    .header { text-align: center; margin-bottom: 16px; }
    .section { margin-bottom: 16px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; padding: 10px; background: #f9f9f9; border-radius: 8px; }
    .sem-header { background: #fff3e0; padding: 8px; text-align: center; font-weight: bold; border-radius: 6px; margin-bottom: 8px; }
    .sem2-header { background: #e8f5e9; }
    .extra-info { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin-top: 8px; font-size: 12px; }
    .extra-item { padding: 6px; background: #f9f9f9; border-radius: 4px; }
    .signatures { display: flex; justify-content: space-between; margin-top: 24px; padding-top: 16px; border-top: 1px solid #ccc; }
    .sig-box { text-align: center; }
    .sig-line { border-bottom: 1px solid #666; width: 120px; height: 30px; margin-bottom: 4px; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h2>${reportData.school.name}</h2>
    <p>युडायस: ${reportData.school.udise} | तालुका: ${reportData.school.taluka} | जिल्हा: ${reportData.school.district}</p>
    <h3>प्रगती पत्रक - ${reportData.school.year}</h3>
  </div>
  <div class="info-grid">
    <div><strong>विद्यार्थी नाव:</strong> ${reportData.student.studentName}</div>
    <div><strong>इयत्ता:</strong> ${reportData.student.className}</div>
    <div><strong>आईचे नाव:</strong> ${reportData.student.motherName}</div>
    <div><strong>तुकडी:</strong> ${reportData.student.division}</div>
    <div><strong>जन्म दिनांक:</strong> ${reportData.student.dob}</div>
    <div><strong>हजेरी नं.:</strong> ${reportData.student.attendanceNo}</div>
  </div>
  <div class="section">
    <div class="sem-header">प्रथम सत्र निकाल</div>
    <table>
      <thead><tr><th>विषय</th><th>श्रेणी</th></tr></thead>
      <tbody>
        ${reportData.result.semester1.subjects.map((s) => `<tr><td>${s.subject}</td><td style="text-align:center;font-weight:bold">${s.grade || "-"}</td></tr>`).join("")}
      </tbody>
    </table>
    <div class="extra-info">
      <div class="extra-item"><strong>विशेष प्रगती:</strong> ${reportData.result.semester1.specialProgress || "-"}</div>
      <div class="extra-item"><strong>आवड/छंद:</strong> ${reportData.result.semester1.hobby || "-"}</div>
      <div class="extra-item"><strong>सुधारणा:</strong> ${reportData.result.semester1.improvement || "-"}</div>
    </div>
  </div>
  <div class="section">
    <div class="sem-header sem2-header">द्वितीय सत्र निकाल</div>
    <table>
      <thead><tr><th>विषय</th><th>श्रेणी</th></tr></thead>
      <tbody>
        ${reportData.result.semester2.subjects.map((s) => `<tr><td>${s.subject}</td><td style="text-align:center;font-weight:bold">${s.grade || "-"}</td></tr>`).join("")}
      </tbody>
    </table>
    <div class="extra-info">
      <div class="extra-item"><strong>विशेष प्रगती:</strong> ${reportData.result.semester2.specialProgress || "-"}</div>
      <div class="extra-item"><strong>आवड/छंद:</strong> ${reportData.result.semester2.hobby || "-"}</div>
      <div class="extra-item"><strong>सुधारणा:</strong> ${reportData.result.semester2.improvement || "-"}</div>
    </div>
  </div>
  <div class="signatures">
    <div class="sig-box"><div class="sig-line"></div><p>वर्ग शिक्षक</p></div>
    <div class="sig-box"><div class="sig-line"></div><p>मुख्याध्यापक</p></div>
  </div>
  <div class="footer">© 2026 विद्यार्थी ऑनलाईन निकाल 2026 • Built with vaibhavgavali</div>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pragati-patrak-${reportData.student.studentName}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl gradient-purple text-white">
          <FileText size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground devanagari">
            प्रगती पत्रक
          </h1>
          <p className="text-xs text-muted-foreground">Progress Report</p>
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-5">
        <h3 className="font-semibold text-foreground devanagari mb-4">
          विद्यार्थी शोधा
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <Label className="devanagari text-sm mb-1 block">युडायस नंबर</Label>
            <Select
              value={udise}
              onValueChange={(v) => {
                setUdise(v);
                setClassName("");
                setDivision("");
                setAttendanceNo("");
                setReportData(null);
              }}
              disabled={!!teacherUdise}
            >
              <SelectTrigger>
                <SelectValue placeholder="निवडा" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((s: SchoolExtra) => (
                  <SelectItem key={s.id} value={s.udise}>
                    {s.udise}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="devanagari text-sm mb-1 block">इयत्ता</Label>
            <Select
              value={className}
              onValueChange={(v) => {
                setClassName(v);
                setDivision("");
                setAttendanceNo("");
                setReportData(null);
              }}
              disabled={!udise}
            >
              <SelectTrigger>
                <SelectValue placeholder="निवडा" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c} value={c} className="devanagari">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="devanagari text-sm mb-1 block">तुकडी</Label>
            <Select
              value={division}
              onValueChange={(v) => {
                setDivision(v);
                setAttendanceNo("");
                setReportData(null);
              }}
              disabled={!className}
            >
              <SelectTrigger>
                <SelectValue placeholder="निवडा" />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((d) => (
                  <SelectItem key={d} value={d} className="devanagari">
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="devanagari text-sm mb-1 block">हजेरी नंबर</Label>
            <Select
              value={attendanceNo}
              onValueChange={(v) => {
                setAttendanceNo(v);
                setReportData(null);
              }}
              disabled={!division}
            >
              <SelectTrigger>
                <SelectValue placeholder="निवडा" />
              </SelectTrigger>
              <SelectContent>
                {attendanceNos.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <Button
            onClick={handleSearch}
            disabled={!udise || !className || !division || !attendanceNo}
            className="gradient-purple text-white border-0 hover:opacity-90 gap-2"
          >
            <Search size={16} />
            <span className="devanagari">प्रगती पत्रक शोधा</span>
          </Button>
        </div>
        {error && (
          <div className="mt-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm devanagari">
            {error}
          </div>
        )}
      </div>

      {/* Report Display */}
      {reportData && (
        <div className="space-y-3">
          <div className="flex gap-2 no-print">
            <Button onClick={handlePrint} variant="outline" className="gap-2">
              <Printer size={16} />
              <span className="devanagari">प्रिंट करा</span>
            </Button>
            <Button
              onClick={handleDownload}
              className="gradient-green text-white border-0 hover:opacity-90 gap-2"
            >
              <Download size={16} />
              <span className="devanagari">डाऊनलोड करा</span>
            </Button>
          </div>
          <ReportCard
            school={reportData.school}
            student={reportData.student}
            result={reportData.result}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground pt-4 pb-2 no-print">
        <p>© 2026 विद्यार्थी ऑनलाईन निकाल 2026 • Built with vaibhavgavali</p>
      </footer>
    </div>
  );
}
