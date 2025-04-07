import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertReportSchema, insertVetSchema, insertAdoptionSchema, insertDonationSchema, insertPostSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "up", 
      message: "Server is running with in-memory storage", 
      timestamp: new Date().toISOString() 
    });
  });

  // Animal Reports API
  app.get("/api/reports", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const reports = await storage.getReports(limit);
      res.json(reports);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.get("/api/reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getReport(id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(report);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch report" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const reportData = insertReportSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const report = await storage.createReport(reportData);
      res.status(201).json(report);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.patch("/api/reports/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const id = parseInt(req.params.id);
      const report = await storage.getReport(id);
      
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      // Only admin or report creator can update
      if (req.user.role !== "admin" && report.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to update this report" });
      }
      
      const updatedReport = await storage.updateReport(id, req.body);
      res.json(updatedReport);
    } catch (err) {
      res.status(500).json({ message: "Failed to update report" });
    }
  });

  // Veterinarians API
  app.get("/api/vets", async (req, res) => {
    try {
      const vets = await storage.getAllVets();
      res.json(vets);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch veterinarians" });
    }
  });

  app.get("/api/vets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vet = await storage.getVet(id);
      if (!vet) {
        return res.status(404).json({ message: "Veterinarian not found" });
      }
      res.json(vet);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch veterinarian" });
    }
  });

  app.post("/api/vets", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const vetData = insertVetSchema.parse(req.body);
      const vet = await storage.createVet(vetData);
      res.status(201).json(vet);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create veterinarian" });
    }
  });

  // Adoptions API
  app.get("/api/adoptions", async (req, res) => {
    try {
      let adoptions;
      if (req.query.type) {
        adoptions = await storage.getAdoptionsByType(req.query.type as string);
      } else if (req.query.status) {
        adoptions = await storage.getAdoptionsByStatus(req.query.status as string);
      } else {
        adoptions = await storage.getAllAdoptions();
      }
      res.json(adoptions);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch adoptions" });
    }
  });

  app.get("/api/adoptions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const adoption = await storage.getAdoption(id);
      if (!adoption) {
        return res.status(404).json({ message: "Adoption not found" });
      }
      res.json(adoption);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch adoption" });
    }
  });

  app.post("/api/adoptions", async (req, res) => {
    try {
      if (!req.isAuthenticated() || (req.user.role !== "admin" && req.user.role !== "ngo")) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const adoptionData = insertAdoptionSchema.parse(req.body);
      const adoption = await storage.createAdoption(adoptionData);
      res.status(201).json(adoption);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create adoption" });
    }
  });

  app.patch("/api/adoptions/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || (req.user.role !== "admin" && req.user.role !== "ngo")) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const adoption = await storage.getAdoption(id);
      
      if (!adoption) {
        return res.status(404).json({ message: "Adoption not found" });
      }
      
      const updatedAdoption = await storage.updateAdoption(id, req.body);
      res.json(updatedAdoption);
    } catch (err) {
      res.status(500).json({ message: "Failed to update adoption" });
    }
  });

  // Donations API
  app.get("/api/donations", async (req, res) => {
    try {
      const donations = await storage.getAllDonations();
      res.json(donations);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch donations" });
    }
  });

  app.get("/api/donations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const donation = await storage.getDonation(id);
      if (!donation) {
        return res.status(404).json({ message: "Donation campaign not found" });
      }
      res.json(donation);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch donation campaign" });
    }
  });

  app.post("/api/donations", async (req, res) => {
    try {
      if (!req.isAuthenticated() || (req.user.role !== "admin" && req.user.role !== "ngo")) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const donationData = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(donationData);
      res.status(201).json(donation);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create donation campaign" });
    }
  });

  app.patch("/api/donations/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || (req.user.role !== "admin" && req.user.role !== "ngo")) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const donation = await storage.getDonation(id);
      
      if (!donation) {
        return res.status(404).json({ message: "Donation campaign not found" });
      }
      
      const updatedDonation = await storage.updateDonation(id, req.body);
      res.json(updatedDonation);
    } catch (err) {
      res.status(500).json({ message: "Failed to update donation campaign" });
    }
  });

  // Donation transaction endpoint (mock)
  app.post("/api/donations/:id/contribute", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const donation = await storage.getDonation(id);
      
      if (!donation) {
        return res.status(404).json({ message: "Donation campaign not found" });
      }
      
      const amount = parseInt(req.body.amount);
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Invalid donation amount" });
      }
      
      // Update raised amount
      const updatedDonation = await storage.updateDonation(id, {
        raisedAmount: donation.raisedAmount + amount
      });
      
      res.json({ 
        success: true, 
        message: "Donation successful",
        donation: updatedDonation
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to process donation" });
    }
  });

  // Community Forum API
  app.get("/api/posts", async (req, res) => {
    try {
      let posts;
      if (req.query.userId) {
        const userId = parseInt(req.query.userId as string);
        posts = await storage.getPostsByUser(userId);
      } else {
        posts = await storage.getAllPosts();
      }
      res.json(posts);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getPost(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const postData = insertPostSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.patch("/api/posts/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const id = parseInt(req.params.id);
      const post = await storage.getPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Only admin or post creator can update
      if (req.user.role !== "admin" && post.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to update this post" });
      }
      
      const updatedPost = await storage.updatePost(id, req.body);
      res.json(updatedPost);
    } catch (err) {
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
