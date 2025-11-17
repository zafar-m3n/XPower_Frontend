// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import RegisterPage from "@/pages/auth/RegisterPage";
import LoginPage from "@/pages/auth/LoginPage";

import DashboardPage from "@/pages/dashboard";
import ProductsPage from "@/pages/products";
import ReportsPage from "@/pages/reports";
import CategoriesPage from "@/pages/categories";
import WarehousesPage from "@/pages/warehouses";
import Inventory from "@/pages/inventory";
import UsersPage from "@/pages/users";
import StockOut from "@/pages/stock";

import PrivateRoute from "@/components/PrivateRoute";
import PublicRoute from "@/components/PublicRoute";
import token from "@/lib/utilities";

function App() {
  // Boot-time guard + auto-logout scheduling
  useEffect(() => {
    token.initAuthGuard(
      () => {
        // onLogout — only fire this toast when user previously had a token
        if (token.isAuthenticated()) {
          // unlikely because logout clears it; extra guard anyway
          toast.dismiss();
          toast.info("Your session expired. Please log in again.");
        } else {
          // If we got here via cross-tab or expired-on-load, still show once
          toast.dismiss();
          toast.info("Your session expired. Please log in again.");
        }
        token.logout("/login");
      },
      () => {
        // onLogin (optional)
      }
    );
  }, []);

  const protectedRoutes = [
    { path: "/dashboard", element: DashboardPage },
    { path: "/products", element: ProductsPage },
    { path: "/reports", element: ReportsPage },
    { path: "/categories", element: CategoriesPage },
    { path: "/warehouses", element: WarehousesPage },
    { path: "/inventory", element: Inventory },
    { path: "/users", element: UsersPage },
    { path: "/stock", element: StockOut },
  ];

  const publicRoutes = [
    { path: "/register", element: RegisterPage },
    { path: "/login", element: LoginPage },
  ];

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              token.isAuthenticated() && !token.isTokenExpired() ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {protectedRoutes.map((route, idx) => (
            <Route
              key={idx}
              path={route.path}
              element={
                <PrivateRoute>
                  <route.element />
                </PrivateRoute>
              }
            />
          ))}

          {publicRoutes.map((route, idx) => (
            <Route
              key={idx}
              path={route.path}
              element={
                <PublicRoute>
                  <route.element />
                </PublicRoute>
              }
            />
          ))}
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        closeOnClick
        draggable={false}
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
