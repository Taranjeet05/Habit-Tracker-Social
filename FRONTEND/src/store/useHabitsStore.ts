import { create } from "zustand";
import { Habit } from "../types/Habit";

interface HabitsStoreState {
  habits: Habit[]; // Cache UI list
  selectedHabitId: string | null; // For viewing and editing 1 habit
  filter: "all" | "active" | "archived"; // For filtering habits on UI
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;

  // --- Actions ---
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (habitId: string, updatedData: Partial<Habit>) => void;
  deleteHabit: (habitId: string) => void;
  selectHabit: (habitId: string | null) => void;
  setFilter: (filter: "all" | "active" | "archived") => void;
  toggleCreateModal: (open?: boolean) => void;
  toggleEditModal: (open?: boolean) => void;
}

export const useHabitStore = create<HabitsStoreState>((set) => ({
  habits: [],
  selectedHabitId: null,
  filter: "all",
  isCreateModalOpen: false,
  isEditModalOpen: false,

  setHabits: (habits) => set({ habits }),

  addHabit: (habit) =>
    set((state) => ({
      habits: [...state.habits, habit],
    })),

  updateHabit: (habitId, updatedData) =>
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit._id === habitId ? { ...habit, ...updatedData } : habit
      ),
    })),

  deleteHabit: (habitId) =>
    set((state) => ({
      habits: state.habits.filter((habit) => habit._id !== habitId),
    })),

  selectHabit: (habitId) => set({ selectedHabitId: habitId }),

  setFilter: (filter) => set({ filter }),

  toggleCreateModal: (open) =>
    set((state) => ({
      isCreateModalOpen: open ?? !state.isCreateModalOpen,
    })),

  toggleEditModal: (open) =>
    set((state) => ({
      isEditModalOpen: open ?? !state.isEditModalOpen,
    })),
}));
