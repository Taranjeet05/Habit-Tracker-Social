import "./App.css";
import { Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserProtectWrapper from "./components/auth/UserProtectWrapper";
import DashBoard from "./pages/DashBoard";
import MainLayout from "./components/layout/MainLayout";

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
      </Routes>
    </>
  );
}

export default App;
