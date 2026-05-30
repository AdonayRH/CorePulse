import React, { useState, useEffect } from 'react'
import { ChapterAccordion } from './ChapterAccordion'
import { ArrowLeft, BookOpen, Trash2, Eye, EyeOff, Save, Film, Clock, Sparkles } from 'lucide-react'

export function CourseDetailView({ 
  course, 
  onBack, 
  onSaveCourseDetails, 
  onDeleteCourse, 
  onTriggerUpload, 
  addToast 
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('hipertrofia')
  const [status, setStatus] = useState('draft')
  const [chapters, setChapters] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form when course prop changes
  useEffect(() => {
    if (course) {
      setTitle(course.title || '')
      setDescription(course.description || '')
      setCategory(course.category || 'hipertrofia')
      setStatus(course.status || 'draft')
      setChapters(course.chapters || [])
    }
  }, [course])

  const handleToggleStatus = () => {
    const nextStatus = status === 'published' ? 'draft' : 'published'
    setStatus(nextStatus)
    addToast(
      nextStatus === 'published' 
        ? '¡Curso publicado! Tus alumnos ya pueden acceder a él.' 
        : 'Curso retirado a borradores.', 
      'success'
    )
  }

  // Calculate course total stats
  const getTotalVideos = () => {
    let count = 0
    chapters.forEach(c => {
      if (c.videos) count += c.videos.length
    })
    return count
  }

  const getTotalDurationMins = () => {
    let totalMinutes = 0
    chapters.forEach(c => {
      if (c.videos) {
        c.videos.forEach(v => {
          const parts = v.duration.split(':')
          const m = parseInt(parts[0]) || 0
          totalMinutes += m
        })
      }
    })
    return totalMinutes
  }

  const handleUpdateChapters = (newChapters) => {
    setChapters(newChapters)
    // Update total duration representation
    const totalMinutes = getTotalDurationMins()
    const hours = Math.floor(totalMinutes / 60)
    const remainingMins = totalMinutes % 60
    const durationStr = hours > 0 ? `${hours}h ${remainingMins}m` : `${remainingMins}m`

    onSaveCourseDetails({
      ...course,
      chapters: newChapters,
      totalDuration: durationStr
    }, false) // Auto-save Chapters state silently or with toast handled in ChapterAccordion
  }

  const handleSaveMetadata = (e) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      addToast('Por favor, completa todos los campos del curso.', 'error')
      return
    }

    setIsSaving(true)
    setTimeout(() => {
      onSaveCourseDetails({
        ...course,
        title: title.trim(),
        description: description.trim(),
        category,
        status,
        chapters // keep current chapters
      }, true) // Save metadata with visual toast
      setIsSaving(false)
    }, 400)
  }

  const isPublished = status === 'published'

  return (
    <div className="space-y-8">
      {/* ─── HEADER ACTION BAR ─── */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-900/60">
        <div className="flex items-center gap-4 text-left">
          <button
            onClick={onBack}
            className="p-2.5 bg-slate-950/40 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white rounded-xl transition duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Editar Curso Académico</span>
            <h1 className="text-xl sm:text-2xl font-black text-white m-0 tracking-tight flex flex-wrap items-center gap-2.5">
              {course.title}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider ${
                isPublished 
                  ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400' 
                  : 'bg-slate-950/60 border-slate-800 text-slate-550'
              }`}>
                <span className={`w-1 h-1 rounded-full ${isPublished ? 'bg-emerald-400' : 'bg-slate-550'}`}></span>
                {isPublished ? 'Publicado' : 'Borrador'}
              </span>
            </h1>
          </div>
        </div>

        {/* Header Options */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          {/* Publish Toggle Button */}
          <button
            onClick={handleToggleStatus}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4.5 py-3 rounded-2xl border text-xs font-bold transition duration-200 cursor-pointer ${
              isPublished
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-550/20'
                : 'bg-slate-900 border-slate-850 hover:border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isPublished ? (
              <>
                <EyeOff className="w-4 h-4 text-emerald-500" />
                Pasar a Borrador
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-purple-400" />
                Publicar Curso
              </>
            )}
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDeleteCourse(course.id)}
            className="px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-450 hover:text-white rounded-2xl text-xs font-bold transition duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Eliminar Curso</span>
          </button>
        </div>
      </section>

      {/* ─── DUAL WORKSPACE PANEL ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: COURSE METADATA FORM */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md text-left">
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Detalles del Curso
            </h3>

            <form onSubmit={handleSaveMetadata} className="space-y-5">
              {/* Title Edit */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Título Académico</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 focus:ring-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 transition duration-200"
                />
              </div>

              {/* Description Edit */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Descripción del Programa</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 focus:ring-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 transition duration-200 resize-none"
                />
              </div>

              {/* Category selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Categoría & Identidad</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 focus:ring-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-1 cursor-pointer"
                >
                  <option value="hipertrofia">Hipertrofia & Culturismo</option>
                  <option value="fuerza">Fuerza & Biomecánica</option>
                  <option value="nutricion">Nutrición Deportiva</option>
                  <option value="defecto">General & Salud</option>
                </select>
              </div>

              {/* Course visual preview explanation */}
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl text-[10px] text-slate-500 leading-relaxed">
                <p>💡 <strong>Nota del Sistema:</strong> El estilo visual y los colores de la carátula se ajustan de manera automatizada en el reproductor del alumno según la categoría elegida.</p>
              </div>

              {/* Save details button */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-650 hover:to-emerald-650 text-white font-extrabold text-xs py-3.5 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/10 active:scale-[0.98] cursor-pointer border-0"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Guardando...' : 'Guardar Información'}
              </button>
            </form>
          </div>

          {/* COURSE STATS PREVIEW PANEL */}
          <div className="bg-slate-900/10 border border-slate-900 p-5 rounded-3xl text-left space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estadísticas del Curso</h4>
            <div className="grid grid-cols-2 gap-4">
              {/* Lecciones count */}
              <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Lecciones</span>
                  <span className="text-sm font-extrabold text-white">{getTotalVideos()} videos</span>
                </div>
              </div>

              {/* Duration count */}
              <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Duración</span>
                  <span className="text-sm font-extrabold text-white">{getTotalDurationMins()} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CHAPTERS ACCORDION MANAGER */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md">
            <ChapterAccordion
              chapters={chapters}
              onUpdateChapters={handleUpdateChapters}
              onTriggerUpload={onTriggerUpload}
              addToast={addToast}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
