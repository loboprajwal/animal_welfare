import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { AnimalReport, ForumPost } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Animal Reports API
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getAllAnimalReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve reports" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to create a report" });
    }

    try {
      const reportData: Partial<AnimalReport> = {
        ...req.body,
        userId: req.user.id,
        status: "pending",
      };
      
      const report = await storage.createAnimalReport(reportData);
      res.status(201).json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.get("/api/reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getAnimalReportById(id);
      
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve report" });
    }
  });

  // Veterinarians API
  app.get("/api/veterinarians", async (req, res) => {
    try {
      const veterinarians = await storage.getAllVeterinarians();
      res.json(veterinarians);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve veterinarians" });
    }
  });

  // Adoptions API
  app.get("/api/adoptions", async (req, res) => {
    try {
      const adoptions = await storage.getAllAdoptions();
      res.json(adoptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve adoptions" });
    }
  });

  app.get("/api/adoptions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const adoption = await storage.getAdoptionById(id);
      
      if (!adoption) {
        return res.status(404).json({ message: "Adoption listing not found" });
      }
      
      res.json(adoption);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve adoption listing" });
    }
  });

  // Donations API
  app.post("/api/donations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to make a donation" });
    }

    try {
      const donationData = {
        ...req.body,
        userId: req.user.id,
        status: "completed",
      };
      
      const donation = await storage.createDonation(donationData);
      res.status(201).json(donation);
    } catch (error) {
      res.status(500).json({ message: "Failed to process donation" });
    }
  });

  app.get("/api/donations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to view donations" });
    }

    try {
      const donations = await storage.getDonationsByUserId(req.user.id);
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve donations" });
    }
  });

  // Forum Posts API
  app.get("/api/forum/posts", async (req, res) => {
    try {
      const posts = await storage.getAllForumPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve forum posts" });
    }
  });

  app.post("/api/forum/posts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to create a post" });
    }

    try {
      const postData: Partial<ForumPost> = {
        ...req.body,
        userId: req.user.id,
        likes: 0,
        commentCount: 0,
      };
      
      const post = await storage.createForumPost(postData);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to create forum post" });
    }
  });

  app.post("/api/forum/posts/:id/comments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to comment" });
    }

    try {
      const postId = parseInt(req.params.id);
      const commentData = {
        postId,
        userId: req.user.id,
        content: req.body.content,
        likes: 0,
      };
      
      const comment = await storage.createForumComment(commentData);
      
      // Update comment count on the post
      const post = await storage.getForumPostById(postId);
      if (post) {
        await storage.updateForumPost(postId, {
          ...post,
          commentCount: post.commentCount + 1,
        });
      }
      
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
