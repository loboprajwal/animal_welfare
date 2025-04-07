import { 
  type User, type InsertUser,
  type Report, type InsertReport,
  type Vet, type InsertVet,
  type Adoption, type InsertAdoption,
  type Donation, type InsertDonation,
  type Post, type InsertPost
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { IStorage } from "./storage";

// Create memory store for sessions
const MemoryStore = createMemoryStore(session);
export const sessionStore = new MemoryStore({
  checkPeriod: 86400000 // prune expired entries every 24h
});

// Simple in-memory storage implementation
export class MemStorage implements IStorage {
  sessionStore = sessionStore;
  users: User[] = [];
  reports: Report[] = [];
  vets: Vet[] = [];
  adoptions: Adoption[] = [];
  donations: Donation[] = [];
  posts: Post[] = [];
  
  private nextIds = {
    user: 1,
    report: 1,
    vet: 1,
    adoption: 1,
    donation: 1,
    post: 1
  };
  
  constructor() {
    // Pre-populate with sample data
    this.seedSampleData();
  }
  
  private seedSampleData() {
    // Sample vets
    this.vets = [
      {
        id: this.nextIds.vet++,
        name: "Animal Care Clinic",
        address: "123 Main St",
        phone: "555-1234",
        email: "clinic@example.com",
        latitude: "40.7128",
        longitude: "-74.0060",
        rating: 4,
        isOpen: true
      },
      {
        id: this.nextIds.vet++,
        name: "Emergency Pet Hospital",
        address: "456 Oak Ave",
        phone: "555-5678",
        email: "emergency@example.com",
        latitude: "40.7148",
        longitude: "-74.0068",
        rating: 5,
        isOpen: true
      }
    ];
    
    // Sample admin user with properly hashed password
    this.users.push({
      id: this.nextIds.user++,
      name: "Admin",
      email: "admin@example.com",
      username: "admin",
      password: "5d45c4f09b3b1b23f05bce945e8b87303c2dbca8fcee4e076320b329bb95d21f50ee789e751a3cdd0e0e61a8b2287fe6e27625ecdeb3fa9a32f2d36a318ae575.8a9f5f137a71c3b3",
      role: "admin",
      phone: null,
      address: null,
      createdAt: new Date()
    });

    // Sample adoptions
    this.adoptions = [
      {
        id: this.nextIds.adoption++,
        name: "Max",
        type: "dog",
        breed: "Golden Retriever",
        age: "3 years",
        gender: "male",
        description: "Friendly and playful golden retriever looking for a forever home.",
        imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=662&q=80",
        status: "available",
        createdAt: new Date()
      },
      {
        id: this.nextIds.adoption++,
        name: "Whiskers",
        type: "cat",
        breed: "Siamese",
        age: "2 years",
        gender: "female",
        description: "Beautiful Siamese cat that loves to cuddle.",
        imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80",
        status: "available",
        createdAt: new Date()
      }
    ];

    // Sample donations
    this.donations = [
      {
        id: this.nextIds.donation++,
        title: "Help Injured Wildlife",
        description: "Support our efforts to rescue and rehabilitate injured wildlife affected by recent wildfires.",
        goalAmount: 5000,
        raisedAmount: 2500,
        imageUrl: "https://images.unsplash.com/photo-1584118624012-df056829fbd0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80",
        createdAt: new Date()
      },
      {
        id: this.nextIds.donation++,
        title: "Shelter Expansion Project",
        description: "Help us expand our animal shelter to accommodate more rescues.",
        goalAmount: 10000,
        raisedAmount: 7500,
        imageUrl: "https://images.unsplash.com/photo-1604848698030-c434ba08ece1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        createdAt: new Date()
      }
    ];

    // Sample reports
    this.reports = [
      {
        id: this.nextIds.report++,
        userId: 1,
        animalType: "dog",
        description: "Found a dog with an injured paw near Main Street Park.",
        location: "Main Street Park",
        latitude: "40.7128",
        longitude: "-74.0060",
        status: "pending",
        urgency: "urgent",
        imageUrl: "https://images.unsplash.com/photo-1634913940926-05e7c8cf8816?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.nextIds.report++,
        userId: 1,
        animalType: "cat",
        description: "Group of stray cats needing food and shelter behind Oak Street apartments.",
        location: "Oak Street Apartments",
        latitude: "40.7148",
        longitude: "-74.0068",
        status: "pending",
        urgency: "normal",
        imageUrl: "https://images.unsplash.com/photo-1626602411112-23ea4a827627?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      ...user,
      id: this.nextIds.user++,
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return this.users;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    
    this.users[index] = { ...this.users[index], ...userData };
    return this.users[index];
  }
  
  // Report operations
  async createReport(report: InsertReport): Promise<Report> {
    const newReport: Report = {
      ...report,
      id: this.nextIds.report++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.reports.push(newReport);
    return newReport;
  }
  
  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.find(r => r.id === id);
  }
  
  async getReports(limit?: number): Promise<Report[]> {
    const sorted = [...this.reports].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }
  
  async getReportsByStatus(status: string): Promise<Report[]> {
    return this.reports.filter(r => r.status === status);
  }
  
  async getReportsByUser(userId: number): Promise<Report[]> {
    return this.reports.filter(r => r.userId === userId);
  }
  
  async updateReport(id: number, reportData: Partial<Report>): Promise<Report | undefined> {
    const index = this.reports.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    
    this.reports[index] = { 
      ...this.reports[index], 
      ...reportData,
      updatedAt: new Date()
    };
    return this.reports[index];
  }
  
  // Vet operations
  async createVet(vet: InsertVet): Promise<Vet> {
    const newVet: Vet = {
      ...vet,
      id: this.nextIds.vet++
    };
    this.vets.push(newVet);
    return newVet;
  }
  
  async getVet(id: number): Promise<Vet | undefined> {
    return this.vets.find(v => v.id === id);
  }
  
  async getAllVets(): Promise<Vet[]> {
    return this.vets;
  }
  
  async updateVet(id: number, vetData: Partial<Vet>): Promise<Vet | undefined> {
    const index = this.vets.findIndex(v => v.id === id);
    if (index === -1) return undefined;
    
    this.vets[index] = { ...this.vets[index], ...vetData };
    return this.vets[index];
  }
  
  // Adoption operations
  async createAdoption(adoption: InsertAdoption): Promise<Adoption> {
    const newAdoption: Adoption = {
      ...adoption,
      id: this.nextIds.adoption++,
      createdAt: new Date()
    };
    this.adoptions.push(newAdoption);
    return newAdoption;
  }
  
  async getAdoption(id: number): Promise<Adoption | undefined> {
    return this.adoptions.find(a => a.id === id);
  }
  
  async getAllAdoptions(): Promise<Adoption[]> {
    return this.adoptions;
  }
  
  async getAdoptionsByType(type: string): Promise<Adoption[]> {
    return this.adoptions.filter(a => a.type === type);
  }
  
  async getAdoptionsByStatus(status: string): Promise<Adoption[]> {
    return this.adoptions.filter(a => a.status === status);
  }
  
  async updateAdoption(id: number, adoptionData: Partial<Adoption>): Promise<Adoption | undefined> {
    const index = this.adoptions.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    
    this.adoptions[index] = { ...this.adoptions[index], ...adoptionData };
    return this.adoptions[index];
  }
  
  // Donation operations
  async createDonation(donation: InsertDonation): Promise<Donation> {
    const newDonation: Donation = {
      ...donation,
      id: this.nextIds.donation++,
      raisedAmount: 0,
      createdAt: new Date()
    };
    this.donations.push(newDonation);
    return newDonation;
  }
  
  async getDonation(id: number): Promise<Donation | undefined> {
    return this.donations.find(d => d.id === id);
  }
  
  async getAllDonations(): Promise<Donation[]> {
    return this.donations;
  }
  
  async updateDonation(id: number, donationData: Partial<Donation>): Promise<Donation | undefined> {
    const index = this.donations.findIndex(d => d.id === id);
    if (index === -1) return undefined;
    
    this.donations[index] = { ...this.donations[index], ...donationData };
    return this.donations[index];
  }
  
  // Post operations
  async createPost(post: InsertPost): Promise<Post> {
    const newPost: Post = {
      ...post,
      id: this.nextIds.post++,
      createdAt: new Date()
    };
    this.posts.push(newPost);
    return newPost;
  }
  
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.find(p => p.id === id);
  }
  
  async getAllPosts(): Promise<Post[]> {
    return this.posts;
  }
  
  async getPostsByUser(userId: number): Promise<Post[]> {
    return this.posts.filter(p => p.userId === userId);
  }
  
  async updatePost(id: number, postData: Partial<Post>): Promise<Post | undefined> {
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    this.posts[index] = { ...this.posts[index], ...postData };
    return this.posts[index];
  }
}