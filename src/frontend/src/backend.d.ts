import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Session {
    subjects: Array<Subject>;
    sessionName: string;
    projectAssessment?: string;
    observationAssessment?: string;
}
export interface Result {
    id: bigint;
    studentId: bigint;
    finalSession: Session;
    overallProgress: string;
    firstSession: Session;
}
export interface School {
    id: bigint;
    principal: string;
    name: string;
    address: string;
}
export interface Teacher {
    id: bigint;
    subject: string;
    name: string;
    schoolId: bigint;
}
export interface Subject {
    marks: bigint;
    remark?: string;
    grade: string;
}
export interface UserProfile {
    name: string;
    role: string;
}
export interface Student {
    id: bigint;
    name: string;
    schoolId: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addResult(studentId: bigint, firstSession: Session, finalSession: Session): Promise<bigint>;
    addSchool(name: string, address: string, principal: string): Promise<bigint>;
    addStudent(name: string, schoolId: bigint): Promise<bigint>;
    addTeacher(name: string, subject: string, schoolId: bigint): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteResult(id: bigint): Promise<void>;
    deleteSchool(id: bigint): Promise<void>;
    deleteStudent(id: bigint): Promise<void>;
    deleteTeacher(id: bigint): Promise<void>;
    getAllResults(): Promise<Array<Result>>;
    getAllSchools(): Promise<Array<School>>;
    getAllStudents(): Promise<Array<Student>>;
    getAllTeachers(): Promise<Array<Teacher>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getResult(id: bigint): Promise<Result>;
    getSchool(id: bigint): Promise<School>;
    getStudent(id: bigint): Promise<Student>;
    getTeacher(id: bigint): Promise<Teacher>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateResult(id: bigint, studentId: bigint, firstSession: Session, finalSession: Session, overallProgress: string): Promise<void>;
    updateSchool(id: bigint, name: string, address: string, principal: string): Promise<void>;
    updateStudent(id: bigint, name: string, schoolId: bigint): Promise<void>;
    updateTeacher(id: bigint, name: string, subject: string, schoolId: bigint): Promise<void>;
}
