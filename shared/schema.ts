import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("user"), // user, ngo, admin
  avatarUrl: text("avatar_url"),
  phoneNumber: text("phone_number"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    password: true,
    email: true,
    fullName: true,
    role: true,
    phoneNumber: true,
    address: true,
  })
  .refine((data) => data.password.length >= 6, {
    message: "Password must be at least 6 characters long",
    path: ["password"],
  });

// Animal report model
export const animalReports = pgTable("animal_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // User who reported
  animalType: text("animal_type").notNull(), // Dog, Cat, Bird, Wildlife, Other
  emergencyLevel: text("emergency_level").notNull(), // Critical, Urgent, Moderate, Low
  description: text("description").notNull(),
  location: text("location").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  status: text("status").notNull().default("pending"), // pending, in_progress, resolved
  imageUrls: text("image_urls").array(),
  contactNumber: text("contact_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAnimalReportSchema = createInsertSchema(animalReports)
  .pick({
    userId: true,
    animalType: true,
    emergencyLevel: true,
    description: true,
    location: true,
    latitude: true,
    longitude: true,
    imageUrls: true,
    contactNumber: true,
  });

// Veterinarian model
export const veterinarians = pgTable("veterinarians", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phoneNumber: text("phone_number").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  openingHours: text("opening_hours"),
  services: text("services").array(),
  isEmergency: boolean("is_emergency").default(false),
  distance: text("distance"), // not stored, calculated on the fly
});

export const insertVeterinarianSchema = createInsertSchema(veterinarians)
  .pick({
    name: true,
    address: true,
    phoneNumber: true,
    latitude: true,
    longitude: true,
    openingHours: true,
    services: true,
    isEmergency: true,
  });

// Adoption model
export const adoptions = pgTable("adoptions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // Dog, Cat, Bird, etc.
  breed: text("breed"),
  age: text("age").notNull(),
  size: text("size").notNull(), // Small, Medium, Large
  gender: text("gender").notNull(), // Male, Female
  description: text("description").notNull(),
  imageUrls: text("image_urls").array(),
  shelter: text("shelter").notNull(),
  status: text("status").notNull().default("available"), // available, pending, adopted
  distance: text("distance"), // not stored, calculated on the fly
});

export const insertAdoptionSchema = createInsertSchema(adoptions)
  .pick({
    name: true,
    type: true,
    breed: true,
    age: true,
    size: true,
    gender: true,
    description: true,
    imageUrls: true,
    shelter: true,
    status: true,
  });

// Donation model
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: text("amount").notNull(),
  donorName: text("donor_name").notNull(),
  donorEmail: text("donor_email").notNull(),
  isRecurring: boolean("is_recurring").default(false),
  status: text("status").notNull().default("completed"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDonationSchema = createInsertSchema(donations)
  .pick({
    userId: true,
    amount: true,
    donorName: true,
    donorEmail: true,
    isRecurring: true,
  });

// Forum post model
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // Discussion, Question, Success Story
  likes: integer("likes").default(0),
  commentCount: integer("comment_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertForumPostSchema = createInsertSchema(forumPosts)
  .pick({
    userId: true,
    title: true,
    content: true,
    category: true,
  });

// Forum comment model
export const forumComments = pgTable("forum_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertForumCommentSchema = createInsertSchema(forumComments)
  .pick({
    postId: true,
    userId: true,
    content: true,
  });

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type AnimalReport = typeof animalReports.$inferSelect;
export type InsertAnimalReport = z.infer<typeof insertAnimalReportSchema>;

export type Veterinarian = typeof veterinarians.$inferSelect;
export type InsertVeterinarian = z.infer<typeof insertVeterinarianSchema>;

export type Adoption = typeof adoptions.$inferSelect;
export type InsertAdoption = z.infer<typeof insertAdoptionSchema>;

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;

export type ForumComment = typeof forumComments.$inferSelect;
export type InsertForumComment = z.infer<typeof insertForumCommentSchema>;
