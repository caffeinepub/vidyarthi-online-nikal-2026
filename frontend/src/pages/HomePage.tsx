import React from 'react';
import { useStudents } from '../hooks/useQueries';
import { getResults } from '../lib/localStorage';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, CheckCircle, XCircle, TrendingUp, School } from 'lucide-react';

export default function HomePage() {
  const { session } = useAuth();
  const { data: students = [], isLoading } = useStudents();
  const results = getResults();

  const udiseFilter = session?.role === 'teacher' && session.udise ? session.udise : null;

  const filteredStudents = udiseFilter
    ? students.filter(s => s.udise === udiseFilter)
    : students;

  const studentsWithResults = filteredStudents.filter(s =>
    results.some(r => r.studentId === s.id)
  );
  const studentsWithoutResults = filteredStudents.filter(s =>
    !results.some(r => r.studentId === s.id)
  );

  const stats = [
    {
      label: 'एकूण विद्यार्थी',
      value: filteredStudents.length,
      icon: <GraduationCap size={28} />,
      gradient: 'gradient-orange',
      desc: 'Total Students',
    },
    {
      label: 'मार्क भरलेले',
      value: studentsWithResults.length,
      icon: <CheckCircle size={28} />,
      gradient: 'gradient-green',
      desc: 'Results Entered',
    },
    {
      label: 'मार्क नभरलेले',
      value: studentsWithoutResults.length,
      icon: <XCircle size={28} />,
      gradient: 'gradient-red',
      desc: 'Results Pending',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="rounded-2xl gradient-hero p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <School size={20} className="text-yellow-300" />
            <span className="text-yellow-300 text-sm font-semibold">विद्यार्थी ऑनलाईन निकाल 2026</span>
          </div>
          <h1 className="text-2xl font-bold devanagari">नमस्कार! 🙏</h1>
          <p className="text-white/70 text-sm mt-1 devanagari">
            {session?.role === 'admin' ? 'सर्व शाळांची माहिती' : 'आपल्या शाळेची माहिती'}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`${stat.gradient} rounded-2xl p-5 text-white shadow-card card-hover`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium devanagari">{stat.label}</p>
                <p className="text-4xl font-bold mt-1">
                  {isLoading ? '...' : stat.value}
                </p>
                <p className="text-white/60 text-xs mt-1">{stat.desc}</p>
              </div>
              <div className="bg-white/20 rounded-xl p-2.5">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      {filteredStudents.length > 0 && (
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-primary" />
            <h3 className="font-semibold text-foreground devanagari">निकाल प्रगती</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span className="devanagari">भरलेले निकाल</span>
              <span>{studentsWithResults.length} / {filteredStudents.length}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="gradient-green h-3 rounded-full transition-all duration-500"
                style={{ width: `${filteredStudents.length > 0 ? (studentsWithResults.length / filteredStudents.length) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {filteredStudents.length > 0
                ? `${Math.round((studentsWithResults.length / filteredStudents.length) * 100)}% पूर्ण`
                : '0% पूर्ण'}
            </p>
          </div>
        </div>
      )}

      {/* Quick Info */}
      <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
        <h3 className="font-semibold text-foreground devanagari mb-3">📋 माहिती</h3>
        <div className="space-y-2 text-sm text-muted-foreground devanagari">
          <p>• शाळा माहिती, शिक्षक माहिती, विद्यार्थी माहिती भरा</p>
          <p>• निकाल भरा पेज वर विद्यार्थ्यांचे निकाल नोंदवा</p>
          <p>• प्रगती पत्रक पेज वर निकाल पाहा व प्रिंट करा</p>
        </div>
      </div>
    </div>
  );
}
