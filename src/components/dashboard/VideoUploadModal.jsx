import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Film, UploadCloud, CheckCircle, AlertCircle, RefreshCw, Clock, ArrowRight } from 'lucide-react'

export function VideoUploadModal({ 
  isOpen, 
  onClose, 
  onAddVideo, 
  chapterId, 
  addToast 
}) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadState, setUploadState] = useState('idle') // 'idle', 'uploading', 'success', 'error'
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState('')
  
  // Fields for the video lección metadata
  const [videoTitle, setVideoTitle] = useState('')
  const [videoDuration, setVideoDuration] = useState('')
  const [errors, setErrors] = useState({})
  
  const fileInputRef = useRef(null)

  // Reset uploader state when modal toggles
  useEffect(() => {
    if (isOpen) {
      setUploadState('idle')
      setProgress(0)
      setFileName('')
      setFileSize('')
      setVideoTitle('')
      setVideoDuration('')
      setErrors({})
    }
  }, [isOpen])

  // --- DRAG & DROP EVENT HANDLERS ---
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  // --- MOCK UPLOADING TIMERS ---
  const processFile = (file) => {
    const isVideo = file.type.startsWith('video/')
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
    
    setFileName(file.name)
    setFileSize(`${sizeMB} MB`)

    // Quick size validation mock (say files > 150MB trigger a mock size warning/error)
    if (parseFloat(sizeMB) > 150) {
      setUploadState('error')
      addToast('Archivo demasiado pesado. El límite del plan es 150MB.', 'error')
      return
    }

    // Auto-fill video title based on name (clean extension and replace underscores/dashes)
    const cleanedName = file.name
      .substring(0, file.name.lastIndexOf('.'))
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
    setVideoTitle(cleanedName)

    // Trigger mock uploading
    setUploadState('uploading')
    setProgress(0)
  }

  // Effect to simulate active uploading progress
  useEffect(() => {
    let interval
    if (uploadState === 'uploading') {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setUploadState('success')
            // Generate a random premium duration (e.g. between 5 and 20 mins)
            const randomMins = Math.floor(Math.random() * 15) + 5
            const randomSecs = Math.floor(Math.random() * 59)
            const formattedSecs = randomSecs < 10 ? `0${randomSecs}` : randomSecs
            setVideoDuration(`${randomMins}:${formattedSecs}`)
            addToast('¡Video procesado y codificado correctamente!', 'success')
            return 100
          }
          // Increment progress in random elegant steps
          const increment = Math.floor(Math.random() * 15) + 8
          return Math.min(prev + increment, 100)
        })
      }, 250)
    }
    return () => clearInterval(interval)
  }, [uploadState])

  const handleTriggerErrorSimulation = () => {
    setUploadState('uploading')
    setProgress(0)
    setTimeout(() => {
      setUploadState('error')
      addToast('Error de conexión al servidor de codificación.', 'error')
    }, 1200)
  }

  const handleSaveVideo = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!videoTitle.trim()) newErrors.title = 'El título de la lección es obligatorio'
    if (!videoDuration.trim()) newErrors.duration = 'La duración es obligatoria (Ej. 12:30)'
    
    // Duration pattern check: mm:ss
    const durationPattern = /^\d+:\d{2}$/
    if (videoDuration && !durationPattern.test(videoDuration)) {
      newErrors.duration = 'Formato de duración inválido. Usa mm:ss (Ej. 08:45)'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onAddVideo(chapterId, {
      id: `video-${Date.now()}`,
      title: videoTitle.trim(),
      duration: videoDuration.trim(),
      status: 'published' // Default to published for trainers
    })

    onClose()
  }

  const handleRetry = () => {
    setUploadState('idle')
    setProgress(0)
    setFileName('')
    setFileSize('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          ></motion.div>

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 text-left"
          >
            {/* Ambient subtle glow at top */}
            <div className="absolute top-0 left-1/4 w-1/2 h-20 bg-gradient-to-r from-purple-500/10 to-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
                  <Film className="w-4 h-4" />
                </span>
                <h2 className="text-xl font-extrabold text-white m-0">
                  Subir Video Lección
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition duration-200 cursor-pointer border-0 bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              
              {/* ─── FILE UPLOAD WORKSPACE ─── */}
              <div className="mb-6">
                
                {/* IDLE STATE: Drag & Drop Zone */}
                {uploadState === 'idle' && (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                      dragActive
                        ? 'border-purple-500 bg-purple-500/5 shadow-inner'
                        : 'border-slate-800 hover:border-purple-500/30 bg-slate-950/40 hover:bg-slate-950/80'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <UploadCloud className={`w-10 h-10 mx-auto mb-4 transition-colors duration-300 ${dragActive ? 'text-purple-400' : 'text-slate-550'}`} />
                    <p className="text-sm font-bold text-white mb-1">
                      {dragActive ? '¡Suelta el archivo aquí!' : 'Arrastra tu lección en video aquí'}
                    </p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      o haz clic para explorar tus archivos locales. <br />
                      Soporta MP4, MOV o AVI (Hasta 150MB para simulación).
                    </p>
                  </div>
                )}

                {/* UPLOADING STATE: Interactive Progress */}
                {uploadState === 'uploading' && (
                  <div className="border border-slate-800 bg-slate-950/50 rounded-2xl p-6 text-center space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400">Subiendo video académico...</span>
                      <span className="text-purple-400">{progress}%</span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-850">
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 to-emerald-500 h-full rounded-full"
                        style={{ width: `${progress}%` }}
                        transition={{ ease: "easeInOut" }}
                      ></motion.div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold pt-1">
                      <span className="truncate max-w-[200px]">{fileName}</span>
                      <span>{fileSize}</span>
                    </div>
                  </div>
                )}

                {/* SUCCESS STATE: Completed preview */}
                {uploadState === 'success' && (
                  <div className="border border-emerald-500/20 bg-emerald-500/3 p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                        <CheckCircle className="w-5 h-5 animate-scaleUp" />
                      </div>
                      <div className="text-left min-w-0">
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Listo</span>
                        <p className="text-xs font-bold text-white truncate mt-1">{fileName}</p>
                        <p className="text-[10px] text-slate-500">{fileSize}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleRetry}
                      className="text-xs text-slate-500 hover:text-white px-3 py-1.5 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-lg transition duration-200 cursor-pointer bg-transparent"
                    >
                      Cambiar
                    </button>
                  </div>
                )}

                {/* ERROR STATE: Failed uploader */}
                {uploadState === 'error' && (
                  <div className="border border-rose-500/20 bg-rose-500/3 p-6 rounded-2xl text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-450 mx-auto">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Fallo en la subida del video</p>
                      <p className="text-xs text-slate-550 mt-1">El archivo supera los 150MB o el servidor falló.</p>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={handleRetry}
                        className="px-4 py-2 border border-slate-800 bg-slate-950 text-slate-350 hover:text-white hover:bg-slate-900 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Buscar otro
                      </button>
                      <button
                        onClick={() => {
                          setUploadState('uploading')
                          setProgress(0)
                        }}
                        className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-400 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reintentar
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* ─── METADATA FORMS AREA ─── */}
              {uploadState === 'success' && (
                <form onSubmit={handleSaveVideo} className="space-y-4 border-t border-slate-900/60 pt-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Título de la Lección</label>
                    <input
                      type="text"
                      value={videoTitle}
                      onChange={(e) => {
                        setVideoTitle(e.target.value)
                        if (errors.title) setErrors(prev => ({ ...prev, title: null }))
                      }}
                      placeholder="Ej. Anatomía del Cuádriceps y Biomecánica"
                      className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition duration-200"
                    />
                    {errors.title && <p className="text-[11px] text-rose-450 font-medium text-left">{errors.title}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Duración del Video (mm:ss)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600">
                        <Clock className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        value={videoDuration}
                        onChange={(e) => {
                          setVideoDuration(e.target.value)
                          if (errors.duration) setErrors(prev => ({ ...prev, duration: null }))
                        }}
                        placeholder="Ej. 14:45"
                        className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition duration-200"
                      />
                    </div>
                    {errors.duration && <p className="text-[11px] text-rose-450 font-medium text-left">{errors.duration}</p>}
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-850">
                    <button
                      type="button"
                      onClick={onClose}
                      className="bg-transparent hover:bg-slate-850 border border-slate-800 text-slate-350 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-650 hover:to-emerald-650 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition duration-200 active:scale-95 cursor-pointer border-0"
                    >
                      Añadir Video Lección
                    </button>
                  </div>
                </form>
              )}

              {/* IDLE DEMO TOGGLES */}
              {uploadState === 'idle' && (
                <div className="mt-4 flex items-center justify-between p-3.5 bg-slate-950 border border-slate-900 rounded-xl text-[10px] text-slate-500 font-semibold">
                  <span>🛠️ Simular Fallo:</span>
                  <button
                    onClick={handleTriggerErrorSimulation}
                    className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 rounded-md transition duration-200 text-[9px] cursor-pointer"
                  >
                    Simular Error de Conexión
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
