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

const HabitForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>"Create New Habit"</CardTitle>
        <CardDescription>
          "Define a new habit you want to build"
        </CardDescription>
      </CardHeader>
      <form>
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
