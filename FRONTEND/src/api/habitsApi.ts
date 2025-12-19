import API from "./axiosInstance";
import { ApiResponse } from "./axiosInstance";
import { IHabit } from "../../../BACKEND/src/types/index";

export interface Habit {
  _id: string;
  title: string;
  description: string;
  color: "Green" | "Blue" | "Purple" | "Teal" | "Orange" | "Red" | "Yellow";
  user: string;
  frequency: "daily" | "weekly" | "monthly" | "custom";
  customFrequency?: {
    daysOfWeek?: number[];
    daysOfMonth?: number[];
    times?: number;
  };
  reminders: {
    enabled: boolean;
    timesPerDay?: number;
    times?: string[];
  };
  startDate: string;
  archived: boolean;
  visibility: "private" | "friends" | "public";
}

export interface HabitResponse {
  message: string;
  data?: IHabit | IHabit[];
}

export const createHabit = async (
  habitData: Habit
): Promise<ApiResponse<HabitResponse>> => {
  const { data } = await API.post<ApiResponse<HabitResponse>>(
    "/habits/",
    habitData
  );
  return data;
};

export const getHabitsByUser = async (): Promise<
  ApiResponse<HabitResponse>
> => {
  const { data } = await API.get<ApiResponse<HabitResponse>>("/habits/");
  return data;
};

export const getHabitById = async (
  id: string
): Promise<ApiResponse<HabitResponse>> => {
  const { data } = await API.get<ApiResponse<HabitResponse>>(`/habits/${id}`);
  return data;
};

export const updateHabit = async (
  id: string,
  updatedData: Habit
): Promise<ApiResponse<HabitResponse>> => {
  const { data } = await API.put<ApiResponse<HabitResponse>>(
    `/habits/${id}`,
    updatedData
  );
  return data;
};

export const deleteHabit = async (
  id: string
): Promise<ApiResponse<HabitResponse>> => {
  const { data } = await API.delete<ApiResponse<HabitResponse>>(
    `/habits/${id}`
  );
  return data;
};

// GET today habits
export const getTodayHabits = async (): Promise<Habit[]> => {
  const { data } = await API.get<ApiResponse<Habit[]>>("/habits/today");
  return data.data || [];
};

// GET all habits except today
export const getAllHabitsExceptToday = async (): Promise<Habit[]> => {
  const { data } = await API.get<ApiResponse<Habit[]>>("/habits/all");
  return data.data || [];
};
