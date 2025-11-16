import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Switch } from "../components/ui/switch"
import { Moon, Sun } from "lucide-react"

const Settings = () => {
  const [email, setEmail] = useState("messi@goat.com");
  const [notifications, setNotifications] = useState(true);
  const [friendRequests, setFriendRequests] = useState(true);
  const [friendActivity, setFriendActivity] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

   const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      alert("Settings saved successfully");
      setIsSaving(false);
    }, 1000);
  };

  return (
 <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences
          </p>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Update your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex gap-4">
                  <Input
                    id="password"
                    type="password"
                    value="••••••••"
                    disabled
                  />
                  <Button
                    variant="outline"
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {darkMode ? (
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Sun className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div className="space-y-0.5">
                    <Label htmlFor="theme-toggle">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark theme
                    </p>
                  </div>
                </div>
                <Switch
                  id="theme-toggle"
                  checked={darkMode}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive daily reminders about your habits
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="friend-requests">Friend Request Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone sends you a friend request
                  </p>
                </div>
                <Switch
                  id="friend-requests"
                  checked={friendRequests}
                  onCheckedChange={setFriendRequests}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="friend-activity">Friend Activity</Label>
                  <p className="text-sm text-muted-foreground">
                    Get updates about your friends' progress
                  </p>
                </div>
                <Switch
                  id="friend-activity"
                  checked={friendActivity}
                  onCheckedChange={setFriendActivity}
                />
              </div>
            </CardContent>
          </Card>
          
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>  )
}

export default Settings