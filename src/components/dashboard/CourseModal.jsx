import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, Sparkles, Flame, Trophy, Heart } from 'lucide-react'

export function CourseModal({ isOpen, onClose, onSave, courseToEdit = null }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('hipertrofia')
  const [status, setStatus] = useState('draft')
  const [errors, setErrors] = useState({})

  // Fill in data when editing an existing course
  useEffect(() => {
    if (courseToEdit) {
      setTitle(courseToEdit.title || '')
      setDescription(courseToEdit.description || '')
      setCategory(courseToEdit.category || 'hipertrofia')
      setStatus(courseToEdit.status || 'draft')
    } else {
      setTitle('')
      setDescription('')
      setCategory('hipertrofia')
      setStatus('draft')
    }
    setErrors({})
  }, [courseToEdit, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    
    if (!title.trim()) newErrors.title = 'El título es requerido'
    if (title.length > 50) newErrors.title = 'El título no debe exceder 50 caracteres'
    if (!description.trim()) newErrors.description = 'La descripción es requerida'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave({
      id: courseToEdit?.id,
      title: title.trim(),
      description: description.trim(),
      category,
      status,
      chapters: courseToEdit?.chapters || [],
      totalDuration: courseToEdit?.totalDuration || '0m'
    })
    onClose()
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
                  <BookOpen className="w-4 h-4" />
                </span>
                <h2 className="text-xl font-extrabold text-white m-0">
                  {courseToEdit ? 'Editar Datos del Curso' : 'Crear Nuevo Curso'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition duration-200 cursor-pointer border-0 bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Title input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider">Título del Curso</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    if (errors.title) setErrors(prev => ({ ...prev, title: null }))
                  }}
                  placeholder="Ej. Biomecánica Aplicada a la Hipertrofia"
                  className={`w-full bg-slate-950 border ${errors.title ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-850 focus:border-purple-500 focus:ring-purple-500'} rounded-xl px-4 py-3 text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 transition duration-200`}
                />
                {errors.title && <p className="text-xs text-rose-450 font-medium">{errors.title}</p>}
              </div>

              {/* Description input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider">Descripción Corta</label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    if (errors.description) setErrors(prev => ({ ...prev, description: null }))
                  }}
                  rows={3}
                  placeholder="Introduce un resumen atractivo para captar la atención de tus alumnos..."
                  className={`w-full bg-slate-950 border ${errors.description ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-850 focus:border-purple-500 focus:ring-purple-500'} rounded-xl px-4 py-3 text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 transition duration-200 resize-none`}
                />
                {errors.description && <p className="text-xs text-rose-450 font-medium">{errors.description}</p>}
              </div>

              {/* Category Select */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider">Categoría / Estilo Visual</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'hipertrofia', label: 'Hipertrofia', icon: <Flame className="w-4 h-4 text-purple-400" /> },
                    { id: 'fuerza', label: 'Fuerza & Rend.', icon: <Trophy className="w-4 h-4 text-emerald-400" /> },
                    { id: 'nutricion', label: 'Nutrición', icon: <Heart className="w-4 h-4 text-pink-400" /> },
                    { id: 'defecto', label: 'General', icon: <Sparkles className="w-4 h-4 text-blue-400" /> }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        category === cat.id
                          ? 'bg-purple-500/10 border-purple-500/40 text-white'
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                      }`}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider">Estado Inicial</label>
                <div className="flex items-center gap-4 bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                  <div className="flex-1 text-left">
                    <p className="text-xs font-bold text-white">Publicar inmediatamente</p>
                    <p className="text-[10px] text-slate-500">Los alumnos verán el curso al instante si está publicado.</p>
                  </div>
                  
                  {/* Custom Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => setStatus(status === 'published' ? 'draft' : 'published')}
                    className={`w-12 h-6.5 rounded-full p-1 transition duration-300 cursor-pointer border-0 ${
                      status === 'published' ? 'bg-emerald-550' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-4.5 h-4.5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                        status === 'published' ? 'translate-x-5.5' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>
              </div>

              {/* Form Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-transparent hover:bg-slate-850 border border-slate-800 hover:border-slate-750 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl transition duration-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition duration-200 shadow-lg shadow-purple-500/10 active:scale-95 cursor-pointer border-0"
                >
                  {courseToEdit ? 'Guardar Cambios' : 'Crear Curso'}
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
