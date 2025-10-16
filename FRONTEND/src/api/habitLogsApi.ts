import API from "./axiosInstance";
import { ApiResponse } from "./axiosInstance";
import { IHabitLog } from "../../../BACKEND/src/types/index";

export interface HabitLogs {
  habitId: string;
  date: string;
  completed?: boolean;
  notes?: string;
}

export interface HabitLogsResponse {
  message: string;
  data: IHabitLog;
}

export interface HabitLogsByHabitIdResponse {
  message: string;
  habitLogs: IHabitLog[];
  totalCount: number;
}

export interface WeeklyGraphItem {
  date: string;
  count: number;
  completed: boolean;
}

export interface WeeklyGraphDataResponse {
  message: string;
  weeklyGraphData: WeeklyGraphItem[];
}

export interface MonthlyGraphItem {
  year: number;
  month: number;
  monthName: string;
  completionRate: number;
}

export interface MonthlyGraphDataResponse {
  message: string;
  timeRange: {
    start: string;
    end: string;
  };
  habitTarget: number;
  data: MonthlyGraphItem[];
}

export interface DeleteHabitLogByIdResponse {
  message: string;
  deletedCount: number;
}

export interface DeleteAllHabitLogsResponse {
  message: string;
}

export const createHabitLogs = async (
  habitLogsData: HabitLogs
): Promise<ApiResponse<HabitLogsResponse>> => {
  const { data } = await API.post<ApiResponse<HabitLogsResponse>>(
    "/habit-logs/",
    habitLogsData
  );
  return data;
};

export const getHabitLogsByHabitId = async (
  habitId: string
): Promise<ApiResponse<HabitLogsByHabitIdResponse>> => {
  const { data } = await API.get<ApiResponse<HabitLogsByHabitIdResponse>>(
    `/habit-logs/${habitId}`
  );
  return data;
};

export const getWeeklyGraphData = async (
  habitId: string
): Promise<ApiResponse<WeeklyGraphDataResponse>> => {
  const { data } = await API.get<ApiResponse<WeeklyGraphDataResponse>>(
    `/habit-logs/graph/weekly/${habitId}`
  );
  return data;
};

export const getMonthlyGraphData = async (
  habitId: string
): Promise<ApiResponse<MonthlyGraphDataResponse>> => {
  const { data } = await API.get<ApiResponse<MonthlyGraphDataResponse>>(
    `/habit-logs/graph/monthly/${habitId}`
  );
  return data;
};

export const deleteHabitLogById = async (
  habitLogId: string
): Promise<ApiResponse<DeleteHabitLogByIdResponse>> => {
  const { data } = await API.delete<ApiResponse<DeleteHabitLogByIdResponse>>(
    `/habit-logs/single/${habitLogId}`
  );
  return data;
};

export const deleteAllHabitLogs = async (
  habitLogId: string
): Promise<ApiResponse<DeleteAllHabitLogsResponse>> => {
  const { data } = await API.delete<ApiResponse<DeleteAllHabitLogsResponse>>(
    `/habit-logs/all/${habitLogId}`
  );
  return data;
};
