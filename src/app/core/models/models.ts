// =============================================
// CORE MODELS — ODS Educación
// =============================================

export interface Country {
  id?: number;
  countryName: string;
  region: string;
}

export interface Ods {
  id?: number;
  odsNumber: number;
  odsName: string;
  description: string;
}

export interface Goal {
  id?: number;
  odsId: number;
  metaCode: string;
  metaDescription: string;
}

export interface Indicator {
  id?: number;
  metaId: number;
  indicatorName: string;
  measurementUnit: string;
}

export interface Person {
  id?: number;
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
}

export interface EducationalInstitution {
  id?: number;
  countryId: number;
  institutionName: string;
  institutionType: string;
  internetAccess: string;
  studentCount: number;
  infrastructureStatus: string;
}

export interface EducationalProgram {
  id?: number;
  countryId: number;
  institutionId: number;
  programName: string;
  educationalLevel: string;
  beneficiaries: number;
  startYear: number;
}

export interface Student {
  id?: number;
  personId: number;
  institutionId: number;
  programId: number;
  studentCode: string;
  grade: string;
  enrollmentDate: string;
  academicStatus: string;
}

export interface Teacher {
  id?: number;
  personId: number;
  institutionId: number;
  specialty: string;
  educationLevel: string;
  hiringDate: string;
  salary: number;
}
