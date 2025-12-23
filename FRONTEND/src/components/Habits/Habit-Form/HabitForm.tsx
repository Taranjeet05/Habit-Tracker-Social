import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../ui/card";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { useState } from "react";
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  Clock,
  InfoIcon,
  MinusCircle,
  Palette,
  PlusCircle,
} from "lucide-react";
import { colorOptions, daysOfWeek, frequencyOptions, MAX_REMINDERS_PER_DAY } from "./Constants";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Badge } from "../../ui/badge";
// import { useNavigate } from "react-router-dom";
import { Switch } from "../../ui/switch";
// import { HabitColor } from "../../../types/habitForm";

const HabitForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  //  const [color, setColor] = useState() "green");
  const [frequency, setFrequency] = useState("monthly");
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [customreminderTimes, setCustomreminderTimes] = useState(1);
  const [weeklyDay, setWeeklyDay] = useState(1);
  const [monthlyDay, setMonthlyDay] = useState(1);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTimes, setReminderTimes] = useState(["09:00"]);
  // const navigate = useNavigate();

  const safeSelectedColor = "green";

  // Helper function to get the appropriate icon for each frequency
  const getFrequencyIcon = (freq: string) => {
    switch (freq) {
      case "daily":
        return <Calendar className="h-4 w-4 mr-2" />;
      case "weekly":
        return <CalendarRange className="h-4 w-4 mr-2" />;
      case "monthly":
        return <CalendarDays className="h-4 w-4 mr-2" />;
      case "custom":
        return <Clock className="h-4 w-4 mr-2" />;
      default:
        return <Calendar className="h-4 w-4 mr-2" />;
    }
  };

  // Display selected days for custom frequency
  const getCustomDaysLabel = () => {
    if (frequency !== "custom" || customDays.length === 0) return null;

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const selectedDays = customDays.map((day) => dayNames[day]).join(", ");

    return (
      <span className="ml-2 text-sm text-muted-foreground">
        ({selectedDays})
      </span>
    );
  };

  const daysOfMonth = Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}`,
  }));

  // *************
 // --------------------
// Reminder logic
// --------------------
// const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// const selectedDaysText =
//   customDays.length > 0
//     ? customDays.map(day => dayNames[day]).join(', ')
//     : '';

const hasSelectedDays = customDays.length > 0;

const handleReminderTimeChange = (index: number, value: string) => {
  const newTimes = [...reminderTimes];
  newTimes[index] = value;
  setReminderTimes(newTimes);
};

const addReminderTime = () => {
  if (reminderTimes.length < MAX_REMINDERS_PER_DAY) {
    setReminderTimes([...reminderTimes, "12:00"]);
    setCustomreminderTimes(prev => prev + 1);
  }
};

const removeReminderTime = (index: number) => {
  if (reminderTimes.length > 1) {
    const newTimes = reminderTimes.filter((_, i) => i !== index);
    setReminderTimes(newTimes);
    setCustomreminderTimes(newTimes.length);
  }
};


  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>"Create New Habit"</CardTitle>
        <CardDescription>
          "Define a new habit you want to build"
        </CardDescription>
      </CardHeader>
      <form className="space-y-2.5">
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Habit Title *</Label>
            <Input
              id="title"
              placeholder="E.g., Morning Meditation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="E.g., Meditate for 10 minutes after waking up"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* color Selector */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base">
              <Palette className="h-5 w-5" />
              Choose a Color
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant="outline"
                  className={`
              relative flex flex-col items-center justify-center p-3 h-auto transition-all
              ${
                safeSelectedColor === option.value
                  ? `ring-2 ring-offset-2 ring-${option.value}-500 shadow-sm`
                  : "hover:bg-background/5"
              }
            `}
                  // onClick={() => onChange(option.value as HabitColor)}
                >
                  <span
                    className={`w-6 h-6 rounded-full mb-2 bg-${option.value}-500`}
                    aria-hidden="true"
                  />
                  <span className="text-xs font-medium">{option.name}</span>
                  {safeSelectedColor === option.value && (
                    <span
                      className={`absolute inset-0 border-2 border-${option.value}-500 rounded-md`}
                      aria-hidden="true"
                    />
                  )}
                </Button>
              ))}
            </div>
          </div>
          {/* *********************** */}

          {/* frequency selector */}
          <div className="space-y-4">
            <Label>Frequency</Label>
            <RadioGroup
              // value={frequency}
              // onValueChange={(value) => onChange(value as HabitFrequency)}
              className="grid grid-cols-2 gap-4 pt-2"
            >
              {frequencyOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 bg-card rounded-md border p-3 cursor-pointer transition-all hover:border-primary"
                  // onClick={() => onChange(option.value as HabitFrequency)}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`frequency-${option.value}`}
                  />
                  <Label
                    htmlFor={`frequency-${option.value}`}
                    className="flex items-center cursor-pointer"
                  >
                    {getFrequencyIcon(option.value)}
                    {option.name}
                    {option.value === "custom" && getCustomDaysLabel()}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* if frequency is weekly  */}
          {frequency === "weekly" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="weekly-day" className="flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Which day of the week would you like to perform this
                      habit?
                    </span>
                  </div>
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Setting a specific day helps us send you reminders on the
                      right schedule!
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
              // value={selectedDay.toString()}
              // onValueChange={(value) => onChange(parseInt(value))}
              >
                <SelectTrigger id="weekly-day" className="w-full">
                  <SelectValue placeholder="Select day of week" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {/* ************************* */}

          {/* if frequency is Monthly */}
          {frequency === "monthly" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="monthly-day" className="flex-1">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      Which day of the month should this habit repeat on?
                    </span>
                  </div>
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      If the month has fewer days, it will repeat on the last
                      available day.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
              // value={selectedDay.toString()}
              // onValueChange={(value) => onChange(parseInt(value))}
              >
                <SelectTrigger id="monthly-day" className="w-full">
                  <SelectValue placeholder="Select day of month" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfMonth.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {/* ****************************** */}

          {/* if frequency is custom */}
          {frequency === "custom" && (
            <div className="space-y-4 border border-border rounded-md p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Select Days</Label>
                  {customDays.length > 0 && (
                    <Badge variant="outline">
                      {customDays.length} day
                      {customDays.length !== 1 ? "s" : ""} selected
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => {
                    const isSelected = customDays.includes(day.value);
                    return (
                      <Button
                        key={day.value}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        className={`p-0 h-10 w-10 ${
                          isSelected ? "" : "border border-input"
                        }`}
                        // onClick={() => onDaysChange(day.value)}
                      >
                        {day.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="reminderTimes">
                    reminderTimes Per Period
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs text-muted-foreground cursor-help">
                          ⓘ
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          How many reminderTimes you want to complete this habit
                          on each selected day
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                // value={customreminderTimes.toString()}
                // onValueChange={(value) => onreminderTimesChange(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select reminderTimes per period" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "time" : "reminderTimes"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {customDays.length > 0 && customreminderTimes > 0 && (
                  <div className="mt-2 p-2 bg-primary/10 rounded-md border border-primary/20">
                    <p className="text-sm">
                      <span className="font-medium">{customreminderTimes}</span>{" "}
                      time
                      {customreminderTimes !== 1 ? "s" : ""} per day on{" "}
                      {customDays.map((day) => daysOfWeek[day].name).join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* *************************************** */}

          {/* -------------------- */}
          {/* Reminders Section */}
          {/* -------------------- */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label className="font-medium">Enable Reminders</Label>
              </div>

              <Switch
                checked={remindersEnabled}
                onCheckedChange={setRemindersEnabled}
                disabled={frequency === "custom" && !hasSelectedDays}
              />
            </div>

            {remindersEnabled && (
              <div
                className={`space-y-4 border rounded-md p-4 ${
                  frequency === "custom" && !hasSelectedDays
                    ? "border-destructive/50 bg-destructive/10"
                    : "border-border"
                }`}
              >
                {frequency === "custom" && !hasSelectedDays && (
                  <p className="text-sm text-destructive font-medium">
                    Please select at least one day to set reminders
                  </p>
                )}

                <div className="grid gap-3">
                  {reminderTimes.map((time, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-muted/30 p-2 rounded-md"
                    >
                      <Badge variant="outline">{index + 1}</Badge>

                      <Input
                        type="time"
                        value={time}
                        onChange={(e) =>
                          handleReminderTimeChange(index, e.target.value)
                        }
                        className="flex-grow"
                      />

                      {reminderTimes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeReminderTime(index)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      )}

                      {index === reminderTimes.length - 1 &&
                        reminderTimes.length < MAX_REMINDERS_PER_DAY &&
                        frequency !== "custom" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={addReminderTime}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!remindersEnabled && (
              <p className="text-sm text-muted-foreground italic">
                Reminders disabled
              </p>
            )}
          </div>

          {/* **************************************** */}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Create Habit</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default HabitForm;
