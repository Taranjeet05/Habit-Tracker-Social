// src/config/navigation.ts
import { Home, Users, Plus, Bell, User, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type IconType = LucideIcon;

export type NavItem = {
  title: string;
  url: string;
  icon: IconType;
};

export const navigationItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Create Habit", url: "/habits/create", icon: Plus },
  { title: "Friends", url: "/friends", icon: Users },
  { title: "Notifications", url: "/notifications", icon: Bell },
];

export const accountItems: NavItem[] = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];
