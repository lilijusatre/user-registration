import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import UserManagement from './components/UserManagement'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return !token ? children : <Navigate to="/dashboard" />
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={localStorage.getItem('token') ? '/dashboard' : '/login'}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
