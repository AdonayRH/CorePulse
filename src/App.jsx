import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { UserDashboard, TrainerDashboard, AdminDashboard } from './pages/Dashboards'

export default function App() {
  return (
    <Routes>
      {/* Ruta Pública - Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Solo admin */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Admin y Trainer */}
      <Route path="/trainer/*" element={
        <ProtectedRoute allowedRoles={['admin', 'trainer']}>
          <TrainerDashboard />
        </ProtectedRoute>
      } />

      {/* Todos los autenticados */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}