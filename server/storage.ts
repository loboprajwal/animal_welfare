import { 
  users, type User, type InsertUser,
  reports, type Report, type InsertReport,
  vets, type Vet, type InsertVet,
  adoptions, type Adoption, type InsertAdoption,
  donations, type Donation, type InsertDonation,
  posts, type Post, type InsertPost
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Define storage interface with all required CRUD operations
export interface IStorage {
  // Session store
  sessionStore: session.SessionStore;
  
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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private reports: Map<number, Report>;
  private vets: Map<number, Vet>;
  private adoptions: Map<number, Adoption>;
  private donations: Map<number, Donation>;
  private posts: Map<number, Post>;
  sessionStore: session.SessionStore;
  
  // IDs for auto-increment
  private userIdCounter: number;
  private reportIdCounter: number;
  private vetIdCounter: number;
  private adoptionIdCounter: number;
  private donationIdCounter: number;
  private postIdCounter: number;

  constructor() {
    this.users = new Map();
    this.reports = new Map();
    this.vets = new Map();
    this.adoptions = new Map();
    this.donations = new Map();
    this.posts = new Map();
    
    this.userIdCounter = 1;
    this.reportIdCounter = 1;
    this.vetIdCounter = 1;
    this.adoptionIdCounter = 1;
    this.donationIdCounter = 1;
    this.postIdCounter = 1;

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Add some initial vets data
    this.seedVets();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Report operations
  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.reportIdCounter++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const report: Report = { ...insertReport, id, createdAt, updatedAt };
    this.reports.set(id, report);
    return report;
  }

  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getReports(limit?: number): Promise<Report[]> {
    const reports = Array.from(this.reports.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    
    return limit ? reports.slice(0, limit) : reports;
  }

  async getReportsByStatus(status: string): Promise<Report[]> {
    return Array.from(this.reports.values())
      .filter(report => report.status === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getReportsByUser(userId: number): Promise<Report[]> {
    return Array.from(this.reports.values())
      .filter(report => report.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateReport(id: number, reportData: Partial<Report>): Promise<Report | undefined> {
    const report = await this.getReport(id);
    if (!report) return undefined;
    
    const updatedReport = { 
      ...report, 
      ...reportData,
      updatedAt: new Date()
    };
    
    this.reports.set(id, updatedReport);
    return updatedReport;
  }

  // Vet operations
  async createVet(insertVet: InsertVet): Promise<Vet> {
    const id = this.vetIdCounter++;
    const vet: Vet = { ...insertVet, id };
    this.vets.set(id, vet);
    return vet;
  }

  async getVet(id: number): Promise<Vet | undefined> {
    return this.vets.get(id);
  }

  async getAllVets(): Promise<Vet[]> {
    return Array.from(this.vets.values());
  }

  async updateVet(id: number, vetData: Partial<Vet>): Promise<Vet | undefined> {
    const vet = await this.getVet(id);
    if (!vet) return undefined;
    
    const updatedVet = { ...vet, ...vetData };
    this.vets.set(id, updatedVet);
    return updatedVet;
  }

  // Adoption operations
  async createAdoption(insertAdoption: InsertAdoption): Promise<Adoption> {
    const id = this.adoptionIdCounter++;
    const createdAt = new Date();
    const adoption: Adoption = { ...insertAdoption, id, createdAt };
    this.adoptions.set(id, adoption);
    return adoption;
  }

  async getAdoption(id: number): Promise<Adoption | undefined> {
    return this.adoptions.get(id);
  }

  async getAllAdoptions(): Promise<Adoption[]> {
    return Array.from(this.adoptions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getAdoptionsByType(type: string): Promise<Adoption[]> {
    return Array.from(this.adoptions.values())
      .filter(adoption => adoption.type === type)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAdoptionsByStatus(status: string): Promise<Adoption[]> {
    return Array.from(this.adoptions.values())
      .filter(adoption => adoption.status === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateAdoption(id: number, adoptionData: Partial<Adoption>): Promise<Adoption | undefined> {
    const adoption = await this.getAdoption(id);
    if (!adoption) return undefined;
    
    const updatedAdoption = { ...adoption, ...adoptionData };
    this.adoptions.set(id, updatedAdoption);
    return updatedAdoption;
  }

  // Donation operations
  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = this.donationIdCounter++;
    const createdAt = new Date();
    const donation: Donation = { 
      ...insertDonation, 
      id, 
      createdAt,
      raisedAmount: 0
    };
    this.donations.set(id, donation);
    return donation;
  }

  async getDonation(id: number): Promise<Donation | undefined> {
    return this.donations.get(id);
  }

  async getAllDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateDonation(id: number, donationData: Partial<Donation>): Promise<Donation | undefined> {
    const donation = await this.getDonation(id);
    if (!donation) return undefined;
    
    const updatedDonation = { ...donation, ...donationData };
    this.donations.set(id, updatedDonation);
    return updatedDonation;
  }

  // Post operations
  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.postIdCounter++;
    const createdAt = new Date();
    const post: Post = { ...insertPost, id, createdAt };
    this.posts.set(id, post);
    return post;
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getPostsByUser(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updatePost(id: number, postData: Partial<Post>): Promise<Post | undefined> {
    const post = await this.getPost(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...postData };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  // Seed initial vet data
  private seedVets() {
    const initialVets: InsertVet[] = [
      {
        name: "Animal Care Clinic",
        address: "123 Main St, Andheri West, Mumbai",
        phone: "+91 9876543210",
        email: "info@animalcareclinic.com",
        latitude: "19.1200",
        longitude: "72.8700",
        rating: 5,
        isOpen: true
      },
      {
        name: "Pet Care Hospital",
        address: "456 Park Avenue, Bandra, Mumbai",
        phone: "+91 9876543211",
        email: "contact@petcarehospital.com",
        latitude: "19.0600",
        longitude: "72.8300",
        rating: 4,
        isOpen: true
      },
      {
        name: "City Vet Clinic",
        address: "789 Lake Road, Powai, Mumbai",
        phone: "+91 9876543212",
        email: "help@cityvetclinic.com",
        latitude: "19.1100",
        longitude: "72.9000",
        rating: 4,
        isOpen: false
      }
    ];

    initialVets.forEach(vet => this.createVet(vet));
  }
}

export const storage = new MemStorage();
