import React from "react";
import { Navigate } from "react-router-dom";
import {useAuth} from "../hooks/useAuth.js";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (requiredRole && role !== requiredRole) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
