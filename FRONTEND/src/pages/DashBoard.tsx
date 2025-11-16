import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { PlusCircle } from "lucide-react";

const DashBoard = () => {
  const navigate = useNavigate();

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
        <TabsContent value="today" className="mt-4">
          <p>Today's collection of Habit goes here </p>
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          <p>All Habits collection Goes here</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashBoard;
