import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertTriangle, X, Info } from 'lucide-react'

export function Toast({ id, message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, 4000)
    return () => clearTimeout(timer)
  }, [id, onClose])

  const typeConfig = {
    success: {
      bg: 'bg-slate-950/90',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
      glow: 'shadow-emerald-500/10'
    },
    error: {
      bg: 'bg-slate-950/90',
      border: 'border-rose-500/30',
      text: 'text-rose-400',
      icon: <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
      glow: 'shadow-rose-500/10'
    },
    info: {
      bg: 'bg-slate-950/90',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      icon: <Info className="w-5 h-5 text-purple-400 flex-shrink-0" />,
      glow: 'shadow-purple-500/10'
    }
  }

  const config = typeConfig[type] || typeConfig.success

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${config.bg} ${config.border} shadow-2xl ${config.glow} backdrop-blur-xl min-w-[280px] max-w-sm`}
    >
      {config.icon}
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold text-white leading-tight">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-slate-500 hover:text-white p-0.5 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer border-0 bg-transparent"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              id={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={onClose}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
