import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Building2,
  GraduationCap,
  Hash,
  Phone,
  Shield,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getStudents, getTeacherLogins } from "../lib/localStorage";

type LoginTab = "admin" | "teacher" | "student";

const inputClass =
  "bg-white/25 border-white/50 text-white placeholder:text-white/60 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/30";

const inputStyle: React.CSSProperties = {
  WebkitTextFillColor: "white",
  caretColor: "white",
};

export default function LoginPage() {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<LoginTab>("admin");
  const [error, setError] = useState("");

  // Admin form
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");

  // Teacher form
  const [teacherMobile, setTeacherMobile] = useState("");
  const [teacherUdise, setTeacherUdise] = useState("");

  // Student form
  const [studentUdise, setStudentUdise] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [studentDivision, setStudentDivision] = useState("");
  const [studentAttendance, setStudentAttendance] = useState("");

  const [loading, setLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (adminUser === "admin" && adminPass === "admin123") {
        login({ role: "admin", username: "admin" });
      } else {
        setError("चुकीचे username किंवा password!");
      }
      setLoading(false);
    }, 400);
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const logins = getTeacherLogins();
      const found = logins.find(
        (l) =>
          l.mobile === teacherMobile.trim() && l.udise === teacherUdise.trim(),
      );
      if (found) {
        login({
          role: "teacher",
          mobile: teacherMobile.trim(),
          udise: found.udise,
        });
      } else {
        setError("मोबाईल नंबर किंवा युडायस नंबर चुकीचा आहे!");
      }
      setLoading(false);
    }, 400);
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const students = getStudents();
      const found = students.find(
        (s) =>
          s.udise === studentUdise.trim() &&
          s.className === studentClass.trim() &&
          s.division === studentDivision.trim() &&
          s.attendanceNo === studentAttendance.trim(),
      );
      if (found) {
        login({
          role: "student",
          udise: found.udise,
          className: found.className,
          division: found.division,
          attendanceNo: found.attendanceNo,
          studentName: found.studentName,
        });
      } else {
        setError("विद्यार्थी माहिती जुळत नाही!");
      }
      setLoading(false);
    }, 400);
  };

  const tabs: {
    key: LoginTab;
    label: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
  }[] = [
    {
      key: "admin",
      label: "Admin",
      icon: <Shield size={20} />,
      color: "text-white",
      bg: "gradient-orange",
    },
    {
      key: "teacher",
      label: "शिक्षक",
      icon: <BookOpen size={20} />,
      color: "text-white",
      bg: "gradient-green",
    },
    {
      key: "student",
      label: "विद्यार्थी",
      icon: <GraduationCap size={20} />,
      color: "text-white",
      bg: "gradient-blue",
    },
  ];

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative circles */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
        style={{
          background: "oklch(0.72 0.22 35)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
        style={{
          background: "oklch(0.6 0.2 145)",
          transform: "translate(-30%, 30%)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full opacity-5"
        style={{ background: "oklch(0.82 0.18 85)" }}
      />

      {/* Logo & Title */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
            <img
              src="/assets/generated/app-logo.dim_256x256.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white devanagari tracking-tight">
          विद्यार्थी ऑनलाईन निकाल
        </h1>
        <p className="text-white/70 text-lg font-semibold mt-1">2026</p>
        <p className="text-white/50 text-sm mt-1">शाळा निकाल व्यवस्थापन प्रणाली</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white/15 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          {/* Tab Selector */}
          <div className="flex">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setError("");
                }}
                data-ocid={`login.${tab.key}.tab`}
                className={`flex-1 flex flex-col items-center gap-1 py-4 text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? `${tab.bg} text-white shadow-inner`
                    : "text-white/60 hover:text-white/90 hover:bg-white/5"
                }`}
              >
                {tab.icon}
                <span className="devanagari">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form Area */}
          <div className="p-6">
            {error && (
              <div
                data-ocid="login.error_state"
                className="mb-4 p-3 rounded-xl bg-red-500/30 border border-red-400/50 text-red-100 text-sm devanagari text-center font-medium"
              >
                {error}
              </div>
            )}

            {activeTab === "admin" && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <Label className="text-white font-semibold text-sm mb-2 block">
                    Username
                  </Label>
                  <div className="relative">
                    <Shield
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 z-10"
                    />
                    <Input
                      data-ocid="login.admin.input"
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      placeholder="admin"
                      className={`pl-9 ${inputClass}`}
                      style={inputStyle}
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white font-semibold text-sm mb-2 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Hash
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 z-10"
                    />
                    <Input
                      data-ocid="login.admin.password.input"
                      type="password"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      placeholder="••••••••"
                      className={`pl-9 ${inputClass}`}
                      style={inputStyle}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  data-ocid="login.admin.submit_button"
                  className="w-full gradient-orange text-white font-bold py-3 rounded-xl border-0 hover:opacity-90 transition-opacity"
                >
                  {loading ? "लॉगिन होत आहे..." : "Admin Login"}
                </Button>
              </form>
            )}

            {activeTab === "teacher" && (
              <form onSubmit={handleTeacherLogin} className="space-y-4">
                <div>
                  <Label className="text-white font-semibold text-sm mb-2 block devanagari">
                    मोबाईल नंबर
                  </Label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 z-10"
                    />
                    <Input
                      data-ocid="login.teacher.mobile.input"
                      value={teacherMobile}
                      onChange={(e) => setTeacherMobile(e.target.value)}
                      placeholder="10 अंकी मोबाईल नंबर"
                      className={`pl-9 ${inputClass}`}
                      style={inputStyle}
                      required
                      maxLength={10}
                      autoComplete="tel"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white font-semibold text-sm mb-2 block devanagari">
                    युडायस नंबर
                  </Label>
                  <div className="relative">
                    <Building2
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 z-10"
                    />
                    <Input
                      data-ocid="login.teacher.udise.input"
                      value={teacherUdise}
                      onChange={(e) => setTeacherUdise(e.target.value)}
                      placeholder="शाळेचा युडायस नंबर"
                      className={`pl-9 ${inputClass}`}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  data-ocid="login.teacher.submit_button"
                  className="w-full gradient-green text-white font-bold py-3 rounded-xl border-0 hover:opacity-90 transition-opacity"
                >
                  {loading ? "लॉगिन होत आहे..." : "शिक्षक Login"}
                </Button>
              </form>
            )}

            {activeTab === "student" && (
              <form onSubmit={handleStudentLogin} className="space-y-3">
                <div>
                  <Label className="text-white font-semibold text-sm mb-2 block devanagari">
                    युडायस नंबर
                  </Label>
                  <Input
                    data-ocid="login.student.udise.input"
                    value={studentUdise}
                    onChange={(e) => setStudentUdise(e.target.value)}
                    placeholder="UDISE Number"
                    className={inputClass}
                    style={inputStyle}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white font-semibold text-sm mb-2 block devanagari">
                      इयत्ता
                    </Label>
                    <Input
                      data-ocid="login.student.class.input"
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      placeholder="उदा. 5"
                      className={inputClass}
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-white font-semibold text-sm mb-2 block devanagari">
                      तुकडी
                    </Label>
                    <Input
                      data-ocid="login.student.division.input"
                      value={studentDivision}
                      onChange={(e) => setStudentDivision(e.target.value)}
                      placeholder="उदा. अ"
                      className={inputClass}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white font-semibold text-sm mb-2 block devanagari">
                    हजेरी नंबर
                  </Label>
                  <Input
                    data-ocid="login.student.attendance.input"
                    value={studentAttendance}
                    onChange={(e) => setStudentAttendance(e.target.value)}
                    placeholder="हजेरी क्रमांक"
                    className={inputClass}
                    style={inputStyle}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  data-ocid="login.student.submit_button"
                  className="w-full gradient-blue text-white font-bold py-3 rounded-xl border-0 hover:opacity-90 transition-opacity"
                >
                  {loading ? "लॉगिन होत आहे..." : "विद्यार्थी Login"}
                </Button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          सर्व डेटा सुरक्षित ठेवला जातो • Canister Storage
        </p>

        {/* Footer */}
        <p className="text-center text-white/30 text-xs mt-3">
          © 2026 विद्यार्थी ऑनलाईन निकाल 2026 • Built with vaibhavgavali
        </p>
      </div>
    </div>
  );
}
