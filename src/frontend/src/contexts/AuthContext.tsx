import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type UserRole = "admin" | "teacher" | "student";

export interface AdminSession {
  role: "admin";
  username: string;
}

export interface TeacherSession {
  role: "teacher";
  mobile: string;
  udise?: string;
}

export interface StudentSession {
  role: "student";
  udise: string;
  className: string;
  division: string;
  attendanceNo: string;
  studentName?: string;
}

export type AuthSession = AdminSession | TeacherSession | StudentSession;

interface AuthContextType {
  session: AuthSession | null;
  login: (session: AuthSession) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => {
    try {
      const stored = sessionStorage.getItem("nikal_session");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((newSession: AuthSession) => {
    setSession(newSession);
    try {
      sessionStorage.setItem("nikal_session", JSON.stringify(newSession));
    } catch {
      // ignore
    }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    try {
      sessionStorage.removeItem("nikal_session");
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, login, logout, isAuthenticated: !!session }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
