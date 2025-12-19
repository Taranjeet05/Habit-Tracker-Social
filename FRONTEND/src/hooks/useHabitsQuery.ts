import { getAllHabitsExceptToday, getTodayHabits } from "../api/habitsApi";
import { useQuery } from "@tanstack/react-query";

export const useTodayHabitsQuery = () => {
  return useQuery({
    queryKey: ["habits", "today"],
    queryFn: getTodayHabits,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAllHabitsQuery = () => {
  return useQuery({
    queryKey: ["habits", "all"],
    queryFn: getAllHabitsExceptToday,
    staleTime: 5 * 60 * 1000,
  });
};
