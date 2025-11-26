import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTodoSchema, insertScheduleItemSchema, insertAssignmentSchema, insertQuickTaskSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Seed data for new users
      await storage.seedUserData(userId);
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Todo routes (protected)
  app.get("/api/todos", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const todos = await storage.getTodos(userId);
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch todos" });
    }
  });

  app.post("/api/todos", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = insertTodoSchema.safeParse({ ...req.body, userId });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      const todo = await storage.createTodo(parsed.data);
      res.status(201).json(todo);
    } catch (error) {
      res.status(500).json({ error: "Failed to create todo" });
    }
  });

  app.patch("/api/todos/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const updates = req.body;
      const todo = await storage.updateTodo(id, userId, updates);
      if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.json(todo);
    } catch (error) {
      res.status(500).json({ error: "Failed to update todo" });
    }
  });

  app.delete("/api/todos/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const deleted = await storage.deleteTodo(id, userId);
      if (!deleted) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete todo" });
    }
  });

  // Schedule routes (protected)
  app.get("/api/schedule", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const items = await storage.getScheduleItems(userId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schedule" });
    }
  });

  app.post("/api/schedule", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = insertScheduleItemSchema.safeParse({ ...req.body, userId });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      const item = await storage.createScheduleItem(parsed.data);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to create schedule item" });
    }
  });

  app.patch("/api/schedule/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const updates = req.body;
      const item = await storage.updateScheduleItem(id, userId, updates);
      if (!item) {
        return res.status(404).json({ error: "Schedule item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to update schedule item" });
    }
  });

  app.delete("/api/schedule/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const deleted = await storage.deleteScheduleItem(id, userId);
      if (!deleted) {
        return res.status(404).json({ error: "Schedule item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete schedule item" });
    }
  });

  // Assignment routes (protected)
  app.get("/api/assignments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const assignments = await storage.getAssignments(userId);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assignments" });
    }
  });

  app.post("/api/assignments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = insertAssignmentSchema.safeParse({ ...req.body, userId });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      const assignment = await storage.createAssignment(parsed.data);
      res.status(201).json(assignment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create assignment" });
    }
  });

  app.patch("/api/assignments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const updates = req.body;
      const assignment = await storage.updateAssignment(id, userId, updates);
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update assignment" });
    }
  });

  app.delete("/api/assignments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const deleted = await storage.deleteAssignment(id, userId);
      if (!deleted) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete assignment" });
    }
  });

  // Quick task routes (protected)
  app.get("/api/quick-tasks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tasks = await storage.getQuickTasks(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quick tasks" });
    }
  });

  app.post("/api/quick-tasks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = insertQuickTaskSchema.safeParse({ ...req.body, userId });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      const task = await storage.createQuickTask(parsed.data);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to create quick task" });
    }
  });

  app.patch("/api/quick-tasks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const updates = req.body;
      const task = await storage.updateQuickTask(id, userId, updates);
      if (!task) {
        return res.status(404).json({ error: "Quick task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to update quick task" });
    }
  });

  app.delete("/api/quick-tasks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const deleted = await storage.deleteQuickTask(id, userId);
      if (!deleted) {
        return res.status(404).json({ error: "Quick task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete quick task" });
    }
  });

  return httpServer;
}
