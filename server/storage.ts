import { 
  users, todos, scheduleItems, assignments, quickTasks,
  type User, type UpsertUser,
  type Todo, type InsertTodo,
  type ScheduleItem, type InsertScheduleItem,
  type Assignment, type InsertAssignment,
  type QuickTask, type InsertQuickTask
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Todo operations (user-scoped)
  getTodos(userId: string): Promise<Todo[]>;
  getTodo(id: string, userId: string): Promise<Todo | undefined>;
  createTodo(todo: InsertTodo): Promise<Todo>;
  updateTodo(id: string, userId: string, updates: Partial<InsertTodo>): Promise<Todo | undefined>;
  deleteTodo(id: string, userId: string): Promise<boolean>;
  
  // Schedule operations (user-scoped)
  getScheduleItems(userId: string): Promise<ScheduleItem[]>;
  getScheduleItem(id: string, userId: string): Promise<ScheduleItem | undefined>;
  createScheduleItem(item: InsertScheduleItem): Promise<ScheduleItem>;
  updateScheduleItem(id: string, userId: string, updates: Partial<InsertScheduleItem>): Promise<ScheduleItem | undefined>;
  deleteScheduleItem(id: string, userId: string): Promise<boolean>;
  
  // Assignment operations (user-scoped)
  getAssignments(userId: string): Promise<Assignment[]>;
  getAssignment(id: string, userId: string): Promise<Assignment | undefined>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: string, userId: string, updates: Partial<InsertAssignment>): Promise<Assignment | undefined>;
  deleteAssignment(id: string, userId: string): Promise<boolean>;
  
  // Quick task operations (user-scoped)
  getQuickTasks(userId: string): Promise<QuickTask[]>;
  getQuickTask(id: string, userId: string): Promise<QuickTask | undefined>;
  createQuickTask(task: InsertQuickTask): Promise<QuickTask>;
  updateQuickTask(id: string, userId: string, updates: Partial<InsertQuickTask>): Promise<QuickTask | undefined>;
  deleteQuickTask(id: string, userId: string): Promise<boolean>;
  
  // Seed data for new users
  seedUserData(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Todo operations
  async getTodos(userId: string): Promise<Todo[]> {
    return db.select().from(todos).where(eq(todos.userId, userId));
  }

  async getTodo(id: string, userId: string): Promise<Todo | undefined> {
    const [todo] = await db.select().from(todos).where(and(eq(todos.id, id), eq(todos.userId, userId)));
    return todo;
  }

  async createTodo(todo: InsertTodo): Promise<Todo> {
    const [created] = await db.insert(todos).values(todo).returning();
    return created;
  }

  async updateTodo(id: string, userId: string, updates: Partial<InsertTodo>): Promise<Todo | undefined> {
    const [updated] = await db.update(todos).set(updates).where(and(eq(todos.id, id), eq(todos.userId, userId))).returning();
    return updated;
  }

  async deleteTodo(id: string, userId: string): Promise<boolean> {
    const result = await db.delete(todos).where(and(eq(todos.id, id), eq(todos.userId, userId))).returning();
    return result.length > 0;
  }

  // Schedule operations
  async getScheduleItems(userId: string): Promise<ScheduleItem[]> {
    return db.select().from(scheduleItems).where(eq(scheduleItems.userId, userId));
  }

  async getScheduleItem(id: string, userId: string): Promise<ScheduleItem | undefined> {
    const [item] = await db.select().from(scheduleItems).where(and(eq(scheduleItems.id, id), eq(scheduleItems.userId, userId)));
    return item;
  }

  async createScheduleItem(item: InsertScheduleItem): Promise<ScheduleItem> {
    const [created] = await db.insert(scheduleItems).values(item).returning();
    return created;
  }

  async updateScheduleItem(id: string, userId: string, updates: Partial<InsertScheduleItem>): Promise<ScheduleItem | undefined> {
    const [updated] = await db.update(scheduleItems).set(updates).where(and(eq(scheduleItems.id, id), eq(scheduleItems.userId, userId))).returning();
    return updated;
  }

  async deleteScheduleItem(id: string, userId: string): Promise<boolean> {
    const result = await db.delete(scheduleItems).where(and(eq(scheduleItems.id, id), eq(scheduleItems.userId, userId))).returning();
    return result.length > 0;
  }

  // Assignment operations
  async getAssignments(userId: string): Promise<Assignment[]> {
    return db.select().from(assignments).where(eq(assignments.userId, userId));
  }

  async getAssignment(id: string, userId: string): Promise<Assignment | undefined> {
    const [item] = await db.select().from(assignments).where(and(eq(assignments.id, id), eq(assignments.userId, userId)));
    return item;
  }

  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const [created] = await db.insert(assignments).values(assignment).returning();
    return created;
  }

  async updateAssignment(id: string, userId: string, updates: Partial<InsertAssignment>): Promise<Assignment | undefined> {
    const [updated] = await db.update(assignments).set(updates).where(and(eq(assignments.id, id), eq(assignments.userId, userId))).returning();
    return updated;
  }

  async deleteAssignment(id: string, userId: string): Promise<boolean> {
    const result = await db.delete(assignments).where(and(eq(assignments.id, id), eq(assignments.userId, userId))).returning();
    return result.length > 0;
  }

  // Quick task operations
  async getQuickTasks(userId: string): Promise<QuickTask[]> {
    return db.select().from(quickTasks).where(eq(quickTasks.userId, userId));
  }

  async getQuickTask(id: string, userId: string): Promise<QuickTask | undefined> {
    const [task] = await db.select().from(quickTasks).where(and(eq(quickTasks.id, id), eq(quickTasks.userId, userId)));
    return task;
  }

  async createQuickTask(task: InsertQuickTask): Promise<QuickTask> {
    const [created] = await db.insert(quickTasks).values(task).returning();
    return created;
  }

  async updateQuickTask(id: string, userId: string, updates: Partial<InsertQuickTask>): Promise<QuickTask | undefined> {
    const [updated] = await db.update(quickTasks).set(updates).where(and(eq(quickTasks.id, id), eq(quickTasks.userId, userId))).returning();
    return updated;
  }

  async deleteQuickTask(id: string, userId: string): Promise<boolean> {
    const result = await db.delete(quickTasks).where(and(eq(quickTasks.id, id), eq(quickTasks.userId, userId))).returning();
    return result.length > 0;
  }

  // Seed default data for new users
  async seedUserData(userId: string): Promise<void> {
    const existingTodos = await this.getTodos(userId);
    if (existingTodos.length > 0) return;

    const defaultTodos: Omit<InsertTodo, "userId">[] = [
      { title: "Wake up at 6:30AM", completed: false, dayOfWeek: 1, category: "daily", priority: "high" },
      { title: "Morning Routine", completed: false, dayOfWeek: 1, category: "daily", priority: "medium" },
      { title: "Pack Bag", completed: true, dayOfWeek: 1, category: "daily", priority: "medium" },
      { title: "Check Planner", completed: false, dayOfWeek: 1, category: "daily", priority: "medium" },
      { title: "Attend Classes", completed: false, dayOfWeek: 1, category: "daily", priority: "high" },
      { title: "Take Notes", completed: false, dayOfWeek: 1, category: "daily", priority: "medium" },
      { title: "Lunch", completed: false, dayOfWeek: 1, category: "daily", priority: "low" },
      { title: "Homework", completed: false, dayOfWeek: 1, category: "daily", priority: "high" },
      { title: "Complete Math Worksheets", completed: false, dayOfWeek: 1, category: "monthly", priority: "high" },
      { title: "Study for Midterms", completed: false, dayOfWeek: 1, category: "monthly", priority: "high" },
      { title: "Work on English Essay", completed: false, dayOfWeek: 1, category: "monthly", priority: "medium" },
    ];

    for (const todo of defaultTodos) {
      await this.createTodo({ ...todo, userId });
    }

    const defaultSchedule: Omit<InsertScheduleItem, "userId">[] = [
      { title: "Science", time: "7:30", dayOfWeek: 1, category: "science", completed: false },
      { title: "Math", time: "9:55", dayOfWeek: 1, category: "math", completed: true },
      { title: "Break", time: "11:00", dayOfWeek: 1, category: "break", completed: true },
      { title: "Social", time: "11:55", dayOfWeek: 1, category: "social", completed: false },
      { title: "Music", time: "12:50", dayOfWeek: 1, category: "music", completed: false },
      { title: "Free time", time: "7:30", dayOfWeek: 2, category: "free", completed: false },
      { title: "PE", time: "9:55", dayOfWeek: 2, category: "pe", completed: false },
      { title: "Break", time: "11:00", dayOfWeek: 2, category: "break", completed: false },
      { title: "Biology", time: "11:55", dayOfWeek: 2, category: "biology", completed: false },
      { title: "English", time: "12:50", dayOfWeek: 2, category: "english", completed: false },
      { title: "Biology", time: "7:30", dayOfWeek: 3, category: "biology", completed: false },
      { title: "Social", time: "9:55", dayOfWeek: 3, category: "social", completed: false },
      { title: "Break", time: "11:00", dayOfWeek: 3, category: "break", completed: false },
      { title: "PE", time: "11:55", dayOfWeek: 3, category: "pe", completed: false },
      { title: "Math", time: "12:50", dayOfWeek: 3, category: "math", completed: false },
      { title: "Science", time: "7:30", dayOfWeek: 4, category: "science", completed: false },
      { title: "Math", time: "9:55", dayOfWeek: 4, category: "math", completed: false },
      { title: "Break", time: "11:00", dayOfWeek: 4, category: "break", completed: false },
      { title: "Social", time: "11:55", dayOfWeek: 4, category: "social", completed: false },
      { title: "Biology", time: "12:50", dayOfWeek: 4, category: "biology", completed: false },
    ];

    for (const item of defaultSchedule) {
      await this.createScheduleItem({ ...item, userId });
    }

    const today = new Date();
    const getDateString = (daysFromNow: number) => {
      const date = new Date(today);
      date.setDate(date.getDate() + daysFromNow);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const defaultAssignments: Omit<InsertAssignment, "userId">[] = [
      { title: "Math Homework", dueDate: getDateString(5), completed: false, category: "math" },
      { title: "Science Project", dueDate: getDateString(10), completed: false, category: "science" },
      { title: "English Essay", dueDate: getDateString(3), completed: false, category: "english" },
    ];

    for (const assignment of defaultAssignments) {
      await this.createAssignment({ ...assignment, userId });
    }
  }
}

export const storage = new DatabaseStorage();
