import { 
  User, InsertUser,
  Report, InsertReport,
  Vet, InsertVet,
  Adoption, InsertAdoption,
  Donation, InsertDonation,
  Post, InsertPost
} from '@shared/schema';
import { IStorage } from './storage';
import { getDb, sessionStore } from './db';
import { Document, WithId } from 'mongodb';

// MongoDB implementation of the storage interface
export class MongoStorage implements IStorage {
  sessionStore = sessionStore;

  // Helper function to convert MongoDB document to model
  private convertDocument<T>(doc: WithId<Document> | null): T | undefined {
    if (!doc) return undefined;
    // Remove MongoDB _id field and convert to our schema type
    const { _id, ...rest } = doc;
    return rest as unknown as T;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const db = await getDb();
    const user = await db.collection('users').findOne({ id });
    return this.convertDocument<User>(user);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await getDb();
    const user = await db.collection('users').findOne({ username });
    return this.convertDocument<User>(user);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const db = await getDb();
    const user = await db.collection('users').findOne({ email });
    return this.convertDocument<User>(user);
  }

  async createUser(user: InsertUser): Promise<User> {
    const db = await getDb();
    const usersCollection = db.collection('users');
    
    // Get the highest ID currently in the collection
    const highestUser = await usersCollection.find().sort({ id: -1 }).limit(1).toArray();
    const nextId = highestUser.length > 0 ? (highestUser[0]?.id || 0) + 1 : 1;
    
    const newUser: User = {
      ...user,
      id: nextId,
      createdAt: new Date(),
      role: user.role || 'user', // Ensure role is set
      phone: user.phone || null,
      address: user.address || null
    };
    
    await usersCollection.insertOne(newUser);
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    const db = await getDb();
    const users = await db.collection('users').find().toArray();
    return users.map(user => this.convertDocument<User>(user)!);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const db = await getDb();
    const result = await db.collection('users').findOneAndUpdate(
      { id },
      { $set: userData },
      { returnDocument: 'after' }
    );
    
    return this.convertDocument<User>(result);
  }

  // Report operations
  async createReport(report: InsertReport): Promise<Report> {
    const db = await getDb();
    const reportsCollection = db.collection('reports');
    
    // Get the highest ID currently in the collection
    const highestReport = await reportsCollection.find().sort({ id: -1 }).limit(1).toArray();
    const nextId = highestReport.length > 0 ? (highestReport[0]?.id || 0) + 1 : 1;
    
    const now = new Date();
    const newReport: Report = {
      ...report,
      id: nextId,
      createdAt: now,
      updatedAt: now,
      status: report.status || 'pending',
      urgency: report.urgency || 'normal',
      latitude: report.latitude || null,
      longitude: report.longitude || null,
      imageUrl: report.imageUrl || null
    };
    
    await reportsCollection.insertOne(newReport);
    return newReport;
  }

  async getReport(id: number): Promise<Report | undefined> {
    const db = await getDb();
    const report = await db.collection('reports').findOne({ id });
    return this.convertDocument<Report>(report);
  }

  async getReports(limit?: number): Promise<Report[]> {
    const db = await getDb();
    const query = db.collection('reports').find().sort({ createdAt: -1 });
    
    if (limit) {
      query.limit(limit);
    }
    
    const reports = await query.toArray();
    return reports.map(report => this.convertDocument<Report>(report)!);
  }

  async getReportsByStatus(status: string): Promise<Report[]> {
    const db = await getDb();
    const reports = await db.collection('reports')
      .find({ status })
      .sort({ createdAt: -1 })
      .toArray();
    
    return reports.map(report => this.convertDocument<Report>(report)!);
  }

  async getReportsByUser(userId: number): Promise<Report[]> {
    const db = await getDb();
    const reports = await db.collection('reports')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    return reports.map(report => this.convertDocument<Report>(report)!);
  }

