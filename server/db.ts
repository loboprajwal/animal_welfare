import { MongoClient, ServerApiVersion } from 'mongodb';
import { User, Report, Vet, Adoption } from '@shared/schema';
import { sessionStore } from './mem-storage';

// Export the session store from mem-storage
export { sessionStore };

// Singleton pattern for MongoDB connection
let client: MongoClient | null = null;

// Connection URI - Using environment variable for connection string
// For Replit, we'll use a local MongoDB connection
const mongoDbName = "animalsos";
// Use MongoDB Atlas URI if provided, otherwise fall back to local MongoDB on Replit
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/animalsos";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export async function connectToMongoDB() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    try {
      // Connect the client to the server
      await client.connect();
      console.log("Connected to MongoDB");
      return client.db();
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  } else {
    return client.db();
  }
}

export async function getDb() {
  if (!client) {
    return connectToMongoDB();
  }
  return client.db();
}

// Function to close connection when needed
export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    console.log("MongoDB connection closed");
  }
}