import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Subject = {
    marks : Nat;
    grade : Text;
    remark : ?Text;
  };

  type Session = {
    sessionName : Text;
    subjects : [Subject];
    projectAssessment : ?Text;
    observationAssessment : ?Text;
  };

  public type School = {
    id : Nat;
    name : Text;
    address : Text;
    principal : Text;
  };

  public type Teacher = {
    id : Nat;
    name : Text;
    subject : Text;
    schoolId : Nat;
  };

  public type Student = {
    id : Nat;
    name : Text;
    schoolId : Nat;
  };

  public type Result = {
    id : Nat;
    studentId : Nat;
    firstSession : Session;
    finalSession : Session;
    overallProgress : Text;
  };

  public type UserProfile = {
    name : Text;
    role : Text;
  };

  var schoolIdCounter = 0;
  var teacherIdCounter = 0;
  var studentIdCounter = 0;
  var resultIdCounter = 0;

  let schools = Map.empty<Nat, School>();
  let teachers = Map.empty<Nat, Teacher>();
  let students = Map.empty<Nat, Student>();
  let results = Map.empty<Nat, Result>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile functions (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // School functions - Admin only for mutations, users can read
  public shared ({ caller }) func addSchool(name : Text, address : Text, principal : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only Admins can perform this action");
    };
    let id = schoolIdCounter;
    schoolIdCounter += 1;
    let school : School = {
      id;
      name;
      address;
      principal;
    };
    schools.add(id, school);
    id;
  };

  public query ({ caller }) func getSchool(id : Nat) : async School {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view school records");
    };
    switch (schools.get(id)) {
      case (null) { Runtime.trap("School not found") };
      case (?school) { school };
    };
  };

  public query ({ caller }) func getAllSchools() : async [School] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view school records");
    };
    var result : [School] = [];
    for ((_, school) in schools.entries()) {
      result := result.concat([school]);
    };
    result;
  };

  public shared ({ caller }) func updateSchool(id : Nat, name : Text, address : Text, principal : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only Admins can perform this action");
    };
    let school : School = {
      id;
      name;
      address;
      principal;
    };
    schools.add(id, school);
  };

  public shared ({ caller }) func deleteSchool(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only Admins can perform this action");
    };
    schools.remove(id);
  };

  // Teacher functions - Admin only for mutations, users can read
  public shared ({ caller }) func addTeacher(name : Text, subject : Text, schoolId : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only Admins can perform this action");
    };
    let id = teacherIdCounter;
    teacherIdCounter += 1;
    let teacher : Teacher = {
      id;
      name;
      subject;
      schoolId;
    };
    teachers.add(id, teacher);
    id;
  };

  public query ({ caller }) func getTeacher(id : Nat) : async Teacher {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view teacher records");
    };
    switch (teachers.get(id)) {
      case (null) { Runtime.trap("Teacher not found") };
      case (?teacher) { teacher };
    };
  };

  public query ({ caller }) func getAllTeachers() : async [Teacher] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view teacher records");
    };
    var result : [Teacher] = [];
    for ((_, teacher) in teachers.entries()) {
      result := result.concat([teacher]);
    };
    result;
  };

  public shared ({ caller }) func updateTeacher(id : Nat, name : Text, subject : Text, schoolId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only Admins can perform this action");
    };
    let teacher : Teacher = {
      id;
      name;
      subject;
      schoolId;
    };
    teachers.add(id, teacher);
  };

  public shared ({ caller }) func deleteTeacher(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only Admins can perform this action");
    };
    teachers.remove(id);
  };

  // Student functions - Authenticated users (teachers/admins) for mutations, users can read
  public shared ({ caller }) func addStudent(name : Text, schoolId : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add students");
    };
    let id = studentIdCounter;
    studentIdCounter += 1;
    let student : Student = {
      id;
      name;
      schoolId;
    };
    students.add(id, student);
    id;
  };

  public query ({ caller }) func getStudent(id : Nat) : async Student {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view student records");
    };
    switch (students.get(id)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) { student };
    };
  };

  public query ({ caller }) func getAllStudents() : async [Student] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view student records");
    };
    var result : [Student] = [];
    for ((_, student) in students.entries()) {
      result := result.concat([student]);
    };
    result;
  };

  public shared ({ caller }) func updateStudent(id : Nat, name : Text, schoolId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update student records");
    };
    let student : Student = {
      id;
      name;
      schoolId;
    };
    students.add(id, student);
  };

  public shared ({ caller }) func deleteStudent(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only Admins can delete student records");
    };
    students.remove(id);
  };

  // Result functions - Authenticated users (teachers/admins) for mutations, users can read
  public shared ({ caller }) func addResult(studentId : Nat, firstSession : Session, finalSession : Session) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add results");
    };
    let id = resultIdCounter;
    resultIdCounter += 1;
    let result : Result = {
      id;
      studentId;
      firstSession;
      finalSession;
      overallProgress = "";
    };
    results.add(id, result);
    id;
  };

  public query ({ caller }) func getResult(id : Nat) : async Result {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view results");
    };
    switch (results.get(id)) {
      case (null) { Runtime.trap("Result not found") };
      case (?result) { result };
    };
  };

  public query ({ caller }) func getAllResults() : async [Result] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view results");
    };
    var result : [Result] = [];
    for ((_, r) in results.entries()) {
      result := result.concat([r]);
    };
    result;
  };

  public shared ({ caller }) func updateResult(id : Nat, studentId : Nat, firstSession : Session, finalSession : Session, overallProgress : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update results");
    };
    let result : Result = {
      id;
      studentId;
      firstSession;
      finalSession;
      overallProgress;
    };
    results.add(id, result);
  };

  public shared ({ caller }) func deleteResult(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only Admins can delete results");
    };
    results.remove(id);
  };
};
