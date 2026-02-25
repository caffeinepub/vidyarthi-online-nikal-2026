import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { type PageKey } from './layouts/DashboardLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SchoolInfoPage from './pages/SchoolInfoPage';
import TeacherInfoPage from './pages/TeacherInfoPage';
import StudentInfoPage from './pages/StudentInfoPage';
import EnterResultPage from './pages/EnterResultPage';
import ProgressReportPage from './pages/ProgressReportPage';
import StudentResultPrintPage from './pages/StudentResultPrintPage';
import TeacherManagePage from './pages/TeacherManagePage';

function AppContent() {
  const { isAuthenticated, session } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageKey>(() => {
    if (session?.role === 'student') return 'student-result-print';
    return 'home';
  });

  const handleNavigate = (page: PageKey) => {
    // Guard: students can only access student-result-print
    if (session?.role === 'student' && page !== 'student-result-print') return;
    // Guard: teacher-manage is admin only
    if (session?.role === 'teacher' && page === 'teacher-manage') return;
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'school-info': return <SchoolInfoPage />;
      case 'teacher-info': return <TeacherInfoPage />;
      case 'student-info': return <StudentInfoPage />;
      case 'enter-result': return <EnterResultPage />;
      case 'progress-report': return <ProgressReportPage />;
      case 'student-result-print': return <StudentResultPrintPage />;
      case 'teacher-manage': return <TeacherManagePage />;
      default: return <HomePage />;
    }
  };

  return (
    <DashboardLayout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
