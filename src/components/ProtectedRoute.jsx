// ProtectedRoute.js
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/signin" />;

  return children;
};

export default ProtectedRoute;