  async updateReport(id: number, reportData: Partial<Report>): Promise<Report | undefined> {
    const db = await getDb();
    const updatedData = {
      ...reportData,
      updatedAt: new Date()
    };
    
    const result = await db.collection('reports').findOneAndUpdate(
      { id },
      { $set: updatedData },
      { returnDocument: 'after' }
    );
    
    return this.convertDocument<Report>(result);
  }

  // Vet operations
  async createVet(vet: InsertVet): Promise<Vet> {
    const db = await getDb();
    const vetsCollection = db.collection('vets');
    
    // Get the highest ID currently in the collection
    const highestVet = await vetsCollection.find().sort({ id: -1 }).limit(1).toArray();
    const nextId = highestVet.length > 0 ? (highestVet[0]?.id || 0) + 1 : 1;
    
    const newVet: Vet = {
      ...vet,
      id: nextId,
      email: vet.email || null,
      latitude: vet.latitude || null,
      longitude: vet.longitude || null,
      rating: vet.rating || null,
      isOpen: vet.isOpen ?? null
    };
    
    await vetsCollection.insertOne(newVet);
    return newVet;
  }

  async getVet(id: number): Promise<Vet | undefined> {
    const db = await getDb();
    const vet = await db.collection('vets').findOne({ id });
    return this.convertDocument<Vet>(vet);
  }

  async getAllVets(): Promise<Vet[]> {
    const db = await getDb();
    const vets = await db.collection('vets').find().toArray();
    return vets.map(vet => this.convertDocument<Vet>(vet)!);
  }

  async updateVet(id: number, vetData: Partial<Vet>): Promise<Vet | undefined> {
    const db = await getDb();
    const result = await db.collection('vets').findOneAndUpdate(
      { id },
      { $set: vetData },
      { returnDocument: 'after' }
    );
    
    return this.convertDocument<Vet>(result);
  }

  // Adoption operations
  async createAdoption(adoption: InsertAdoption): Promise<Adoption> {
    const db = await getDb();
    const adoptionsCollection = db.collection('adoptions');
    
    // Get the highest ID currently in the collection
    const highestAdoption = await adoptionsCollection.find().sort({ id: -1 }).limit(1).toArray();
    const nextId = highestAdoption.length > 0 ? (highestAdoption[0]?.id || 0) + 1 : 1;
    
    const newAdoption: Adoption = {
      ...adoption,
      id: nextId,
      createdAt: new Date(),
      status: adoption.status || 'available',
      imageUrl: adoption.imageUrl || null,
      breed: adoption.breed || null
    };
    
    await adoptionsCollection.insertOne(newAdoption);
    return newAdoption;
  }

  async getAdoption(id: number): Promise<Adoption | undefined> {
    const db = await getDb();
    const adoption = await db.collection('adoptions').findOne({ id });
    return this.convertDocument<Adoption>(adoption);
  }

  async getAllAdoptions(): Promise<Adoption[]> {
    const db = await getDb();
    const adoptions = await db.collection('adoptions').find().toArray();
    return adoptions.map(adoption => this.convertDocument<Adoption>(adoption)!);
  }

  async getAdoptionsByType(type: string): Promise<Adoption[]> {
    const db = await getDb();
    const adoptions = await db.collection('adoptions')
      .find({ type })
      .toArray();
    
    return adoptions.map(adoption => this.convertDocument<Adoption>(adoption)!);
  }

  async getAdoptionsByStatus(status: string): Promise<Adoption[]> {
    const db = await getDb();
    const adoptions = await db.collection('adoptions')
      .find({ status })
      .toArray();
    
    return adoptions.map(adoption => this.convertDocument<Adoption>(adoption)!);
  }

  async updateAdoption(id: number, adoptionData: Partial<Adoption>): Promise<Adoption | undefined> {
    const db = await getDb();
    const result = await db.collection('adoptions').findOneAndUpdate(
      { id },
      { $set: adoptionData },
      { returnDocument: 'after' }
    );
    
    return this.convertDocument<Adoption>(result);
  }

