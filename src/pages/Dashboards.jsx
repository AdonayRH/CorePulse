import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Dumbbell, PlayCircle, ArrowLeft, Lock, AlertTriangle, Clock, LogOut } from 'lucide-react'

// --- Dashboard Component Imports ---
import { Navbar } from '../components/dashboard/Navbar'
import { CourseList } from '../components/dashboard/CourseList'
import { CourseDetailView } from '../components/dashboard/CourseDetailView'
import { CourseModal } from '../components/dashboard/CourseModal'
import { VideoUploadModal } from '../components/dashboard/VideoUploadModal'
import { ToastContainer } from '../components/dashboard/Toast'
import { StudentCourseCard } from '../components/dashboard/StudentCourseCard'
import { StudentCourseView } from '../components/dashboard/StudentCourseView'

// --- Initial Mock Data Schema ---
const INITIAL_COURSES = [
  {
    id: 'course-1',
    title: 'Fundamentos de la Hipertrofia Muscular',
    description: 'Programa científico y práctico enfocado en los principios biomecánicos de la hipertrofia muscular y programación del entrenamiento.',
    category: 'hipertrofia',
    status: 'published',
    totalDuration: '57m',
    chapters: [
      {
        id: 'chapter-1-1',
        title: 'Introducción y Biomecánica Básica',
        videos: [
          { id: 'video-1-1-1', title: 'Bienvenida al curso y Metodología', duration: '08:12', status: 'published' },
          { id: 'video-1-1-2', title: 'Mecánica muscular y reclutamiento', duration: '14:20', status: 'published' }
        ]
      },
      {
        id: 'chapter-1-2',
        title: 'Variables del Entrenamiento Eficaz',
        videos: [
          { id: 'video-1-2-1', title: 'Volumen, intensidad y frecuencia de carga', duration: '19:05', status: 'published' },
          { id: 'video-1-2-2', title: 'Selección de ejercicios multiarticulares', duration: '15:45', status: 'published' }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Nutrición Deportiva Avanzada & Déficit',
    description: 'Aprende a estructurar planes macro-nutricionales flexibles, cálculo calórico metabólico y periodización de déficit calórico inteligente.',
    category: 'nutricion',
    status: 'published',
    totalDuration: '40m',
    chapters: [
      {
        id: 'chapter-2-1',
        title: 'Fisiología del Metabolismo Energético',
        videos: [
          { id: 'video-2-1-1', title: 'Cálculo metabólico y distribución de macros', duration: '12:30', status: 'published' },
          { id: 'video-2-1-2', title: 'Estrategias contra la ralentización metabólica', duration: '17:15', status: 'published' }
        ]
      },
      {
        id: 'chapter-2-2',
        title: 'Nutrición Flexible en el Día a Día',
        videos: [
          { id: 'video-2-2-1', title: 'Recetarios saludables y equivalencias', duration: '10:45', status: 'draft' }
        ]
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Biomecánica Práctica en Fuerza de Cargas',
    description: 'Corrección técnica de movimientos básicos: Sentadilla, Press de Banca, Peso Muerto y optimización de palancas óseas.',
    category: 'fuerza',
    status: 'draft',
    totalDuration: '24m',
    chapters: [
      {
        id: 'chapter-3-1',
        title: 'Análisis del Squat (Sentadilla)',
        videos: [
          { id: 'video-3-1-1', title: 'Biomecánica de la articulación de cadera y rodilla', duration: '24:10', status: 'published' }
        ]
      }
    ]
  }
]

const GATE_CONFIG = {
  none: {
    Icon: Lock,
    iconBg: 'bg-purple-500/10',
    iconBorder: 'border-purple-500/30',
    iconText: 'text-purple-400',
    title: 'Activa tu suscripción',
    message: 'Para acceder a los cursos y todo el contenido de entrenamiento necesitas una suscripción activa.',
    ctaLabel: 'Ver planes',
  },
  canceled: {
    Icon: Clock,
    iconBg: 'bg-slate-800/80',
    iconBorder: 'border-slate-700/80',
    iconText: 'text-slate-400',
    title: 'Esperamos volver a verte pronto',
    message: 'Tu suscripción fue cancelada. Puedes reactivarla en cualquier momento y retomar donde lo dejaste.',
    ctaLabel: 'Reactivar suscripción',
  },
  payment_failed: {
    Icon: AlertTriangle,
    iconBg: 'bg-rose-500/10',
    iconBorder: 'border-rose-500/30',
    iconText: 'text-rose-400',
    title: 'Tu suscripción no se ha podido renovar',
    message: 'Hubo un problema al procesar el pago. Actualiza tu método de pago para continuar accediendo al contenido.',
    ctaLabel: 'Actualizar método de pago',
  },
}

const STATUS_LABELS = {
  canceled:  'Cancelada',
  past_due:  'Pago fallido',
  unpaid:    'Sin pago',
  incomplete: 'Incompleto',
}

function getGateKey(subscription) {
  if (!subscription) return 'none'
  if (subscription.status === 'canceled') return 'canceled'
  return 'payment_failed'
}

export function UserDashboard() {
  const { profile, signOut, isTrainer, isAdmin, loading: authLoading } = useAuth()
  const { subscription, loading: subLoading, hasAccess } = useSubscription()

  const [activeTab, setActiveTab] = useState('courses')
  const [activeCourseId, setActiveCourseId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [toasts, setToasts] = useState([])
  const [completedVideos, setCompletedVideos] = useState(() => {
    const saved = localStorage.getItem('corepulse_completed_videos')
    return saved ? JSON.parse(saved) : {}
  })

  const courses = useMemo(() => {
    const saved = localStorage.getItem('corepulse_trainer_courses')
    const all = saved ? JSON.parse(saved) : INITIAL_COURSES
    return all.filter(c => c.status === 'published')
  }, [])

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses
    const q = searchQuery.toLowerCase()
    return courses.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q)
    )
  }, [courses, searchQuery])

  const addToast = (message, type = 'success') => {
    const id = `toast-${Date.now()}`
    setToasts(prev => [...prev, { id, message, type }])
  }
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  // Early return DESPUÉS de todos los hooks
  if (isTrainer || isAdmin) return <TrainerDashboard />

  if (authLoading || subLoading) {
    return (
      <div className="h-full bg-[#090b11] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500/40 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!hasAccess) {
    const gateKey = getGateKey(subscription)
    const { Icon, iconBg, iconBorder, iconText, title, message, ctaLabel } = GATE_CONFIG[gateKey]
    const statusLabel = STATUS_LABELS[subscription?.status]

    return (
      <div className="h-full overflow-y-auto overflow-x-hidden bg-[#090b11] text-slate-100 font-sans relative">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-rose-500/3 rounded-full blur-[150px] -z-10 pointer-events-none" />

        <header className="sticky top-0 z-40 w-full bg-[#090b11]/80 backdrop-blur-xl border-b border-slate-900/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group decoration-none">
              <span className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">C</span>
              <span className="text-xl font-black tracking-tight text-white group-hover:text-purple-400 transition-colors duration-200">
                Core<span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">Pulse</span>
              </span>
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-slate-400 hover:text-rose-400 text-sm font-semibold transition duration-200 cursor-pointer border-0 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </header>

        <div className="flex items-center justify-center min-h-[calc(100svh-80px)] px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full bg-slate-900/30 border border-slate-800/80 backdrop-blur-md rounded-3xl p-8 text-center space-y-6"
          >
            <div className={`w-16 h-16 ${iconBg} border ${iconBorder} rounded-2xl flex items-center justify-center mx-auto`}>
              <Icon className={`w-7 h-7 ${iconText}`} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">{title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
            </div>

            {statusLabel && (
              <div className="flex items-center justify-center gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
                <span className="text-slate-500">Estado de suscripción:</span>
                <span className={gateKey === 'canceled' ? 'text-slate-300 font-bold' : 'text-rose-400 font-bold'}>
                  {statusLabel}
                </span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <Link
                to="/"
                className="block w-full bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl transition duration-200 text-sm decoration-none text-center"
              >
                {ctaLabel}
              </Link>
              <button
                onClick={signOut}
                className="w-full text-slate-500 hover:text-slate-300 text-sm font-semibold py-2 transition duration-200 cursor-pointer border-0 bg-transparent"
              >
                Cerrar sesión
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const activeCourse = courses.find(c => c.id === activeCourseId)

  const getCourseProgress = (course) => {
    const allVideos = course.chapters?.flatMap(ch => ch.videos ?? []) ?? []
    if (allVideos.length === 0) return 0
    const watched = allVideos.filter(v => completedVideos[v.id]).length
    return Math.round((watched / allVideos.length) * 100)
  }

  const handleToggleVideo = (videoId) => {
    setCompletedVideos(prev => {
      const updated = { ...prev, [videoId]: !prev[videoId] }
      localStorage.setItem('corepulse_completed_videos', JSON.stringify(updated))
      return updated
    })
  }

  const totalWatched = Object.values(completedVideos).filter(Boolean).length
  const totalAvailable = courses.reduce(
    (sum, c) => sum + (c.chapters?.reduce((s, ch) => s + (ch.videos?.length ?? 0), 0) ?? 0), 0
  )
  const inProgress = courses.filter(c => {
    const p = getCourseProgress(c)
    return p > 0 && p < 100
  }).length

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-[#090b11] text-slate-100 font-sans relative selection:bg-purple-500 selection:text-white">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-emerald-500/3 rounded-full blur-[150px] -z-10 pointer-events-none" />

      <Navbar
        profile={profile}
        onSignOut={signOut}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab)
          if (tab === 'courses') setActiveCourseId(null)
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        addToast={addToast}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative">
        <AnimatePresence mode="wait">
          {activeCourseId && activeCourse ? (
            <motion.section
              key="course-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <StudentCourseView
                course={activeCourse}
                onBack={() => setActiveCourseId(null)}
                completedVideos={completedVideos}
                onToggleVideo={handleToggleVideo}
              />
            </motion.section>
          ) : (
            <motion.section
              key="courses-list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Welcome */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Hola, <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                      {profile?.full_name?.split(' ')[0] || 'Atleta'}
                    </span> 👋
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">Continúa con tu formación donde lo dejaste.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl self-start sm:self-auto">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-xs font-bold">
                    {subscription?.plan?.name ?? 'Suscripción Activa'}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Cursos Disponibles', value: courses.length, Icon: BookOpen, accent: 'purple' },
                  { label: 'Videos Vistos', value: `${totalWatched}/${totalAvailable}`, Icon: PlayCircle, accent: 'emerald' },
                  { label: 'En Progreso', value: inProgress, Icon: Dumbbell, accent: 'blue' },
                ].map(({ label, value, Icon, accent }) => (
                  <div key={label} className="bg-slate-900/20 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden backdrop-blur-md">
                    <div>
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">{label}</span>
                      <span className="text-3xl font-black text-white">{value}</span>
                    </div>
                    <div className={`w-11 h-11 bg-${accent}-500/10 border border-${accent}-500/30 rounded-xl flex items-center justify-center text-${accent}-400`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Course grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-white">Mis Cursos</h2>
                  <span className="text-xs text-slate-500">{filteredCourses.length} disponibles</span>
                </div>

                {filteredCourses.length === 0 ? (
                  <div className="text-center py-20 bg-slate-900/20 border border-slate-800/80 rounded-3xl">
                    <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold">No hay cursos disponibles</p>
                    <p className="text-slate-600 text-xs mt-1">Los cursos publicados por tu entrenador aparecerán aquí</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                      <StudentCourseCard
                        key={course.id}
                        course={course}
                        progress={getCourseProgress(course)}
                        onView={() => setActiveCourseId(course.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}

export function TrainerDashboard() {
  const { profile, signOut } = useAuth()

  // Tab states: 'courses' or 'exercises'
  const [activeTab, setActiveTab] = useState('courses')
  const [searchQuery, setSearchQuery] = useState('')

  // Custom toast list state
  const [toasts, setToasts] = useState([])

  // Main Courses state, load from localStorage if exists for extreme persistent feeling
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('corepulse_trainer_courses')
    return saved ? JSON.parse(saved) : INITIAL_COURSES
  })

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('corepulse_trainer_courses', JSON.stringify(courses))
  }, [courses])

  // --- MODALS TOGGLES ---
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
  const [selectedCourseForEdit, setSelectedCourseForEdit] = useState(null)

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [activeChapterIdForUpload, setActiveChapterIdForUpload] = useState(null)

  // --- CURRENT VIEW WORKSPACE ---
  // null means showing Course Grid list, otherwise shows course id
  const [activeCourseId, setActiveCourseId] = useState(null)

  // --- TOAST NOTIFICATIONS HELPERS ---
  const addToast = (message, type = 'success') => {
    const id = `toast-${Date.now()}`
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // --- COURSE CRUD OPERATIONS ---

  const handleSaveCourseMetadata = (metadata) => {
    if (metadata.id) {
      // Edit mode
      setCourses((prev) =>
        prev.map((c) => (c.id === metadata.id ? { ...c, ...metadata } : c))
      )
      addToast('¡Datos del curso actualizados con éxito!', 'success')
    } else {
      // Create mode
      const newCourse = {
        ...metadata,
        id: `course-${Date.now()}`,
        chapters: [],
        totalDuration: '0m',
        status: metadata.status || 'draft'
      }
      setCourses((prev) => [newCourse, ...prev])
      addToast('¡Curso creado exitosamente! Edítalo para añadirle videos.', 'success')
    }
    setIsCourseModalOpen(false)
    setSelectedCourseForEdit(null)
  }

  const handleDeleteCourse = (courseId) => {
    if (confirm('¿Estás completamente seguro de que deseas eliminar este curso y todos sus contenidos?')) {
      setCourses((prev) => prev.filter((c) => c.id !== courseId))
      setActiveCourseId(null) // Return to grid
      addToast('Curso eliminado permanentemente.', 'info')
    }
  }

  const handleToggleCourseStatus = (courseId) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const nextStatus = c.status === 'published' ? 'draft' : 'published'
          addToast(
            nextStatus === 'published'
              ? 'Curso publicado correctamente.'
              : 'Curso guardado como borrador.',
            'success'
          )
          return { ...c, status: nextStatus }
        }
        return c
      })
    )
  }

  const handleEditCourseClick = (course) => {
    setActiveCourseId(course.id)
  }

  // Save full course details (metadata & chapters together)
  const handleSaveCourseDetails = (updatedCourse, showToast = true) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
    )
    if (showToast) {
      addToast('¡Cambios guardados con éxito!', 'success')
    }
  }

  // --- VIDEO OPERATIONS ---

  const handleTriggerUpload = (chapterId) => {
    setActiveChapterIdForUpload(chapterId)
    setIsVideoModalOpen(true)
  }

  const handleAddVideoToChapter = (chapterId, videoData) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id === activeCourseId) {
          const updatedChapters = course.chapters.map((chapter) => {
            if (chapter.id === chapterId) {
              return {
                ...chapter,
                videos: [...(chapter.videos || []), videoData]
              }
            }
            return chapter
          })

          // Calculate total duration minutes and format string
          let totalMinutes = 0
          updatedChapters.forEach(c => {
            if (c.videos) {
              c.videos.forEach(v => {
                const parts = v.duration.split(':')
                const m = parseInt(parts[0]) || 0
                totalMinutes += m
              })
            }
          })
          const hrs = Math.floor(totalMinutes / 60)
          const rem = totalMinutes % 60
          const durationStr = hrs > 0 ? `${hrs}h ${rem}m` : `${rem}m`

          return {
            ...course,
            chapters: updatedChapters,
            totalDuration: durationStr
          }
        }
        return course
      })
    )
    addToast('¡Lección de video añadida al capítulo!', 'success')
  }

  // Get active editing course object
  const activeCourse = courses.find((c) => c.id === activeCourseId)

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-[#090b11] text-slate-100 font-sans relative selection:bg-purple-500 selection:text-white">
      {/* ─── DYNAMIC BACKGROUND ORBS ─── */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-emerald-500/3 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-indigo-600/3 rounded-full blur-[130px] -z-10 pointer-events-none"></div>

      {/* ─── TOP HEADER NAVBAR ─── */}
      <Navbar
        profile={profile}
        onSignOut={signOut}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab)
          if (tab === 'courses') setActiveCourseId(null) // return to list when clicking Courses
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        addToast={addToast}
      />

      {/* ─── MAIN DASHBOARD WORKSPACE ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'exercises' ? (
            /* COMING SOON EXERCISES PANEL */
            <motion.section
              key="exercises-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="max-w-2xl mx-auto text-center py-16 space-y-8 relative overflow-hidden rounded-3xl border border-slate-850/60 bg-slate-900/10 backdrop-blur-md p-8 sm:p-12"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none"></div>

              <div className="w-16 h-16 bg-slate-950/80 border border-slate-850 rounded-2xl flex items-center justify-center mx-auto text-purple-400 shadow-2xl">
                <Dumbbell className="w-7 h-7" />
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-black text-white tracking-tight leading-tight m-0">Gestor de Ejercicios & Rutinas</h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold rounded-full uppercase tracking-wider mx-auto">
                  🛠️ En Desarrollo
                </span>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto pt-2">
                  Muy pronto tendrás acceso completo a nuestra videoteca interactiva de musculación para estructurar entrenamientos en bucle y asignar rutinas a tus clientes.
                </p>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setActiveTab('courses')}
                  className="bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-650 hover:to-emerald-650 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition duration-200 active:scale-95 flex items-center gap-2 cursor-pointer border-0 shadow-lg shadow-purple-500/10"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver a Cursos Académicos
                </button>
              </div>
            </motion.section>
          ) : activeCourseId && activeCourse ? (
            /* COURSE DETAIL & CURRICULUM EDIT WORKSPACE */
            <motion.section
              key="detail-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <CourseDetailView
                course={activeCourse}
                onBack={() => setActiveCourseId(null)}
                onSaveCourseDetails={handleSaveCourseDetails}
                onDeleteCourse={handleDeleteCourse}
                onTriggerUpload={handleTriggerUpload}
                addToast={addToast}
              />
            </motion.section>
          ) : (
            /* COURSES MAIN LISTING VIEW */
            <motion.section
              key="list-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <CourseList
                courses={courses}
                onEdit={handleEditCourseClick}
                onDelete={handleDeleteCourse}
                onToggleStatus={handleToggleCourseStatus}
                onCreateClick={() => {
                  setSelectedCourseForEdit(null)
                  setIsCourseModalOpen(true)
                }}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* ─── FLOATING TOAST FEEDBACK NOTIFICATIONS ─── */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* ─── DIALOG MODALS ─── */}

      {/* Course Create/Edit Metadata Modal */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => {
          setIsCourseModalOpen(false)
          setSelectedCourseForEdit(null)
        }}
        onSave={handleSaveCourseMetadata}
        courseToEdit={selectedCourseForEdit}
      />

      {/* Drag & Drop video uploader */}
      <VideoUploadModal
        isOpen={isVideoModalOpen}
        onClose={() => {
          setIsVideoModalOpen(false)
          setActiveChapterIdForUpload(null)
        }}
        onAddVideo={handleAddVideoToChapter}
        chapterId={activeChapterIdForUpload}
        courseId={activeCourseId}
        userId={profile?.id}
        addToast={addToast}
      />
    </div>
  )
}

export function AdminDashboard() {
  const { profile, signOut } = useAuth()
  return (
    <div className="h-full overflow-y-auto bg-[#090b11] text-white flex flex-col justify-center items-center p-8 relative overflow-x-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-650/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-slate-900/30 border border-slate-800/80 backdrop-blur-md rounded-3xl p-8 text-center shadow-2xl space-y-6 relative z-10">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 text-2xl font-black">
          A
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">Consola del Administrador</h1>
        <p className="text-slate-400 text-sm">
          Hola, <span className="text-emerald-400 font-bold">{profile?.full_name || 'Admin'}</span>. Estás en la terminal root.
        </p>

        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850/60 text-left space-y-2 text-xs text-slate-350">
          <p><strong>Rol:</strong> root_admin</p>
          <p><strong>Configuración global:</strong> Supabase DB Conectada ⚡</p>
          <p className="text-[10px] text-slate-500">
            * Para gestionar contenidos, puedes ir a la vista de Trainer.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link to="/trainer" className="w-full bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl transition duration-200 text-center text-xs decoration-none">
            Ir a Panel de Trainer
          </Link>
          <button
            onClick={signOut}
            className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-450 hover:text-white font-bold py-3.5 px-4 rounded-xl transition duration-200 text-xs cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}
