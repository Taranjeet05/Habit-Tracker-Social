import { Card, CardContent, CardFooter } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Clock, Bell, Flame, CheckCircle, Circle } from "lucide-react";
import { Habit } from "../../../api/habitsApi";
import { cn } from "../../../lib/utils";
import { useNavigate } from "react-router-dom";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";

interface HabitCardProps {
  habit: Habit;
  streak: number;
}

const HabitCard = ({ habit, streak }: HabitCardProps) => {
  const navigate = useNavigate();
  const isCompleted = false; // hard coded value for testing

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-md border-l-4",
        habit.color && `border-l-habit-${habit.color.toLowerCase()}`
      )}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{habit.title}</h3>

            {habit.description && (
              <p className="text-muted-foreground text-sm">
                {habit.description}
              </p>
            )}

            {/* Frequency + Reminders */}
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge
                variant="outline"
                className="flex items-center gap-1 text-xs"
              >
                <Clock className="h-3 w-3" />
                {formatFrequency(habit)}
              </Badge>

              {habit.reminders?.enabled && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 text-xs"
                      >
                        <Bell className="h-3 w-3" />
                        {habit.reminders.timesPerDay}x/day
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>
                        At:{" "}
                        {formatReminderTimes(habit.reminders?.times ?? []).join(
                          ", "
                        )}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          {/* Completion Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full w-10 h-10",
              isCompleted ? "bg-green-500 text-white" : "bg-muted/50"
            )}
            // onClick={() => onToggleComplete?.(habit._id)}
          >
            {isCompleted ? <CheckCircle /> : <Circle />}
          </Button>
        </div>

        {/* Streak :: habit.streak && habit.streak > 0 && */}
        {streak && streak > 0 && (
          <div className="mt-3 flex items-center gap-1 text-sm font-medium">
            <Flame size={16} className="text-orange-500" />
            {streak} day streak
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-muted/20 px-5 py-2 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/habits/${habit._id}`)}
        >
          View Details
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/habits/${habit._id}/log`)}
        >
          View Log
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HabitCard;

const formatFrequency = (habit: Habit) => {
  if (habit.frequency !== "custom") {
    return habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1);
  }

  const days = habit.customFrequency?.daysOfWeek ?? [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (days.length > 0) {
    return `Custom: ${days.map((d) => dayNames[d]).join(", ")}`;
  }

  return "Custom";
};

const formatReminderTimes = (times: string[]) => {
  return times.map((time) => {
    const [h, m] = time.split(":").map(Number);
    const period = h < 12 ? "AM" : "PM";
    const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
  });
};
