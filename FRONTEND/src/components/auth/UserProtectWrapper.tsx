import { Navigate } from "react-router-dom";

interface UserProtectWrapperProps {
  children: React.ReactNode;
}

const UserProtectWrapper = ({ children }: UserProtectWrapperProps) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to={"/login"} />;
  }

  return <div>{children}</div>;
};

export default UserProtectWrapper;
