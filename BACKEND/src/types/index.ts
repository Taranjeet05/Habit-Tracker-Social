import { Document, Types } from "mongoose";

// Base interface for MongoDB document
export interface MongoDBDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

// User
export interface IUser extends MongoDBDocument {
  userName: string;
  email: string;
  password: string;
  profileImage?: string;
  friends: Types.ObjectId[];
  lastLogin: Date;
  emailNotification: boolean;
  theme: "light" | "dark" | "system";
  friendRequestNotifications: boolean;
  friendActivityNotifications: boolean;
}

// Habit
export interface IHabit extends MongoDBDocument {
  title: string;
  description?: string;
  color: "green" | "blue" | "purple" | "teal" | "orange" | "red" | "yellow";
  user: Types.ObjectId;

  frequency: "daily" | "weekly" | "monthly" | "custom";

  customFrequency?: {
    daysOfWeek?: number[];    // 0 (Sun) to 6 (Sat)
    daysOfMonth?: number[];   // 1 to 31
    times?: number;           // Times per selected period
  };

  reminders: {
    enabled: boolean;
    timesPerDay?: number;     // Number of reminders per day (1-10)
    times?: string[];         // ["08:00", "14:00"]
  };

  startDate: Date;
  archived: boolean;
  visibility: "private" | "friends" | "public";
}

// HabitLog
export interface IHabitLog extends MongoDBDocument {
  habit: Types.ObjectId;
  user: Types.ObjectId;
  date: Date;
  completed: boolean;
  notes?: string;
}

// FriendRequest
export interface IFriendRequest extends MongoDBDocument {
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
}

// Notification
export interface INotification extends MongoDBDocument {
  recipient: Types.ObjectId;
  type:
    | "friend_request"
    | "friend_accepted"
    | "habit_reminder"
    | "streak_milestone"
    | "system";
  message: string;
  relatedTo?: {
    model?: "User" | "Habit" | "FriendRequest";
    id?: Types.ObjectId;
  };
  read: boolean;
}

// Type for Populated Documents
export type Populated<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: Exclude<T[P], Types.ObjectId[] | Types.ObjectId>;
};
