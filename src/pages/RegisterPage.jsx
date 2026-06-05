import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Zap } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { redirectToCheckout } from '../lib/stripe'

const PLAN_META = {
  monthly:  { label: 'Plan Mensual',  price: '125€/mes',     priceId: import.meta.env.VITE_STRIPE_PRICE_MONTHLY },
  '3months':{ label: 'Plan 3 Meses', price: '300€ · ahorra 20%', priceId: import.meta.env.VITE_STRIPE_PRICE_3MONTHS },
  '6months':{ label: 'Plan 6 Meses', price: '525€ · ahorra 30%', priceId: import.meta.env.VITE_STRIPE_PRICE_6MONTHS },
}

export default function RegisterPage() {
  const { user, profile, signUp, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const selectedPlan = searchParams.get('plan') // 'monthly' | '3months' | '6months' | null
  const planMeta = PLAN_META[selectedPlan] ?? null

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Track whether the current render comes from a just-completed signup
  const justSignedUp = useRef(false)

  useEffect(() => {
    if (!user || loading) return

    const isExempt = ['admin', 'trainer'].includes(profile?.role)

    if (justSignedUp.current && planMeta?.priceId && !isExempt) {
      redirectToCheckout(planMeta.priceId, user.id, user.email)
        .catch(() => navigate('/dashboard'))
    } else {
      navigate('/dashboard')
    }
  }, [user, loading, profile])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSubmitting(true)
    try {
      const { error } = await signUp(email, password, fullName)
      if (error) {
        setErrorMsg(error.message || 'Error al registrarse. Inténtalo de nuevo.')
      } else {
        justSignedUp.current = true
        // useEffect will fire when user state updates and handle redirect
      }
    } catch {
      setErrorMsg('Error inesperado. Inténtalo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse" />

      {/* Back button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition duration-200 decoration-none group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
        <span className="text-sm font-semibold">Volver</span>
      </Link>

      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl space-y-8 relative">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group decoration-none">
            <span className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">C</span>
            <span className="text-2xl font-black tracking-tight text-white group-hover:text-purple-400 transition-colors duration-200">
              Core<span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">Pulse</span>
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight mt-6 mb-2">Comienza tu Cambio</h2>
          <p className="text-slate-400 text-sm">Entrena inteligente. Aliméntate bien. Alcanza tus metas.</p>
        </div>

        {/* Selected plan badge */}
        {planMeta && (
          <div className="flex items-center gap-3 p-3.5 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
            <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{planMeta.label}</p>
              <p className="text-xs text-purple-400">{planMeta.price} · El pago se completará tras el registro</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm p-4 rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 block">Nombre Completo</label>
            <input
              type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre y apellido"
              className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition duration-200 text-base"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 block">Correo Electrónico</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@corepulse.com"
              className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition duration-200 text-base"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 block">Contraseña</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 caracteres"
              className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition duration-200 text-base"
            />
          </div>

          <button
            type="submit" disabled={submitting}
            className="w-full bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-lg shadow-purple-500/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer text-base"
          >
            {submitting
              ? 'Creando cuenta...'
              : planMeta ? 'Crear cuenta e ir al pago →' : 'Registrarse'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold decoration-none transition duration-200">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  )
}
