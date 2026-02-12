import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PhotographyWork {
    id: WorkId;
    categoryId: CategoryId;
    title: string;
    description: string;
    imageUrl: string;
}
export interface PortfolioCategory {
    id: CategoryId;
    name: string;
    description: string;
}
export type CertificateId = bigint;
export type CategoryId = bigint;
export type WorkId = bigint;
export interface UserProfile {
    name: string;
}
export interface Certificate {
    id: CertificateId;
    issueDate: string;
    title: string;
    issuingOrganization: string;
    credentialUrl: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCertificate(title: string, issuingOrganization: string, issueDate: string, credentialUrl: string): Promise<CertificateId>;
    addPhotographyWork(title: string, description: string, imageUrl: string, categoryId: CategoryId): Promise<WorkId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCategory(name: string, description: string): Promise<CategoryId>;
    deleteCategory(id: CategoryId): Promise<void>;
    deleteCertificate(id: CertificateId): Promise<void>;
    deletePhotographyWork(id: WorkId): Promise<void>;
    editCategory(id: CategoryId, name: string, description: string): Promise<void>;
    editCertificate(id: CertificateId, title: string, issuingOrganization: string, issueDate: string, credentialUrl: string): Promise<void>;
    editPhotographyWork(id: WorkId, title: string, description: string, imageUrl: string, categoryId: CategoryId): Promise<void>;
    getAllCategories(): Promise<Array<PortfolioCategory>>;
    getAllCertificates(): Promise<Array<Certificate>>;
    getAllWorks(): Promise<Array<PhotographyWork>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWorksByCategory(categoryId: CategoryId): Promise<Array<PhotographyWork>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
