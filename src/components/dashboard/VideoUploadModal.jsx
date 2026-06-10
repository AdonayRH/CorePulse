import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Film, UploadCloud, CheckCircle, AlertCircle, RefreshCw, Clock } from 'lucide-react'
import { uploadVideo, MAX_VIDEO_SIZE } from '../../lib/storage'

async function readVideoDuration(file) {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)
      const total = Math.round(video.duration)
      const mins = Math.floor(total / 60)
      const secs = total % 60
      resolve(`${mins}:${secs.toString().padStart(2, '0')}`)
    }
    video.onerror = () => resolve('')
    video.src = URL.createObjectURL(file)
  })
}

export function VideoUploadModal({
  isOpen,
  onClose,
  onAddVideo,
  chapterId,
  courseId,
  userId,
  addToast,
}) {
  const [uploadState, setUploadState] = useState('idle') // idle | uploading | done | error
  const [progress, setProgress] = useState(0)
  const [videoUrl, setVideoUrl] = useState(null)
  const [videoTitle, setVideoTitle] = useState('')
  const [videoDuration, setVideoDuration] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const xhrRef = useRef(null)
  const videoIdRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setUploadState('idle')
      setProgress(0)
      setVideoUrl(null)
      setVideoTitle('')
      setVideoDuration('')
      setErrorMsg('')
      setDragActive(false)
    }
  }, [isOpen])

  // Cancel in-flight upload if modal closes mid-upload
  useEffect(() => {
    return () => {
      if (xhrRef.current) {
        xhrRef.current.abort()
        xhrRef.current = null
      }
    }
  }, [])

  const processFile = useCallback(async (file) => {
    if (!file.type.startsWith('video/')) {
      addToast('Solo se aceptan archivos de video (MP4, MOV, WebM...)', 'error')
      return
    }
    if (file.size > MAX_VIDEO_SIZE) {
      const gb = (file.size / 1024 / 1024 / 1024).toFixed(1)
      addToast(`El archivo supera el límite de 2 GB (${gb} GB)`, 'error')
      return
    }

    // Auto-fill title from filename
    const autoTitle = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
    setVideoTitle(autoTitle)

    // Auto-detect duration from video metadata
    const dur = await readVideoDuration(file)
    setVideoDuration(dur)

    const videoId = `video-${Date.now()}`
    videoIdRef.current = videoId

    setUploadState('uploading')
    setProgress(0)

    try {
      const url = await uploadVideo(file, {
        userId: userId || 'unknown',
        courseId: courseId || 'uncategorized',
        videoId,
        onProgress: setProgress,
        xhrRef,
      })
      setVideoUrl(url)
      setUploadState('done')
    } catch (err) {
      if (err.message === 'Subida cancelada') return
      setUploadState('error')
      setErrorMsg(err.message)
      addToast(err.message, 'error')
    }
  }, [userId, courseId, addToast])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0])
  }

  const handleCancelUpload = () => {
    xhrRef.current?.abort()
    xhrRef.current = null
    setUploadState('idle')
    setProgress(0)
  }

  const handleRetry = () => {
    setUploadState('idle')
    setProgress(0)
    setVideoUrl(null)
    setErrorMsg('')
  }

  const handleSave = () => {
    if (!videoTitle.trim() || !videoUrl) return
    onAddVideo(chapterId, {
      id: videoIdRef.current || `video-${Date.now()}`,
      title: videoTitle.trim(),
      duration: videoDuration || '0:00',
      status: 'published',
      video_url: videoUrl,
    })
    onClose()
  }

  const canSave = uploadState === 'done' && videoTitle.trim() && videoUrl

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 text-left"
          >
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/4 w-1/2 h-20 bg-gradient-to-r from-purple-500/10 to-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
                  <Film className="w-4 h-4" />
                </span>
                <h2 className="text-xl font-extrabold text-white m-0">Subir Video Lección</h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition duration-200 cursor-pointer border-0 bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* IDLE: Drop zone */}
              {uploadState === 'idle' && (
                <div
                  onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
                    dragActive
                      ? 'border-purple-500 bg-purple-500/5'
                      : 'border-slate-800 hover:border-purple-500/40 bg-slate-950/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                    className="hidden"
                  />
                  <UploadCloud className={`w-10 h-10 mx-auto mb-3 transition-colors ${dragActive ? 'text-purple-400' : 'text-slate-600'}`} />
                  <p className="text-sm font-bold text-white mb-1">
                    {dragActive ? '¡Suelta aquí!' : 'Arrastra tu video aquí'}
                  </p>
                  <p className="text-xs text-slate-500">o haz clic para explorar · MP4, MOV, WebM · máx. 2 GB</p>
                </div>
              )}

              {/* UPLOADING or DONE: progress + metadata form */}
              {(uploadState === 'uploading' || uploadState === 'done') && (
                <div className="space-y-5">
                  {/* Progress bar */}
                  <div className={`p-4 rounded-2xl border ${
                    uploadState === 'done'
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : 'border-slate-800 bg-slate-950/40'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {uploadState === 'done'
                          ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                          : <Film className="w-4 h-4 text-purple-400 animate-pulse" />
                        }
                        <span className="text-xs font-bold text-white">
                          {uploadState === 'done' ? 'Video subido correctamente' : `Subiendo... ${progress}%`}
                        </span>
                      </div>
                      {uploadState === 'uploading' && (
                        <button
                          onClick={handleCancelUpload}
                          className="text-[10px] text-slate-500 hover:text-rose-400 font-bold transition cursor-pointer border-0 bg-transparent"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${uploadState === 'done' ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-500 to-emerald-500'}`}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Metadata form — fills in during upload so user isn't waiting */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Título de la Lección
                      </label>
                      <input
                        type="text"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="Ej. Biomecánica de la sentadilla"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition duration-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Duración (detectada automáticamente)
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
                        <input
                          type="text"
                          value={videoDuration}
                          onChange={(e) => setVideoDuration(e.target.value)}
                          placeholder="mm:ss"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2 border-t border-slate-800/60">
                    <button
                      type="button" onClick={onClose}
                      className="flex-1 bg-transparent hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white font-bold text-xs px-4 py-3 rounded-xl transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button" onClick={handleSave} disabled={!canSave}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition active:scale-95 cursor-pointer border-0 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {uploadState === 'uploading' ? `Subiendo ${progress}%...` : 'Añadir Lección'}
                    </button>
                  </div>
                </div>
              )}

              {/* ERROR */}
              {uploadState === 'error' && (
                <div className="border border-rose-500/20 bg-rose-500/5 p-6 rounded-2xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Error al subir el video</p>
                    <p className="text-xs text-slate-500 mt-1">{errorMsg}</p>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Intentar de nuevo
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
