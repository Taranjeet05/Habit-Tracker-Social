import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "../components/ui/badge";
import { User, Edit, Camera, Award, Calendar } from "lucide-react";

const Profile = () => {
  const profile = {
    id: "user1",
    userName: "GOAT",
    email: "messi@goat.com",
    profileImage: undefined,
    joinedDate: "2024-01-01T00:00:00Z",
    totalHabits: 8,
    activeHabits: 5,
    longestStreak: 21,
    friendsCount: 12,
    theme: "system",
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and view your progress
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.profileImage} />
                <AvatarFallback className="text-2xl">
                  {profile.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <CardTitle className="text-xl">{profile.userName}</CardTitle>
            <CardDescription>{profile.email}</CardDescription>
            <Badge variant="secondary" className="w-fit mx-auto">
              <Calendar className="h-3 w-3 mr-1" />
              Joined {profile.joinedDate}
            </Badge>
          </CardHeader>
        </Card>

        {/* Profile Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                "Edit"
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Username
                </Label>
                <p className="text-base">{profile.userName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Email
                </Label>
                <p className="text-base">{profile.email}</p>
              </div>
            </>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Your Statistics
          </CardTitle>
          <CardDescription>
            Track your progress and achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {profile.totalHabits}
              </div>
              <p className="text-sm text-muted-foreground">Total Habits</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {profile.activeHabits}
              </div>
              <p className="text-sm text-muted-foreground">Active Habits</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {profile.longestStreak}
              </div>
              <p className="text-sm text-muted-foreground">Longest Streak</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {profile.friendsCount}
              </div>
              <p className="text-sm text-muted-foreground">Friends</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
