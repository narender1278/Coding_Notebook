import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router';
import { useSelector } from "react-redux";

import Home from './pages/Home';
import Cpage from './pages/Cpage';
import Vpage from './pages/Vpage';
import Login from './pages/Login';
import Notes from "./pages/Notes";
import AppLayout from './layouts/AppLayout';
import { PrimeReactProvider } from 'primereact/api';
import DailyPlanner from './pages/DailyPlanner';
import FinanceDashboard from './pages/FinancePlanner';
import ProfilePage from './pages/Profile';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    setIsAuthenticated(user.isloggedin);
  }, [user.isloggedin]);

  return (
    <PrimeReactProvider>
      <div className="w-full h-full">
        <Routes>

          {/* LOGIN */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/home" /> : <Login />}
          />

          {/* AUTHENTICATED ROUTES WRAPPED IN AppLayout */}
          <Route
            path="/home"
            element={
              isAuthenticated ? (
                <AppLayout><Home /></AppLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/notes"
            element={
              isAuthenticated ? (
                <AppLayout><Notes /></AppLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/create"
            element={
              isAuthenticated ? (
                <AppLayout><Cpage /></AppLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/view/:id"
            element={
              isAuthenticated ? (
                <AppLayout><Vpage /></AppLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/dailyPlanner"
            element={
              isAuthenticated ? (
                <AppLayout><DailyPlanner /></AppLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/financePLanner"
            element={
              isAuthenticated ? (
                <AppLayout><FinanceDashboard /></AppLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <AppLayout><ProfilePage /></AppLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="*"
            element={
              isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/" />
            }
          />

        </Routes>
      </div>
    </PrimeReactProvider>
  );
};

export default App;
