import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertDonorSchema,
  insertBloodRequestSchema,
  insertDonationSchema,
  insertBloodInventorySchema,
  insertUserSchema,
  loginSchema,
} from "@shared/schema";
import { z } from "zod";
import {
  hashPassword,
  verifyPassword,
  generateToken,
  authenticate,
  authorize,
  type AuthRequest,
} from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize blood inventory on startup
  await storage.initializeBloodInventory();

  // ===== AUTH ROUTES =====

  // Register new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);

      // Check if email already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await hashPassword(validatedData.password);

      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      // Find user
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({ error: "Account is inactive" });
      }

      // Verify password
      const isValidPassword = await verifyPassword(
        validatedData.password,
        user.password
      );
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  });

  // Get current user
  app.get("/api/auth/me", authenticate, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUserById(req.user!.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== DONOR ROUTES =====

  // Get all donors
  app.get("/api/donors", async (req, res) => {
    try {
      const donors = await storage.getAllDonors();
      res.json(donors);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get matching donors for a request
  app.get("/api/donors/matching/:requestId", async (req, res) => {
    try {
      const request = await storage.getBloodRequest(req.params.requestId);
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }

      const donors = await storage.getMatchingDonors(
        request.bloodGroup,
        request.location
      );
      res.json(donors);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new donor
  app.post("/api/donors", async (req, res) => {
    try {
      const validatedData = insertDonorSchema.parse(req.body);

      // Check if email already exists
      const existing = await storage.getDonorByEmail(validatedData.email);
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const donor = await storage.createDonor(validatedData);
      res.status(201).json(donor);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Update donor approval status
  app.patch("/api/donors/:id/approval", async (req, res) => {
    try {
      const { approvalStatus } = req.body;
      if (!["approved", "rejected"].includes(approvalStatus)) {
        return res.status(400).json({ error: "Invalid approval status" });
      }

      const donor = await storage.updateDonorApproval(
        req.params.id,
        approvalStatus
      );
      res.json(donor);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== BLOOD REQUEST ROUTES =====

  // Get all blood requests
  app.get("/api/blood-requests", async (req, res) => {
    try {
      const requests = await storage.getAllBloodRequests();
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get active blood requests (for public view)
  app.get("/api/blood-requests/active", async (req, res) => {
    try {
      const requests = await storage.getActiveBloodRequests();
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new blood request
  app.post("/api/blood-requests", async (req, res) => {
    try {
      const validatedData = insertBloodRequestSchema.parse(req.body);
      const request = await storage.createBloodRequest(validatedData);
      res.status(201).json(request);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Update request approval status
  app.patch("/api/blood-requests/:id/approval", async (req, res) => {
    try {
      const { approvalStatus } = req.body;
      if (!["approved", "rejected"].includes(approvalStatus)) {
        return res.status(400).json({ error: "Invalid approval status" });
      }

      const request = await storage.updateRequestApproval(
        req.params.id,
        approvalStatus
      );
      res.json(request);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update request status
  app.patch("/api/blood-requests/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (
        !["pending", "in_progress", "completed", "cancelled"].includes(status)
      ) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const request = await storage.updateRequestStatus(req.params.id, status);
      res.json(request);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== DONATION ROUTES =====

  // Get all donations with details
  app.get("/api/donations", async (req, res) => {
    try {
      const donations = await storage.getAllDonations();
      res.json(donations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new donation (case closure)
  app.post("/api/donations", async (req, res) => {
    try {
      const validatedData = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(validatedData);
      res.status(201).json(donation);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // ===== BLOOD INVENTORY ROUTES =====

  // Get blood inventory
  app.get("/api/blood-inventory", async (req, res) => {
    try {
      const inventory = await storage.getBloodInventory();
      res.json(inventory);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update blood inventory
  app.patch("/api/blood-inventory/:bloodGroup", async (req, res) => {
    try {
      const { unitsAvailable, status } = req.body;

      const data: any = {};
      if (typeof unitsAvailable === "number") {
        data.unitsAvailable = unitsAvailable;
      }
      if (status && ["available", "low", "urgent"].includes(status)) {
        data.status = status;
      }

      const inventory = await storage.updateBloodInventory(
        req.params.bloodGroup,
        data
      );
      res.json(inventory);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== STATS ROUTES =====

  // Get admin stats
  app.get("/api/stats/admin", async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get public stats
  app.get("/api/stats/public", async (req, res) => {
    try {
      const stats = await storage.getPublicStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
