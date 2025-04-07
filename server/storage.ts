import { 
  type User, type InsertUser,
  type Report, type InsertReport,
  type Vet, type InsertVet,
  type Adoption, type InsertAdoption,
  type Donation, type InsertDonation,
  type Post, type InsertPost
} from "@shared/schema";
import session from "express-session";
import { MemStorage } from './mem-storage';

// Define storage interface with all required CRUD operations
export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Report operations
  createReport(report: InsertReport): Promise<Report>;
  getReport(id: number): Promise<Report | undefined>;
  getReports(limit?: number): Promise<Report[]>;
  getReportsByStatus(status: string): Promise<Report[]>;
  getReportsByUser(userId: number): Promise<Report[]>;
  updateReport(id: number, report: Partial<Report>): Promise<Report | undefined>;
  
  // Vet operations
  createVet(vet: InsertVet): Promise<Vet>;
  getVet(id: number): Promise<Vet | undefined>;
  getAllVets(): Promise<Vet[]>;
  updateVet(id: number, vet: Partial<Vet>): Promise<Vet | undefined>;
  
  // Adoption operations
  createAdoption(adoption: InsertAdoption): Promise<Adoption>;
  getAdoption(id: number): Promise<Adoption | undefined>;
  getAllAdoptions(): Promise<Adoption[]>;
  getAdoptionsByType(type: string): Promise<Adoption[]>;
  getAdoptionsByStatus(status: string): Promise<Adoption[]>;
  updateAdoption(id: number, adoption: Partial<Adoption>): Promise<Adoption | undefined>;
  
  // Donation operations
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonation(id: number): Promise<Donation | undefined>;
  getAllDonations(): Promise<Donation[]>;
  updateDonation(id: number, donation: Partial<Donation>): Promise<Donation | undefined>;
  
  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getPost(id: number): Promise<Post | undefined>;
  getAllPosts(): Promise<Post[]>;
  getPostsByUser(userId: number): Promise<Post[]>;
  updatePost(id: number, post: Partial<Post>): Promise<Post | undefined>;
}

// Initialize an in-memory storage instance for development
const memStorage = new MemStorage();

// Export the in-memory storage implementation
export const storage = memStorage;
