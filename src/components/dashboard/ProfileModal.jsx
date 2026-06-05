import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Camera, CreditCard, Save, Check, Upload, Shield, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useSubscription } from '../../hooks/useSubscription'
import { PLANS, redirectToCheckout } from '../../lib/stripe'

const TABS = [
  { id: 'perfil', label: 'Perfil', Icon: User },
  { id: 'foto', label: 'Foto', Icon: Camera },
  { id: 'suscripcion', label: 'Suscripción', Icon: CreditCard },
]

export function ProfileModal({ isOpen, onClose }) {
  const { user, profile } = useAuth()
  const { subscription } = useSubscription()
  const [activeTab, setActiveTab] = useState('perfil')
  const [checkoutLoading, setCheckoutLoading] = useState(null) // plan id being loaded

  // Perfil tab
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Foto tab
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name)
  }, [profile])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab('perfil')
      setSaved(false)
      setSaveError('')
    }
  }, [isOpen])

  const handleSelectPlan = async (plan) => {
    if (!plan.priceId || plan.priceId.startsWith('price_XXXX')) return
    setCheckoutLoading(plan.id)
    try {
      await redirectToCheckout(plan.priceId, user.id, profile?.email)
    } catch (err) {
      console.error('Checkout error:', err)
      setCheckoutLoading(null)
    }
  }

  const handleSaveProfile = async () => {
    if (!fullName.trim()) return
    setSaving(true)
    setSaveError('')
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() })
      .eq('id', user.id)
    setSaving(false)
    if (error) {
      setSaveError('No se pudo guardar. Inténtalo de nuevo.')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-[#0d1117] border border-slate-800/80 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-0">
            <div>
              <h2 className="text-lg font-black text-white">Mi Cuenta</h2>
              <p className="text-xs text-slate-500 mt-0.5">{profile?.email}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-white transition duration-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-6 mt-5">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border-0 ${
                  activeTab === id
                    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                    : 'text-slate-500 hover:text-slate-300 bg-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="px-6 py-6 min-h-[280px]">
            <AnimatePresence mode="wait">

              {/* ── PERFIL ── */}
              {activeTab === 'perfil' && (
                <motion.div
                  key="perfil"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  {/* Avatar display */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-emerald-500/20 border border-purple-500/30 flex items-center justify-center font-black text-lg text-purple-400 flex-shrink-0">
                      {profile?.full_name
                        ? profile.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
                        : 'CP'}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{profile?.full_name || '—'}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full mt-1">
                        <Shield className="w-2.5 h-2.5" />
                        {profile?.role || 'user'}
                      </span>
                    </div>
                  </div>

                  {/* Full name field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nombre completo</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSaveProfile()}
                      className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition duration-200"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  {/* Email field (read-only) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                    <input
                      type="text"
                      value={profile?.email || ''}
                      readOnly
                      className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  {saveError && <p className="text-xs text-rose-400">{saveError}</p>}

                  <button
                    onClick={handleSaveProfile}
                    disabled={saving || !fullName.trim()}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-200 cursor-pointer border-0 ${
                      saved
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                        : 'bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600 text-white disabled:opacity-40 disabled:cursor-not-allowed'
                    }`}
                  >
                    {saved ? (
                      <><Check className="w-4 h-4" /> Guardado</>
                    ) : saving ? (
                      'Guardando...'
                    ) : (
                      <><Save className="w-4 h-4" /> Guardar cambios</>
                    )}
                  </button>
                </motion.div>
              )}

              {/* ── FOTO ── */}
              {activeTab === 'foto' && (
                <motion.div
                  key="foto"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  {/* Current avatar */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-emerald-500/20 border border-purple-500/30 flex items-center justify-center font-black text-xl text-purple-400">
                      {profile?.full_name
                        ? profile.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
                        : 'CP'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Foto de perfil</p>
                      <p className="text-xs text-slate-500 mt-0.5">JPG, PNG o WebP · Máx. 2 MB</p>
                    </div>
                  </div>

                  {/* Drop zone */}
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false) }}
                    onClick={() => fileRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
                      dragOver
                        ? 'border-purple-500/60 bg-purple-500/5'
                        : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/20'
                    }`}
                  >
                    <Upload className="w-7 h-7 text-slate-600 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-400">
                      Arrastra tu foto aquí o <span className="text-purple-400">selecciona un archivo</span>
                    </p>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" />
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                    <Camera className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <p className="text-xs text-amber-400/80">El almacenamiento de fotos estará disponible próximamente.</p>
                  </div>
                </motion.div>
              )}

              {/* ── SUSCRIPCIÓN ── */}
              {activeTab === 'suscripcion' && (
                <motion.div
                  key="suscripcion"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-3"
                >
                  {/* Current status */}
                  {subscription?.status === 'active' ? (
                    <div className="flex items-center justify-between p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm font-bold text-emerald-400">Suscripción Activa</span>
                      </div>
                      <span className="text-xs text-slate-400 font-semibold">{subscription.plan?.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-sm font-bold text-amber-400">Sin suscripción activa</span>
                    </div>
                  )}

                  {PLANS.map(plan => (
                    <div
                      key={plan.id}
                      className={`p-4 rounded-2xl border transition-all duration-200 ${
                        plan.highlight
                          ? 'border-purple-500/40 bg-purple-500/5'
                          : 'border-slate-800/80 bg-slate-900/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-white">{plan.name}</p>
                            {plan.savings && (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">
                                {plan.savings}
                              </span>
                            )}
                          </div>
                          {plan.equivalent && (
                            <p className="text-[10px] text-slate-500 mt-0.5">{plan.equivalent}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <span className="text-lg font-black text-white">{plan.price}</span>
                            <span className="text-[10px] text-slate-500 ml-1">{plan.period}</span>
                          </div>
                          <button
                            onClick={() => handleSelectPlan(plan)}
                            disabled={!!checkoutLoading}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all duration-200 cursor-pointer border-0 disabled:opacity-50 ${
                              plan.highlight
                                ? 'bg-gradient-to-r from-purple-500 to-emerald-500 text-white'
                                : 'bg-slate-800 hover:bg-slate-700 text-white'
                            }`}
                          >
                            {checkoutLoading === plan.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : 'Elegir'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <p className="text-[10px] text-slate-600 text-center pt-1">
                    El pago se gestiona de forma segura a través de Stripe.
                  </p>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
