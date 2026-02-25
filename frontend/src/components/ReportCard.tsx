import React from 'react';
import { SchoolExtra, StudentExtra, ResultExtra } from '../lib/localStorage';

interface ReportCardProps {
  school: SchoolExtra;
  student: StudentExtra;
  result: ResultExtra;
}

export default function ReportCard({ school, student, result }: ReportCardProps) {
  return (
    <div className="print-container bg-white text-black p-6 rounded-2xl border border-border shadow-card" id="report-card">
      {/* Header */}
      <div className="print-header text-center border-b-2 border-gray-800 pb-4 mb-4">
        <h2 className="text-xl font-bold devanagari">{school.name}</h2>
        <p className="text-sm devanagari">युडायस: {school.udise} | तालुका: {school.taluka} | जिल्हा: {school.district}</p>
        <h3 className="text-lg font-bold mt-2 devanagari">प्रगती पत्रक - {school.year}</h3>
      </div>

      {/* Student Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-xl">
        <div className="space-y-1 text-sm">
          <p><span className="font-semibold devanagari">विद्यार्थी नाव: </span><span className="devanagari">{student.studentName}</span></p>
          <p><span className="font-semibold devanagari">आईचे नाव: </span><span className="devanagari">{student.motherName}</span></p>
          <p><span className="font-semibold devanagari">जन्म दिनांक: </span>{student.dob}</p>
        </div>
        <div className="space-y-1 text-sm">
          <p><span className="font-semibold devanagari">इयत्ता: </span><span className="devanagari">{student.className}</span></p>
          <p><span className="font-semibold devanagari">तुकडी: </span><span className="devanagari">{student.division}</span></p>
          <p><span className="font-semibold devanagari">हजेरी नं.: </span>{student.attendanceNo}</p>
        </div>
      </div>

      {/* Semester 1 */}
      <div className="mb-4">
        <h4 className="font-bold devanagari text-center bg-orange-100 py-2 rounded-lg mb-2">प्रथम सत्र निकाल</h4>
        <table className="print-table w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-1 text-left devanagari">विषय</th>
              <th className="border border-gray-300 px-3 py-1 text-center devanagari">श्रेणी</th>
            </tr>
          </thead>
          <tbody>
            {result.semester1.subjects.map((s, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-3 py-1 devanagari">{s.subject}</td>
                <td className="border border-gray-300 px-3 py-1 text-center font-bold devanagari">{s.grade || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-gray-50 rounded"><span className="font-semibold devanagari">विशेष प्रगती: </span><span className="devanagari">{result.semester1.specialProgress || '-'}</span></div>
          <div className="p-2 bg-gray-50 rounded"><span className="font-semibold devanagari">आवड/छंद: </span><span className="devanagari">{result.semester1.hobby || '-'}</span></div>
          <div className="p-2 bg-gray-50 rounded"><span className="font-semibold devanagari">सुधारणा: </span><span className="devanagari">{result.semester1.improvement || '-'}</span></div>
        </div>
      </div>

      {/* Semester 2 */}
      <div className="mb-4">
        <h4 className="font-bold devanagari text-center bg-green-100 py-2 rounded-lg mb-2">द्वितीय सत्र निकाल</h4>
        <table className="print-table w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-1 text-left devanagari">विषय</th>
              <th className="border border-gray-300 px-3 py-1 text-center devanagari">श्रेणी</th>
            </tr>
          </thead>
          <tbody>
            {result.semester2.subjects.map((s, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-3 py-1 devanagari">{s.subject}</td>
                <td className="border border-gray-300 px-3 py-1 text-center font-bold devanagari">{s.grade || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-gray-50 rounded"><span className="font-semibold devanagari">विशेष प्रगती: </span><span className="devanagari">{result.semester2.specialProgress || '-'}</span></div>
          <div className="p-2 bg-gray-50 rounded"><span className="font-semibold devanagari">आवड/छंद: </span><span className="devanagari">{result.semester2.hobby || '-'}</span></div>
          <div className="p-2 bg-gray-50 rounded"><span className="font-semibold devanagari">सुधारणा: </span><span className="devanagari">{result.semester2.improvement || '-'}</span></div>
        </div>
      </div>

      {/* Signature */}
      <div className="flex justify-between mt-6 pt-4 border-t border-gray-300 text-sm">
        <div className="text-center">
          <div className="h-8 border-b border-gray-400 w-32 mb-1" />
          <p className="devanagari">वर्ग शिक्षक</p>
        </div>
        <div className="text-center">
          <div className="h-8 border-b border-gray-400 w-32 mb-1" />
          <p className="devanagari">मुख्याध्यापक</p>
        </div>
      </div>
    </div>
  );
}
