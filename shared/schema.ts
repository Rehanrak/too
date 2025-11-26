import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Task categories for color coding
export type TaskCategory = "science" | "math" | "english" | "break" | "social" | "biology" | "pe" | "music" | "free" | "other";

// To-do items for daily/weekly lists
export const todos = pgTable("todos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  dayOfWeek: integer("day_of_week").notNull(),
  category: text("category").notNull().default("other"),
  priority: text("priority").notNull().default("medium"),
});

export const insertTodoSchema = createInsertSchema(todos).omit({ id: true });
export type InsertTodo = z.infer<typeof insertTodoSchema>;
export type Todo = typeof todos.$inferSelect;

// Schedule items (time-blocked activities)
export const scheduleItems = pgTable("schedule_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  time: text("time").notNull(),
  dayOfWeek: integer("day_of_week").notNull(),
  category: text("category").notNull().default("other"),
  completed: boolean("completed").notNull().default(false),
});

export const insertScheduleItemSchema = createInsertSchema(scheduleItems).omit({ id: true });
export type InsertScheduleItem = z.infer<typeof insertScheduleItemSchema>;
export type ScheduleItem = typeof scheduleItems.$inferSelect;

// Assignments with due dates
export const assignments = pgTable("assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  dueDate: text("due_date").notNull(),
  completed: boolean("completed").notNull().default(false),
  category: text("category").notNull().default("other"),
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({ id: true });
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Assignment = typeof assignments.$inferSelect;

// Quick tasks (unscheduled inbox items)
export const quickTasks = pgTable("quick_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  priority: text("priority").notNull().default("medium"),
});

export const insertQuickTaskSchema = createInsertSchema(quickTasks).omit({ id: true });
export type InsertQuickTask = z.infer<typeof insertQuickTaskSchema>;
export type QuickTask = typeof quickTasks.$inferSelect;
