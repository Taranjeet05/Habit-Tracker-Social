import "./App.css";
import { Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserProtectWrapper from "./components/auth/UserProtectWrapper";
import DashBoard from "./pages/DashBoard";
import MainLayout from "./components/layout/MainLayout";
import CreateHabit from "./pages/CreateHabit";
import Friends from "./pages/Friends";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <UserProtectWrapper>
              <MainLayout>
                <DashBoard />
              </MainLayout>
            </UserProtectWrapper>
          }
        />
        <Route
          path="/habits/create"
          element={
            <UserProtectWrapper>
              <MainLayout>
                <CreateHabit />
              </MainLayout>
            </UserProtectWrapper>
          }
        />
        <Route
          path="/friends"
          element={
            <UserProtectWrapper>
              <MainLayout>
                <Friends />
              </MainLayout>
            </UserProtectWrapper>
          }
        />
        <Route
          path="/notifications"
          element={
            <UserProtectWrapper>
              <MainLayout>
                <Notifications />
              </MainLayout>
            </UserProtectWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <UserProtectWrapper>
              <MainLayout>
                <Profile />
              </MainLayout>
            </UserProtectWrapper>
          }
        />
        <Route
          path="/settings"
          element={
            <UserProtectWrapper>
              <MainLayout>
                <Settings />
              </MainLayout>
            </UserProtectWrapper>
          }
        />
      </Routes>
    </>
  );
}

export default App;
