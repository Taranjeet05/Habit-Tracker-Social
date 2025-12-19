import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { PlusCircle } from "lucide-react";

import HabitCard from "../components/Habits/Habit-Card/HabitCard";
import {
  useAllHabitsQuery,
  useTodayHabitsQuery,
} from "../hooks/useHabitsQuery";

const DashBoard = () => {
  const navigate = useNavigate();

  const {
    data: allHabits = [],
    isLoading: loadingAll,
    error: errorAll,
  } = useAllHabitsQuery();

  const {
    data: todayHabits = [],
    isLoading: loadingToday,
    error: errorToday,
  } = useTodayHabitsQuery();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Habits</h1>
          <p className="text-muted-foreground">
            Track and maintain your daily habits
          </p>
        </div>
        <Button onClick={() => navigate("/habits/create")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Habit
        </Button>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="all">All Habits</TabsTrigger>
        </TabsList>

        {/* TODAY */}

        <TabsContent value="today" className="mt-4">
          {loadingToday && <p>Loading Today’s Habits...</p>}
          {errorToday && <p className="text-red-500">Failed to load habits.</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {todayHabits.map((habit) => (
              <HabitCard key={habit._id} habit={habit} streak={10} />
            ))}
          </div>
        </TabsContent>

        {/* ALL */}

        <TabsContent value="all" className="mt-4">
          {loadingAll && <p>Loading all habits...</p>}
          {errorAll && <p className="text-red-500">Failed to load habits.</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allHabits.map((habit) => (
              <HabitCard key={habit._id} habit={habit} streak={10} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashBoard;
