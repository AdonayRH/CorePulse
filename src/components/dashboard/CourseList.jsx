import React, { useState, useEffect } from 'react'
import { CourseCard, CourseCardSkeleton } from './CourseCard'
import { BookOpen, Eye, Edit3, Plus, Search, HelpCircle, ArrowRight } from 'lucide-react'

export function CourseList({ 
  courses, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onCreateClick, 
  searchQuery, 
  setSearchQuery 
}) {
  const [activeFilter, setActiveFilter] = useState('all') // 'all', 'published', 'draft'
  const [fakeLoading, setFakeLoading] = useState(false)

  // Trigger fake loading when changing filter/search to give a premium reactive SaaS feel
  useEffect(() => {
    setFakeLoading(true)
    const timer = setTimeout(() => {
      setFakeLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [activeFilter, searchQuery])

  // Filter & Search Logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeFilter === 'all') return matchesSearch
    return matchesSearch && course.status === activeFilter
  })

  // Metric Calculation
  const totalCourses = courses.length
  const publishedCourses = courses.filter((c) => c.status === 'published').length
  const draftCourses = courses.filter((c) => c.status === 'draft').length

  const handleClearFilters = () => {
    setSearchQuery('')
    setActiveFilter('all')
  }

  return (
    <div className="space-y-8">
      {/* ─── OVERVIEW METRICS CARDS ─── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Metric 1 */}
        <div className="bg-slate-900/20 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/3 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Total Cursos</span>
            <span className="text-3xl font-black text-white">{totalCourses}</span>
          </div>
          <div className="w-11 h-11 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/20 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/3 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Publicados</span>
            <span className="text-3xl font-black text-white">{publishedCourses}</span>
          </div>
          <div className="w-11 h-11 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/20 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/3 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Borradores</span>
            <span className="text-3xl font-black text-white">{draftCourses}</span>
          </div>
          <div className="w-11 h-11 bg-slate-900/80 border border-slate-850 rounded-xl flex items-center justify-center text-slate-400">
            <Edit3 className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* ─── FILTERS & CTAS ROW ─── */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-900/60">
        
        {/* Filter Tabs */}
        <div className="inline-flex bg-slate-950 p-1 rounded-2xl border border-slate-850/80 self-start">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-purple-500/15 border border-purple-500/20 text-purple-400 shadow-md'
                : 'text-slate-450 hover:text-slate-200 bg-transparent border-0'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveFilter('published')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeFilter === 'published'
                ? 'bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 shadow-md'
                : 'text-slate-450 hover:text-slate-200 bg-transparent border-0'
            }`}
          >
            Publicados
          </button>
          <button
            onClick={() => setActiveFilter('draft')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeFilter === 'draft'
                ? 'bg-purple-500/15 border border-purple-500/20 text-purple-450 shadow-md'
                : 'text-slate-450 hover:text-slate-200 bg-transparent border-0'
            }`}
          >
            Borradores
          </button>
        </div>

        {/* Create Course Button */}
        <button
          onClick={onCreateClick}
          className="bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-650 hover:to-emerald-650 active:scale-[0.97] text-white font-extrabold text-xs px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-200 cursor-pointer border-0 self-stretch sm:self-auto"
        >
          <Plus className="w-4.5 h-4.5" />
          Crear Nuevo Curso
        </button>
      </section>

      {/* ─── GRID / CARDS AREA ─── */}
      <section className="min-h-[300px]">
        {fakeLoading ? (
          /* Loading skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        ) : filteredCourses.length > 0 ? (
          /* Real courses grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </div>
        ) : (
          /* Premium Empty State */
          <div className="relative rounded-3xl border border-slate-850 p-12 md:p-16 text-center space-y-6 bg-slate-900/10 backdrop-blur-md overflow-hidden max-w-2xl mx-auto">
            {/* Ambient glows inside empty state */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none"></div>

            <div className="w-16 h-16 bg-slate-950/80 border border-slate-850 rounded-2xl flex items-center justify-center mx-auto text-slate-500 shadow-xl">
              <Search className="w-6 h-6 text-slate-500" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">No se encontraron cursos</h3>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto">
                No hay resultados que coincidan con la búsqueda "{searchQuery}" o el filtro seleccionado.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              {searchQuery || activeFilter !== 'all' ? (
                <button
                  onClick={handleClearFilters}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 font-bold text-xs px-5 py-3 rounded-xl transition cursor-pointer"
                >
                  Limpiar Filtros
                </button>
              ) : (
                <button
                  onClick={onCreateClick}
                  className="bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition active:scale-95 flex items-center gap-1.5 cursor-pointer border-0"
                >
                  Crear tu Primer Curso
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