  // Donation operations
  async createDonation(donation: InsertDonation): Promise<Donation> {
    const db = await getDb();
    const donationsCollection = db.collection('donations');
    
    // Get the highest ID currently in the collection
    const highestDonation = await donationsCollection.find().sort({ id: -1 }).limit(1).toArray();
    const nextId = highestDonation.length > 0 ? (highestDonation[0]?.id || 0) + 1 : 1;
    
    const newDonation: Donation = {
      ...donation,
      id: nextId,
      raisedAmount: 0,
      createdAt: new Date(),
      imageUrl: donation.imageUrl || null
    };
    
    await donationsCollection.insertOne(newDonation);
    return newDonation;
  }

  async getDonation(id: number): Promise<Donation | undefined> {
    const db = await getDb();
    const donation = await db.collection('donations').findOne({ id });
    return this.convertDocument<Donation>(donation);
  }

  async getAllDonations(): Promise<Donation[]> {
    const db = await getDb();
    const donations = await db.collection('donations').find().toArray();
    return donations.map(donation => this.convertDocument<Donation>(donation)!);
  }

  async updateDonation(id: number, donationData: Partial<Donation>): Promise<Donation | undefined> {
    const db = await getDb();
    const result = await db.collection('donations').findOneAndUpdate(
      { id },
      { $set: donationData },
      { returnDocument: 'after' }
    );
    
    return this.convertDocument<Donation>(result);
  }

  // Post operations
  async createPost(post: InsertPost): Promise<Post> {
    const db = await getDb();
    const postsCollection = db.collection('posts');
    
    // Get the highest ID currently in the collection
    const highestPost = await postsCollection.find().sort({ id: -1 }).limit(1).toArray();
    const nextId = highestPost.length > 0 ? (highestPost[0]?.id || 0) + 1 : 1;
    
    const newPost: Post = {
      ...post,
      id: nextId,
      createdAt: new Date(),
      imageUrl: post.imageUrl || null
    };
    
    await postsCollection.insertOne(newPost);
    return newPost;
  }

  async getPost(id: number): Promise<Post | undefined> {
    const db = await getDb();
    const post = await db.collection('posts').findOne({ id });
    return this.convertDocument<Post>(post);
  }

  async getAllPosts(): Promise<Post[]> {
    const db = await getDb();
    const posts = await db.collection('posts').find().toArray();
    return posts.map(post => this.convertDocument<Post>(post)!);
  }

  async getPostsByUser(userId: number): Promise<Post[]> {
    const db = await getDb();
    const posts = await db.collection('posts')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    return posts.map(post => this.convertDocument<Post>(post)!);
  }

  async updatePost(id: number, postData: Partial<Post>): Promise<Post | undefined> {
    const db = await getDb();
    const result = await db.collection('posts').findOneAndUpdate(
      { id },
      { $set: postData },
      { returnDocument: 'after' }
    );
    
    return this.convertDocument<Post>(result);
  }

  // Seed initial vet data if none exists
  async seedVets() {
    const db = await getDb();
    const vetsCount = await db.collection('vets').countDocuments();
    
    if (vetsCount === 0) {
      const vets: Vet[] = [
        {
          id: 1,
          name: "Animal Care Clinic",
          address: "123 Main St, City Center",
          phone: "555-123-4567",
          email: "info@animalcareclinic.com",
          latitude: "40.7128",
          longitude: "-74.0060",
          rating: 4,
          isOpen: true
        },
        {
          id: 2,
          name: "Pet Wellness Center",
          address: "456 Oak Ave, Westside",
          phone: "555-987-6543",
          email: "care@petwellness.com",
          latitude: "40.7282",
          longitude: "-73.9942",
          rating: 5,
          isOpen: true
        },
        {
          id: 3,
          name: "Emergency Animal Hospital",
          address: "789 Pine Rd, Northside",
          phone: "555-456-7890",
          email: "help@emergencyvet.com",
          latitude: "40.7369",
          longitude: "-74.0102",
          rating: 4,
          isOpen: true
        }
      ];
      
      await db.collection('vets').insertMany(vets);
      console.log("Initial vet data seeded");
    }
  }
}