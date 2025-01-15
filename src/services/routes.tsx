import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../services/adminPage";
import LoginForm from "../services/login";
import UserDashboard from "../services/userDashboard";
import ProtectedRoute from "../services/protectedRoutes";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Página de Login */}
      <Route path="/login" element={<LoginForm />} />

      {/* Rotas Protegidas */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Redirecionamento padrão */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
