import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'

export function UserDashboard() {
  const { profile, signOut } = useAuth()
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-8">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl space-y-6">
        <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto text-purple-400 text-2xl font-bold">
          CP
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">¡Bienvenido!</h1>
        <p className="text-slate-400">
          Hola, <span className="text-purple-400 font-medium">{profile?.full_name || 'Miembro CorePulse'}</span>. Estás en tu Panel de Usuario.
        </p>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 text-left space-y-2 text-sm text-slate-300">
          <p><strong>Rol:</strong> {profile?.role || 'user'}</p>
          <p><strong>Acceso:</strong> Activo (Suscripción habilitada) ✅</p>
        </div>
        <div className="flex flex-col gap-3">
          <Link to="/" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 text-center text-sm">
            Ir a Inicio
          </Link>
          <button onClick={signOut} className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 text-sm">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}

export function TrainerDashboard() {
  const { profile, signOut } = useAuth()
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-8">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl space-y-6">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-2xl font-bold">
          TR
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">Panel de Entrenador</h1>
        <p className="text-slate-400">
          Hola, <span className="text-emerald-400 font-medium">{profile?.full_name || 'Entrenador'}</span>. Estás en tu Dashboard de gestión de alumnos.
        </p>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 text-left space-y-2 text-sm text-slate-300">
          <p><strong>Rol:</strong> {profile?.role || 'trainer'}</p>
          <p><strong>Clientes asignados:</strong> Cargando datos...</p>
        </div>
        <div className="flex flex-col gap-3">
          <Link to="/" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 text-center text-sm">
            Ir a Inicio
          </Link>
          <button onClick={signOut} className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 text-sm">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}

export function AdminDashboard() {
  const { profile, signOut } = useAuth()
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-8">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl space-y-6">
        <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto text-cyan-400 text-2xl font-bold">
          AD
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">Panel de Control</h1>
        <p className="text-slate-400">
          Hola, <span className="text-cyan-400 font-medium">{profile?.full_name || 'Administrador'}</span>. Acceso Root de CorePulse habilitado.
        </p>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 text-left space-y-2 text-sm text-slate-300">
          <p><strong>Rol:</strong> {profile?.role || 'admin'}</p>
          <p><strong>Servicios:</strong> Base de datos y planes activos.</p>
        </div>
        <div className="flex flex-col gap-3">
          <Link to="/" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 text-center text-sm">
            Ir a Inicio
          </Link>
          <button onClick={signOut} className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 text-sm">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}
