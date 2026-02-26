import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTeacherLogins, getStudents } from '../lib/localStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, BookOpen, Shield, Phone, Hash } from 'lucide-react';

type LoginTab = 'admin' | 'teacher' | 'student';

export default function LoginPage() {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<LoginTab>('admin');
  const [error, setError] = useState('');

  // Admin form
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // Teacher form
  const [teacherMobile, setTeacherMobile] = useState('');

  // Student form
  const [studentUdise, setStudentUdise] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [studentDivision, setStudentDivision] = useState('');
  const [studentAttendance, setStudentAttendance] = useState('');

  const [loading, setLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (adminUser === 'admin' && adminPass === 'admin') {
        login({ role: 'admin', username: 'admin' });
      } else {
        setError('चुकीचे username किंवा password!');
      }
      setLoading(false);
    }, 400);
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const logins = getTeacherLogins();
      const found = logins.find(l => l.mobile === teacherMobile.trim());
      if (found) {
        login({ role: 'teacher', mobile: teacherMobile.trim(), udise: found.udise });
      } else {
        setError('हा मोबाईल नंबर नोंदणीकृत नाही!');
      }
      setLoading(false);
    }, 400);
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const students = getStudents();
      const found = students.find(
        s =>
          s.udise === studentUdise.trim() &&
          s.className === studentClass.trim() &&
          s.division === studentDivision.trim() &&
          s.attendanceNo === studentAttendance.trim()
      );
      if (found) {
        login({
          role: 'student',
          udise: found.udise,
          className: found.className,
          division: found.division,
          attendanceNo: found.attendanceNo,
          studentName: found.studentName,
        });
      } else {
        setError('विद्यार्थी माहिती जुळत नाही!');
      }
      setLoading(false);
    }, 400);
  };

  const tabs: { key: LoginTab; label: string; icon: React.ReactNode; color: string; bg: string }[] = [
    { key: 'admin', label: 'Admin', icon: <Shield size={20} />, color: 'text-white', bg: 'gradient-orange' },
    { key: 'teacher', label: 'शिक्षक', icon: <BookOpen size={20} />, color: 'text-white', bg: 'gradient-green' },
    { key: 'student', label: 'विद्यार्थी', icon: <GraduationCap size={20} />, color: 'text-white', bg: 'gradient-blue' },
  ];

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'oklch(0.72 0.22 35)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10" style={{ background: 'oklch(0.6 0.2 145)', transform: 'translate(-30%, 30%)' }} />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full opacity-5" style={{ background: 'oklch(0.82 0.18 85)' }} />

      {/* Logo & Title */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
            <img src="/assets/generated/app-logo.dim_256x256.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white devanagari tracking-tight">विद्यार्थी ऑनलाईन निकाल</h1>
        <p className="text-white/70 text-lg font-semibold mt-1">2026</p>
        <p className="text-white/50 text-sm mt-1">शाळा निकाल व्यवस्थापन प्रणाली</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Tab Selector */}
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setError(''); }}
                className={`flex-1 flex flex-col items-center gap-1 py-4 text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? `${tab.bg} text-white shadow-inner`
                    : 'text-white/60 hover:text-white/90 hover:bg-white/5'
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
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-400/30 text-red-200 text-sm devanagari text-center">
                {error}
              </div>
            )}

            {activeTab === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <Label className="text-white/80 text-sm mb-1 block">Username</Label>
                  <div className="relative">
                    <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <Input
                      value={adminUser}
                      onChange={e => setAdminUser(e.target.value)}
                      placeholder="admin"
                      className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-orange-400"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white/80 text-sm mb-1 block">Password</Label>
                  <div className="relative">
                    <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <Input
                      type="password"
                      value={adminPass}
                      onChange={e => setAdminPass(e.target.value)}
                      placeholder="••••••"
                      className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-orange-400"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-orange text-white font-bold py-3 rounded-xl border-0 hover:opacity-90 transition-opacity"
                >
                  {loading ? 'लॉगिन होत आहे...' : 'Admin Login'}
                </Button>
              </form>
            )}

            {activeTab === 'teacher' && (
              <form onSubmit={handleTeacherLogin} className="space-y-4">
                <div>
                  <Label className="text-white/80 text-sm mb-1 block devanagari">मोबाईल नंबर</Label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <Input
                      value={teacherMobile}
                      onChange={e => setTeacherMobile(e.target.value)}
                      placeholder="10 अंकी मोबाईल नंबर"
                      className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-green-400"
                      required
                      maxLength={10}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-green text-white font-bold py-3 rounded-xl border-0 hover:opacity-90 transition-opacity"
                >
                  {loading ? 'लॉगिन होत आहे...' : 'शिक्षक Login'}
                </Button>
              </form>
            )}

            {activeTab === 'student' && (
              <form onSubmit={handleStudentLogin} className="space-y-3">
                <div>
                  <Label className="text-white/80 text-sm mb-1 block devanagari">युडायस नंबर</Label>
                  <Input
                    value={studentUdise}
                    onChange={e => setStudentUdise(e.target.value)}
                    placeholder="UDISE Number"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-blue-400"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white/80 text-sm mb-1 block devanagari">इयत्ता</Label>
                    <Input
                      value={studentClass}
                      onChange={e => setStudentClass(e.target.value)}
                      placeholder="उदा. 5"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-white/80 text-sm mb-1 block devanagari">तुकडी</Label>
                    <Input
                      value={studentDivision}
                      onChange={e => setStudentDivision(e.target.value)}
                      placeholder="उदा. अ"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-blue-400"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white/80 text-sm mb-1 block devanagari">हजेरी नंबर</Label>
                  <Input
                    value={studentAttendance}
                    onChange={e => setStudentAttendance(e.target.value)}
                    placeholder="हजेरी क्रमांक"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-blue-400"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-blue text-white font-bold py-3 rounded-xl border-0 hover:opacity-90 transition-opacity"
                >
                  {loading ? 'लॉगिन होत आहे...' : 'विद्यार्थी Login'}
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
