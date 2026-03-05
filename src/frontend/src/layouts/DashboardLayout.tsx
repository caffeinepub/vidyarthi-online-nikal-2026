import {
  ChevronRight,
  ClipboardList,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  Printer,
  School,
  Settings,
  Users,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export type PageKey =
  | "home"
  | "school-info"
  | "teacher-info"
  | "student-info"
  | "enter-result"
  | "progress-report"
  | "student-result-print"
  | "teacher-manage";

interface NavItem {
  key: PageKey;
  label: string;
  icon: React.ReactNode;
  roles: ("admin" | "teacher" | "student")[];
  color: string;
}

const navItems: NavItem[] = [
  {
    key: "home",
    label: "Home",
    icon: <Home size={20} />,
    roles: ["admin", "teacher"],
    color: "text-orange-400",
  },
  {
    key: "school-info",
    label: "शाळा माहिती",
    icon: <School size={20} />,
    roles: ["admin", "teacher"],
    color: "text-blue-400",
  },
  {
    key: "teacher-info",
    label: "शिक्षक माहिती",
    icon: <Users size={20} />,
    roles: ["admin", "teacher"],
    color: "text-green-400",
  },
  {
    key: "student-info",
    label: "विद्यार्थी माहिती",
    icon: <GraduationCap size={20} />,
    roles: ["admin", "teacher"],
    color: "text-yellow-400",
  },
  {
    key: "enter-result",
    label: "निकाल भरा",
    icon: <ClipboardList size={20} />,
    roles: ["admin", "teacher"],
    color: "text-purple-400",
  },
  {
    key: "progress-report",
    label: "प्रगती पत्रक",
    icon: <FileText size={20} />,
    roles: ["admin", "teacher"],
    color: "text-pink-400",
  },
  {
    key: "student-result-print",
    label: "विद्यार्थी निकाल Print",
    icon: <Printer size={20} />,
    roles: ["admin", "teacher", "student"],
    color: "text-cyan-400",
  },
  {
    key: "teacher-manage",
    label: "Teacher Manage",
    icon: <Settings size={20} />,
    roles: ["admin"],
    color: "text-red-400",
  },
];

interface Props {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
  children: React.ReactNode;
}

export default function DashboardLayout({
  currentPage,
  onNavigate,
  children,
}: Props) {
  const { session, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const role = session?.role || "student";
  const visibleItems = navItems.filter((item) =>
    item.roles.includes(role as "admin" | "teacher" | "student"),
  );

  const getRoleBadge = () => {
    if (role === "admin") return { label: "Admin", cls: "gradient-orange" };
    if (role === "teacher") return { label: "शिक्षक", cls: "gradient-green" };
    return { label: "विद्यार्थी", cls: "gradient-blue" };
  };

  const badge = getRoleBadge();

  const getUserName = () => {
    if (!session) return "";
    if (session.role === "admin") return "Administrator";
    if (session.role === "teacher") return session.mobile;
    if (session.role === "student") return session.studentName || "विद्यार्थी";
    return "";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full sidebar-gradient">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src="/assets/generated/app-logo.dim_256x256.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm devanagari leading-tight">
                विद्यार्थी निकाल
              </p>
              <p className="text-white/50 text-xs">2026</p>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/10">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white ${badge.cls}`}
          >
            {badge.label}
          </div>
          <p className="text-white/70 text-xs mt-1 truncate">{getUserName()}</p>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => (
          <button
            type="button"
            key={item.key}
            onClick={() => {
              onNavigate(item.key);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 devanagari ${
              currentPage === item.key
                ? "bg-white/15 text-white shadow-sm"
                : "text-white/60 hover:bg-white/8 hover:text-white/90"
            }`}
          >
            <span className={`flex-shrink-0 ${item.color}`}>{item.icon}</span>
            {!collapsed && (
              <>
                <span className="flex-1 text-left truncate">{item.label}</span>
                {currentPage === item.key && (
                  <ChevronRight size={14} className="text-white/40" />
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        {!collapsed && (
          <>
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-150"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
            <p className="text-center text-white/30 text-xs mt-2 px-1 leading-relaxed">
              © 2026 विद्यार्थी ऑनलाईन निकाल 2026 • Built with vaibhavgavali
            </p>
          </>
        )}
        {collapsed && (
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close sidebar"
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 animate-slide-in">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 py-3 bg-card border-b border-border shadow-xs flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu size={20} />
            </button>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
            <div>
              <h2 className="font-bold text-foreground text-sm devanagari">
                {visibleItems.find((i) => i.key === currentPage)?.label ||
                  "Dashboard"}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white ${badge.cls}`}
            >
              {badge.label}
            </span>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
