import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export function VideoPlayerModal({ isOpen, onClose, videoUrl, title }) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/92 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-4xl"
          >
            {/* Title + close */}
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-white font-bold text-sm truncate pr-4 max-w-[80%]">{title}</p>
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer border-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Player */}
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full rounded-2xl bg-black"
                style={{ maxHeight: '75vh' }}
              >
                Tu navegador no soporta la reproducción de video.
              </video>
            ) : (
              <div
                className="w-full rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center"
                style={{ minHeight: '300px' }}
              >
                <p className="text-slate-500 text-sm">Video no disponible</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
