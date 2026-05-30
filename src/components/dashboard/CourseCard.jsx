import React, { useState, useRef, useEffect } from 'react'
import { BookOpen, Clock, MoreVertical, Edit, Trash2, Eye, EyeOff, Sparkles, Flame, Trophy, Heart } from 'lucide-react'

// Course category icon helper
const getCategoryIcon = (category) => {
  const list = {
    hipertrofia: <Flame className="w-6 h-6 text-purple-400" />,
    fuerza: <Trophy className="w-6 h-6 text-emerald-400" />,
    nutricion: <Heart className="w-6 h-6 text-pink-400" />,
    defecto: <Sparkles className="w-6 h-6 text-blue-400" />
  }
  return list[category?.toLowerCase()] || list.defecto
}

// Course category gradient helper
const getCategoryGradient = (category) => {
  const gradients = {
    hipertrofia: 'from-purple-600/30 to-indigo-600/20 text-purple-400 border-purple-500/20',
    fuerza: 'from-emerald-600/30 to-teal-600/20 text-emerald-400 border-emerald-500/20',
    nutricion: 'from-rose-600/30 to-pink-600/20 text-pink-400 border-pink-500/20',
    defecto: 'from-blue-600/30 to-cyan-600/20 text-blue-400 border-blue-500/20'
  }
  return gradients[category?.toLowerCase()] || gradients.defecto
}

export function CourseCard({ course, onEdit, onDelete, onToggleStatus }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const category = course.category || 'defecto'
  const isPublished = course.status === 'published'

  return (
    <article className="bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/2 rounded-3xl p-5 transition-all duration-300 relative overflow-hidden group flex flex-col h-full text-left">
      {/* Decorative subtle top gradient blob */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${isPublished ? 'from-emerald-500/5' : 'from-purple-500/5'} rounded-full blur-2xl pointer-events-none`}></div>
      
      {/* Thumbnail Cover */}
      <div className={`w-full h-44 bg-gradient-to-br ${getCategoryGradient(category)} border border-slate-800/50 rounded-2xl relative overflow-hidden flex items-center justify-center mb-5 group-hover:scale-[1.02] transition-transform duration-300`}>
        {/* Glow center */}
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] -z-10"></div>
        <div className="w-14 h-14 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-center shadow-xl">
          {getCategoryIcon(category)}
        </div>

        {/* Floating status tag */}
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md ${
          isPublished 
            ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400' 
            : 'bg-slate-950/60 border-slate-800 text-slate-400'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
          {isPublished ? 'Publicado' : 'Borrador'}
        </span>

        {/* Floating category tag */}
        <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg border border-slate-800 bg-slate-950/70 text-[9px] font-bold text-slate-400 capitalize">
          {category}
        </span>
      </div>

      {/* Title & Options trigger */}
      <div className="flex justify-between items-start gap-2 mb-2 relative">
        <h3 className="text-lg font-bold text-white leading-snug group-hover:text-purple-400 transition-colors duration-200 line-clamp-1 flex-1">
          {course.title}
        </h3>

        {/* Triple Dot Dropdown */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-1 text-slate-500 hover:text-white hover:bg-slate-900 rounded-lg transition duration-200 cursor-pointer border-0 bg-transparent"
          >
            <MoreVertical className="w-4.5 h-4.5" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-44 rounded-xl bg-slate-950 border border-slate-850 shadow-2xl overflow-hidden py-1 z-10">
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  onEdit(course)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 transition border-0 bg-transparent text-left cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                Editar Curso
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  onToggleStatus(course.id)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 transition border-0 bg-transparent text-left cursor-pointer"
              >
                {isPublished ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-slate-450" />
                    Pasar a Borrador
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    Publicar Curso
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  onDelete(course.id)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-450 hover:bg-rose-500/10 transition border-0 bg-transparent text-left cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar Curso
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-6 flex-1">
        {course.description || 'Sin descripción detallada disponible.'}
      </p>

      {/* Footer details */}
      <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between text-slate-500 text-[11px] font-bold">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-purple-500/70" />
            {course.chapters?.length || 0} {course.chapters?.length === 1 ? 'Capítulo' : 'Capítulos'}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-500/70" />
            {course.totalDuration || '0m'}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onEdit(course)}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/20 text-[10px] font-extrabold tracking-wider text-purple-400 hover:text-white rounded-lg transition duration-200 cursor-pointer"
        >
          EDITAR
        </button>
      </div>
    </article>
  )
}

// Shimmer Loading Skeleton
export function CourseCardSkeleton() {
  return (
    <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-5 flex flex-col h-full animate-pulse text-left">
      <div className="w-full h-44 bg-slate-950/60 border border-slate-900 rounded-2xl mb-5 flex items-center justify-center relative">
        <div className="w-14 h-14 bg-slate-900 rounded-2xl"></div>
      </div>
      <div className="h-5 bg-slate-900 rounded-md w-3/4 mb-3"></div>
      <div className="h-3 bg-slate-900 rounded-md w-full mb-2"></div>
      <div className="h-3 bg-slate-900 rounded-md w-5/6 mb-6"></div>
      <div className="pt-4 border-t border-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-4 w-1/2">
          <div className="h-3 bg-slate-900 rounded w-10"></div>
          <div className="h-3 bg-slate-900 rounded w-10"></div>
        </div>
        <div className="h-7 bg-slate-900 rounded-lg w-16"></div>
      </div>
    </div>
  )
}
