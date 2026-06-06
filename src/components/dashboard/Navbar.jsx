import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Search, LogOut, User, BookOpen, Dumbbell, ChevronDown } from 'lucide-react'
import { ProfileModal } from './ProfileModal'
import { Logo } from '../Logo'

export function Navbar({ 
  profile, 
  onSignOut, 
  activeTab, 
  setActiveTab, 
  searchQuery, 
  setSearchQuery, 
  addToast 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const profileMenuRef = useRef(null)

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExercisesClick = () => {
    if (addToast) {
      addToast('Módulo de Ejercicios en desarrollo. ¡Pronto disponible para tus alumnos!', 'info')
    }
    setActiveTab('exercises')
    setMobileMenuOpen(false)
  }

  const handleCoursesClick = () => {
    setActiveTab('courses')
    setMobileMenuOpen(false)
  }

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (profile?.full_name) {
      const parts = profile.full_name.split(' ')
      if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return profile.full_name.substring(0, 2).toUpperCase()
    }
    return 'TR'
  }

  return (
    <>
    <header className="sticky top-0 z-40 w-full bg-[#090b11]/80 backdrop-blur-xl border-b border-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex-shrink-0 decoration-none">
            <Logo size="md" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={handleCoursesClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border-0 bg-transparent ${
                activeTab === 'courses'
                  ? 'bg-purple-500/10 text-purple-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Cursos
            </button>
            <button
              onClick={handleExercisesClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border-0 bg-transparent ${
                activeTab === 'exercises'
                  ? 'bg-purple-500/10 text-purple-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              Ejercicios
            </button>
          </nav>
        </div>

        {/* Global Search Bar */}
        <div className="hidden sm:block flex-1 max-w-md relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-purple-500 rounded-2xl pl-10 pr-4 py-2 text-sm text-slate-250 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-purple-500 transition duration-200"
          />
        </div>

        {/* Right Nav Options (User avatar & Mobile toggle) */}
        <div className="flex items-center gap-4">
          
          {/* User Profile Dropdown Button */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2.5 p-1 rounded-2xl border border-slate-900 bg-slate-950/40 hover:bg-slate-900/80 transition duration-200 cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500/20 to-emerald-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-xs text-purple-400">
                {getInitials()}
              </div>
              <div className="hidden lg:block pr-1">
                <p className="text-xs font-bold text-white leading-tight truncate max-w-[100px]">
                  {profile?.full_name || 'Entrenador'}
                </p>
                <span className="text-[10px] font-semibold text-slate-500">
                  {profile?.role || 'trainer'}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-slate-950 border border-slate-850 shadow-2xl shadow-black/80 overflow-hidden py-1.5 z-50">
                <div className="px-4 py-3 border-b border-slate-900">
                  <p className="text-sm font-bold text-white truncate">{profile?.full_name || 'Miembro Entrenador'}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{profile?.email || 'trainer@corepulse.com'}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    Instructor
                  </div>
                </div>

                <div className="p-1">
                  <button
                    onClick={() => { setProfileMenuOpen(false); setProfileModalOpen(true) }}
                    className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition duration-150 cursor-pointer border-0 bg-transparent text-left"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    Editar Perfil
                  </button>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false)
                      onSignOut()
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition duration-150 cursor-pointer border-0 bg-transparent text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-850 bg-slate-950/40 text-slate-400 hover:text-white hover:bg-slate-900 transition duration-200 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-900 bg-[#090b11] px-4 py-6 space-y-6 animate-fadeIn">
          {/* Search bar on mobile */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-purple-500 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-purple-500 transition duration-200"
            />
          </div>

          {/* Mobile links */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={handleCoursesClick}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-bold transition duration-200 cursor-pointer border-0 w-full text-left bg-transparent ${
                activeTab === 'courses'
                  ? 'bg-purple-500/10 text-purple-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Cursos
            </button>
            <button
              onClick={handleExercisesClick}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-bold transition duration-200 cursor-pointer border-0 w-full text-left bg-transparent ${
                activeTab === 'exercises'
                  ? 'bg-purple-500/10 text-purple-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Dumbbell className="w-5 h-5" />
              Ejercicios
            </button>
          </nav>
        </div>
      )}
    </header>

    <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </>
  )
}
