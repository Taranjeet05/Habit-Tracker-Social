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
}

// Habit
export interface IHabit extends MongoDBDocument {
  title: string;
  description?: string;
  color: "red" | "yellow" | "green";
  user: Types.ObjectId;
  frequency: "daily" | "weekly" | "monthly" | "custom";
  customFrequency?: {
    days: number[];
    times: number;
  };
  reminders: {
    enabled: boolean;
    time: string;
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
