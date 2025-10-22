import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const Start = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-block bg-primary text-primary-foreground p-2 rounded-lg mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10"
          >
            <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path>
            <path d="M12 8v8"></path>
            <path d="M8 12h8"></path>
          </svg>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
          Track Your Habits,{" "}
          <span className="text-primary">Build Your Future</span>
        </h1>

        <p className="mt-8 text-lg text-muted-foreground max-w-xl mx-auto">
          Create and track your daily habits, challenge yourself, and connect
          with friends for accountability and inspiration.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Button size="lg" onClick={() => navigate("/register")}>
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <div className="bg-card p-6 rounded-xl shadow-sm border">
            <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Track Daily Progress</h3>
            <p className="text-muted-foreground mt-2">
              Log your habit completion and visualize your streak and progress
              over time.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-sm border">
            <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Connect With Friends</h3>
            <p className="text-muted-foreground mt-2">
              Invite friends to join you on your journey and keep each other
              accountable.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-sm border">
            <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20v-6M6 20V10M18 20V4"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Visualize Growth</h3>
            <p className="text-muted-foreground mt-2">
              See your progress with beautiful charts and celebrate your
              achievements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
