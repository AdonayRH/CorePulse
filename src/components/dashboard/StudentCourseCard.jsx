import { motion } from 'framer-motion'
import { BookOpen, Clock, PlayCircle, ChevronRight, Flame, Heart, Dumbbell } from 'lucide-react'

const CATEGORY_CONFIG = {
  hipertrofia: {
    gradient: 'from-purple-600/30 to-indigo-600/20',
    Icon: Flame,
    iconColor: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  nutricion: {
    gradient: 'from-rose-600/30 to-pink-600/20',
    Icon: Heart,
    iconColor: 'text-pink-400',
    border: 'border-pink-500/20',
  },
  fuerza: {
    gradient: 'from-orange-600/30 to-amber-600/20',
    Icon: Dumbbell,
    iconColor: 'text-orange-400',
    border: 'border-orange-500/20',
  },
}

const DEFAULT_CONFIG = {
  gradient: 'from-blue-600/30 to-cyan-600/20',
  Icon: BookOpen,
  iconColor: 'text-blue-400',
  border: 'border-blue-500/20',
}

export function StudentCourseCard({ course, progress = 0, onView }) {
  const config = CATEGORY_CONFIG[course.category] ?? DEFAULT_CONFIG
  const { Icon } = config
  const totalVideos = course.chapters?.reduce((sum, ch) => sum + (ch.videos?.length ?? 0), 0) ?? 0

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/5 rounded-3xl p-5 transition-all duration-300 relative overflow-hidden group flex flex-col h-full"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Cover */}
      <div className={`w-full h-44 bg-gradient-to-br ${config.gradient} ${config.border} border border-slate-800/50 rounded-2xl relative overflow-hidden flex items-center justify-center mb-5 group-hover:scale-[1.02] transition-transform duration-300`}>
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] -z-10" />
        <div className="w-14 h-14 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-center shadow-xl">
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg border border-slate-800 bg-slate-950/70 text-[9px] font-bold text-slate-400 capitalize">
          {course.category}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-base font-bold text-white leading-snug group-hover:text-purple-400 transition-colors duration-200 line-clamp-1 mb-2">
        {course.title}
      </h3>
      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
        {course.description}
      </p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1.5">
          <span>{progress > 0 ? 'En progreso' : 'Sin comenzar'}</span>
          <span className={progress > 0 ? 'text-purple-400' : 'text-slate-600'}>{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full"
          />
        </div>
      </div>

      {/* Meta + CTA */}
      <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between text-[11px] font-bold text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-purple-500/70" />
            {course.chapters?.length ?? 0} caps.
          </span>
          <span className="flex items-center gap-1.5">
            <PlayCircle className="w-3.5 h-3.5 text-emerald-500/70" />
            {totalVideos} videos
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-500/70" />
            {course.totalDuration}
          </span>
        </div>
        <button
          onClick={onView}
          className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 hover:text-white text-[10px] font-extrabold tracking-wider rounded-lg transition duration-200 cursor-pointer"
        >
          VER <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </motion.article>
  )
}
