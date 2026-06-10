import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Plus, Trash2, Edit2, Play, Check, X, Film, Clock, Eye, EyeOff } from 'lucide-react'

export function ChapterAccordion({
  chapters,
  onUpdateChapters,
  onTriggerUpload,
  onPreviewVideo,
  addToast,
}) {
  const [expandedChapterId, setExpandedChapterId] = useState(chapters[0]?.id || null)
  const [editingChapterId, setEditingChapterId] = useState(null)
  const [editingText, setEditingText] = useState('')

  const toggleExpand = (id) => {
    setExpandedChapterId(expandedChapterId === id ? null : id)
  }

  // --- CHAPTER ACTIONS ---
  
  const handleAddChapter = () => {
    const newChapter = {
      id: `chapter-${Date.now()}`,
      title: `Capítulo ${chapters.length + 1}: Nuevo Capítulo`,
      videos: []
    }
    const updated = [...chapters, newChapter]
    onUpdateChapters(updated)
    setExpandedChapterId(newChapter.id)
    addToast('¡Capítulo creado con éxito! Puedes cambiar su título ahora.', 'success')
  }

  const handleDeleteChapter = (chapterId, e) => {
    e.stopPropagation()
    if (confirm('¿Estás seguro de eliminar este capítulo y todos sus videos asociados?')) {
      const updated = chapters.filter(c => c.id !== chapterId)
      onUpdateChapters(updated)
      addToast('Capítulo eliminado correctamente.', 'info')
    }
  }

  const startEditChapter = (chapter, e) => {
    e.stopPropagation()
    setEditingChapterId(chapter.id)
    setEditingText(chapter.title)
  }

  const saveEditChapter = (chapterId, e) => {
    e.stopPropagation()
    if (!editingText.trim()) return
    
    const updated = chapters.map(c => {
      if (c.id === chapterId) {
        return { ...c, title: editingText.trim() }
      }
      return c
    })
    onUpdateChapters(updated)
    setEditingChapterId(null)
    addToast('Título del capítulo actualizado.', 'success')
  }

  const cancelEditChapter = (e) => {
    e.stopPropagation()
    setEditingChapterId(null)
  }

  // --- VIDEO ACTIONS ---

  const handleDeleteVideo = (chapterId, videoId) => {
    if (confirm('¿Deseas eliminar este video del capítulo?')) {
      const updated = chapters.map(c => {
        if (c.id === chapterId) {
          return {
            ...c,
            videos: c.videos.filter(v => v.id !== videoId)
          }
        }
        return c
      })
      onUpdateChapters(updated)
      addToast('Video eliminado del capítulo.', 'info')
    }
  }

  const handleToggleVideoStatus = (chapterId, videoId) => {
    const updated = chapters.map(c => {
      if (c.id === chapterId) {
        return {
          ...c,
          videos: c.videos.map(v => {
            if (v.id === videoId) {
              const newStatus = v.status === 'published' ? 'draft' : 'published'
              addToast(
                newStatus === 'published' 
                  ? 'Video publicado para los estudiantes.' 
                  : 'Video guardado como borrador.', 
                'success'
              )
              return { ...v, status: newStatus }
            }
            return v
          })
        }
      }
      return c
    })
    onUpdateChapters(updated)
  }

  // Calculate duration helper
  const getChapterDuration = (videos) => {
    if (!videos || videos.length === 0) return '0 min'
    let totalMinutes = 0
    videos.forEach(v => {
      const timeParts = v.duration.split(':')
      const mins = parseInt(timeParts[0]) || 0
      totalMinutes += mins
    })
    return `${totalMinutes} min`
  }

  return (
    <div className="space-y-4">
      {/* Chapters Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white uppercase tracking-wider">Plan de Estudios / Módulos</h3>
        <button
          onClick={handleAddChapter}
          className="flex items-center gap-1 px-3.5 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:text-white rounded-xl text-xs font-bold transition duration-200 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Añadir Capítulo
        </button>
      </div>

      {chapters.length === 0 ? (
        /* Empty Chapters view */
        <div className="border border-dashed border-slate-850 p-8 rounded-2xl text-center space-y-4">
          <Film className="w-8 h-8 text-slate-650 mx-auto" />
          <div>
            <p className="text-sm font-bold text-white">No hay capítulos aún</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Crea tu primer capítulo para comenzar a estructurar las lecciones en video de este curso.
            </p>
          </div>
          <button
            onClick={handleAddChapter}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-purple-400 hover:text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Crear Primer Capítulo
          </button>
        </div>
      ) : (
        /* Accordion List */
        <div className="space-y-3">
          {chapters.map((chapter, idx) => {
            const isOpen = expandedChapterId === chapter.id
            const isEditing = editingChapterId === chapter.id

            return (
              <div 
                key={chapter.id}
                className={`bg-slate-950/40 border rounded-2xl transition duration-300 overflow-hidden ${
                  isOpen ? 'border-slate-800 shadow-lg' : 'border-slate-900/60 hover:border-slate-850'
                }`}
              >
                {/* Accordion Trigger/Header */}
                <div
                  onClick={() => toggleExpand(chapter.id)}
                  className="px-5 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/30 transition-colors select-none"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0" onClick={(e) => isEditing && e.stopPropagation()}>
                    {/* Chapter index label */}
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-900 px-2 py-1 rounded-md border border-slate-850/50 flex-shrink-0">
                      MÓD {idx + 1}
                    </span>

                    {isEditing ? (
                      /* Inline Editor text input */
                      <div className="flex items-center gap-2 w-full max-w-md">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="bg-slate-950 border border-purple-500 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none w-full"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditChapter(chapter.id, e)
                            if (e.key === 'Escape') cancelEditChapter(e)
                          }}
                        />
                        <button
                          onClick={(e) => saveEditChapter(chapter.id, e)}
                          className="p-1 text-emerald-400 hover:bg-slate-900 rounded-md border-0 bg-transparent cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={cancelEditChapter}
                          className="p-1 text-rose-450 hover:bg-slate-900 rounded-md border-0 bg-transparent cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      /* Chapter Title Text */
                      <h4 className="text-sm font-bold text-white truncate max-w-xs md:max-w-md m-0">
                        {chapter.title}
                      </h4>
                    )}
                  </div>

                  {/* Actions & expand arrows */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="hidden sm:inline-flex items-center gap-3 text-[10px] font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <Film className="w-3 h-3" />
                        {chapter.videos?.length || 0} videos
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getChapterDuration(chapter.videos)}
                      </span>
                    </span>

                    {/* Action buttons */}
                    {!isEditing && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => startEditChapter(chapter, e)}
                          className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900/80 transition duration-150 cursor-pointer border-0 bg-transparent"
                          title="Editar título"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteChapter(chapter.id, e)}
                          className="p-1.5 text-slate-500 hover:text-rose-450 rounded-lg hover:bg-rose-500/10 transition duration-150 cursor-pointer border-0 bg-transparent"
                          title="Eliminar capítulo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-250 ${isOpen ? 'rotate-180 text-purple-400' : ''}`} />
                  </div>
                </div>

                {/* Collapsible content (Videos list) */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="border-t border-slate-900/60 overflow-hidden bg-slate-950/20"
                    >
                      <div className="px-5 py-4 space-y-4">
                        {/* Videos Subtitle Row */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Videos de la lección</span>
                          <button
                            onClick={() => onTriggerUpload(chapter.id)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg text-[10px] font-extrabold tracking-wider transition duration-150 border-0 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            SUBIR VIDEO
                          </button>
                        </div>

                        {/* Videos List */}
                        {(!chapter.videos || chapter.videos.length === 0) ? (
                          /* No videos inside chapter empty state */
                          <div className="border border-slate-900 p-6 rounded-xl text-center space-y-3 bg-slate-950/40">
                            <p className="text-xs text-slate-550">Este capítulo aún no tiene videos añadidos.</p>
                            <button
                              onClick={() => onTriggerUpload(chapter.id)}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-bold text-slate-350 hover:text-white rounded-lg transition cursor-pointer"
                            >
                              Subir primer video
                            </button>
                          </div>
                        ) : (
                          /* Video cards */
                          <div className="space-y-2">
                            {chapter.videos.map((video, vIdx) => {
                              const vPublished = video.status === 'published'
                              return (
                                <div 
                                  key={video.id}
                                  className="flex items-center justify-between gap-3 p-3 bg-slate-950/80 border border-slate-900/80 rounded-xl hover:border-slate-850 transition duration-200 group/vid"
                                >
                                  {/* Left: Play Icon & Details */}
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-500 group-hover/vid:text-purple-400 transition-colors duration-200">
                                      <Play className="w-3.5 h-3.5 fill-current" />
                                    </div>
                                    <div className="text-left min-w-0">
                                      <p className="text-xs font-bold text-slate-200 truncate group-hover/vid:text-white transition-colors duration-150">
                                        {vIdx + 1}. {video.title}
                                      </p>
                                      <span className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-500 mt-0.5">
                                        <Clock className="w-2.5 h-2.5 text-slate-600" />
                                        {video.duration}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Right: Actions */}
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {/* Preview button — only if video has a real URL */}
                                    {video.video_url && onPreviewVideo && (
                                      <button
                                        onClick={() => onPreviewVideo(video.video_url, video.title)}
                                        className="p-1.5 text-slate-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition duration-150 cursor-pointer border-0 bg-transparent"
                                        title="Ver video"
                                      >
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                      </button>
                                    )}

                                    {/* Publication Status button */}
                                    <button
                                      onClick={() => handleToggleVideoStatus(chapter.id, video.id)}
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase transition duration-150 cursor-pointer ${
                                        vPublished
                                          ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
                                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-350'
                                      }`}
                                      title={vPublished ? 'Ocultar video' : 'Publicar video'}
                                    >
                                      {vPublished ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                                      {vPublished ? 'Púb' : 'Borr'}
                                    </button>

                                    {/* Delete video */}
                                    <button
                                      onClick={() => handleDeleteVideo(chapter.id, video.id)}
                                      className="p-1.5 text-slate-650 hover:text-rose-450 hover:bg-rose-500/10 rounded-lg transition duration-150 border-0 bg-transparent cursor-pointer"
                                      title="Eliminar video"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
