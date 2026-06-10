import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ChevronDown, PlayCircle, CheckCircle2,
  Clock, BookOpen, Trophy, BarChart2
} from 'lucide-react'
import { VideoPlayerModal } from './VideoPlayerModal'

export function StudentCourseView({ course, onBack, completedVideos, onToggleVideo }) {
  const [openChapters, setOpenChapters] = useState(
    course.chapters?.length > 0 ? [course.chapters[0].id] : []
  )
  const [playerVideo, setPlayerVideo] = useState(null) // { url, title } | null

  const allVideos = course.chapters?.flatMap(ch => ch.videos ?? []) ?? []
  const totalVideos = allVideos.length
  const watchedCount = allVideos.filter(v => completedVideos[v.id]).length
  const progress = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0
  const isCompleted = totalVideos > 0 && watchedCount === totalVideos

  const toggleChapter = (id) =>
    setOpenChapters(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )

  const handlePlayVideo = (video) => {
    if (video.video_url) {
      setPlayerVideo({ url: video.video_url, title: video.title })
      // Auto-mark as watched when the user opens the player
      if (!completedVideos[video.id]) onToggleVideo(video.id)
    } else {
      // No real URL yet — just toggle watched state
      onToggleVideo(video.id)
    }
  }

  const STATS = [
    { label: 'Capítulos', value: course.chapters?.length ?? 0, Icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Videos', value: totalVideos, Icon: PlayCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Duración', value: course.totalDuration, Icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Vistos', value: `${watchedCount}/${totalVideos}`, Icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  ]

  return (
    <div className="space-y-8 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={onBack}
          className="mt-1 p-2 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-white transition duration-200 cursor-pointer flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 capitalize">
            {course.category}
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{course.title}</h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">{course.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map(({ label, value, Icon, color, bg, border }) => (
          <div key={label} className={`bg-slate-900/20 border ${border} rounded-2xl p-4 flex items-center gap-3`}>
            <div className={`w-9 h-9 ${bg} border ${border} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{label}</p>
              <p className="text-white font-black text-sm">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-white">Progreso del curso</span>
          </div>
          <span className="text-sm font-black text-purple-400">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full"
          />
        </div>
        <p className="text-[10px] text-slate-500 mt-2">
          {isCompleted
            ? '🎉 ¡Curso completado! Enhorabuena.'
            : `${totalVideos - watchedCount} videos restantes para completar el curso`}
        </p>
      </div>

      {/* Chapters accordion */}
      <div className="space-y-3">
        <h2 className="text-lg font-black text-white">Contenido del Curso</h2>

        {course.chapters?.map((chapter, chIdx) => {
          const isOpen = openChapters.includes(chapter.id)
          const chWatched = chapter.videos?.filter(v => completedVideos[v.id]).length ?? 0
          const chTotal = chapter.videos?.length ?? 0

          return (
            <div key={chapter.id} className="bg-slate-900/20 border border-slate-800/80 rounded-2xl overflow-hidden">

              {/* Chapter header */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-800/20 transition duration-200 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center text-xs font-black text-slate-400 flex-shrink-0">
                    {chIdx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{chapter.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{chWatched}/{chTotal} completados</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 flex-shrink-0 ml-3 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Videos list */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden border-t border-slate-800/60"
                  >
                    <div className="p-4 space-y-2">
                      {chapter.videos?.map((video, vIdx) => {
                        const watched = completedVideos[video.id]
                        const hasUrl = !!video.video_url

                        return (
                          <div
                            key={video.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition duration-200 ${
                              watched
                                ? 'bg-emerald-500/5 border-emerald-500/10'
                                : 'bg-slate-950/40 border-slate-800/40 hover:border-slate-700/60'
                            }`}
                          >
                            {/* Play / check toggle */}
                            <button
                              onClick={() => handlePlayVideo(video)}
                              className={`flex-shrink-0 transition duration-200 cursor-pointer border-0 bg-transparent p-0 ${
                                watched ? 'text-emerald-400' : 'text-slate-500 hover:text-purple-400'
                              }`}
                              title={hasUrl ? 'Ver video' : 'Marcar como visto'}
                            >
                              {watched
                                ? <CheckCircle2 className="w-5 h-5" />
                                : <PlayCircle className="w-5 h-5" />
                              }
                            </button>

                            {/* Title — clickable if has URL */}
                            <p
                              onClick={() => hasUrl && handlePlayVideo(video)}
                              className={`flex-1 text-xs font-semibold min-w-0 truncate ${
                                hasUrl ? 'cursor-pointer hover:text-purple-300' : ''
                              } ${watched ? 'text-slate-500 line-through' : 'text-white'}`}
                            >
                              {vIdx + 1}. {video.title}
                            </p>

                            {/* Duration + watched toggle (independent) */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                                <Clock className="w-3 h-3" />
                                {video.duration}
                              </span>
                              {/* Manual toggle for watched state, separate from play */}
                              <button
                                onClick={(e) => { e.stopPropagation(); onToggleVideo(video.id) }}
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition cursor-pointer ${
                                  watched
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400'
                                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                                }`}
                                title={watched ? 'Marcar como no visto' : 'Marcar como visto'}
                              >
                                {watched ? '✓' : '○'}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )
        })}
      </div>

      <VideoPlayerModal
        isOpen={!!playerVideo}
        onClose={() => setPlayerVideo(null)}
        videoUrl={playerVideo?.url}
        title={playerVideo?.title}
      />
    </div>
  )
}
