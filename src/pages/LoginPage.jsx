import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { user, signIn, loading } = useAuth()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard')
    }
  }, [user, loading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSubmitting(true)
    
    try {
      const { error } = await signIn(email, password)
      if (error) {
        setErrorMsg(error.message || 'Error al iniciar sesión. Verifica tus credenciales.')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setErrorMsg('Ocurrió un error inesperado. Inténtalo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Decorative gradient background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl space-y-8 relative">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group decoration-none">
            <span className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
              C
            </span>
            <span className="text-2xl font-black tracking-tight text-white group-hover:text-purple-400 transition-colors duration-200">
              Core<span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">Pulse</span>
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight mt-6 mb-2">Bienvenido de nuevo</h2>
          <p className="text-slate-400 text-sm">Entrena inteligente. Aliméntate bien. Alcanza tus metas.</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm p-4 rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 block">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@corepulse.com"
              className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition duration-200 text-base"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-300 block">Contraseña</label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition duration-200 text-base"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 cursor-pointer text-base"
          >
            {submitting ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400">
          ¿No tienes una cuenta aún?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold decoration-none transition duration-200">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  )
}
