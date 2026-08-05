import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock, Dumbbell, X, ChevronRight, Timer } from 'lucide-react'
import { MUSCLE_GROUP_STYLE } from './RoutineCard'

// ─── Exercise detail modal ────────────────────────────────────────────────────

function ExerciseModal({ exercise, onClose }) {
  const [imgError, setImgError] = useState(false)

  const totalVolume = exercise.sets.reduce((sum, s) => sum + (s.reps * s.weight), 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
        onClick={e => e.stopPropagation()}
        className="bg-[#0d1117] border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92svh] overflow-y-auto shadow-2xl shadow-black"
      >
        {/* GIF / Placeholder */}
        <div className="relative bg-slate-900/60 rounded-t-3xl sm:rounded-t-2xl overflow-hidden aspect-[4/3]">
          {exercise.gifUrl && !imgError ? (
            <img
              src={exercise.gifUrl}
              alt={exercise.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6">
              <div className="w-20 h-20 bg-slate-800/80 border border-slate-700/60 rounded-2xl flex items-center justify-center">
                <Dumbbell className="w-9 h-9 text-slate-500" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-slate-500 text-xs font-semibold">Sin GIF disponible</p>
                <p className="text-slate-700 text-[10px]">El entrenador puede añadir un video o GIF próximamente</p>
              </div>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-black/80 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Name + muscle groups */}
          <div className="space-y-2.5">
            <h2 className="text-xl font-black text-white leading-tight">{exercise.name}</h2>
            {exercise.muscleGroups?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {exercise.muscleGroups.map(m => {
                  const s = MUSCLE_GROUP_STYLE[m] ?? { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' }
                  return (
                    <span key={m} className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${s.bg} border ${s.border} ${s.color}`}>
                      {m}
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* Sets table */}
          {exercise.sets?.length > 0 && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-3 text-center py-2.5 border-b border-slate-800/60">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Serie</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Reps</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Peso</span>
              </div>
              {exercise.sets.map((set, i) => (
                <div key={i} className={`grid grid-cols-3 text-center py-3 ${i < exercise.sets.length - 1 ? 'border-b border-slate-900/60' : ''}`}>
                  <span className="text-xs font-black text-slate-500">{i + 1}</span>
                  <span className="text-sm font-black text-white">{set.reps}</span>
                  <span className="text-sm font-black text-white">
                    {set.weight > 0 ? `${set.weight} kg` : '—'}
                  </span>
                </div>
              ))}
              {totalVolume > 0 && (
                <div className="border-t border-slate-800/60 py-2.5 px-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-600">Volumen total</span>
                  <span className="text-xs font-black text-purple-400">{totalVolume.toFixed(0)} kg</span>
                </div>
              )}
            </div>
          )}

          {/* Rest + notes */}
          <div className="flex flex-wrap gap-3">
            {exercise.restSeconds > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/40 border border-slate-800/60 rounded-xl">
                <Timer className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-bold text-slate-300">
                  {exercise.restSeconds >= 60
                    ? `${Math.floor(exercise.restSeconds / 60)} min ${exercise.restSeconds % 60 > 0 ? `${exercise.restSeconds % 60}s` : ''} descanso`
                    : `${exercise.restSeconds}s descanso`}
                </span>
              </div>
            )}
          </div>

          {exercise.notes && (
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4">
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-wider mb-2">Técnica & Notas</p>
              <p className="text-xs text-slate-300 leading-relaxed">{exercise.notes}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main user routine view ───────────────────────────────────────────────────

export function UserRoutineView({ routine, onBack }) {
  const [activeExercise, setActiveExercise] = useState(null)

  const totalSets    = routine.exercises.reduce((sum, e) => sum + (e.sets?.length || 0), 0)
  const allMuscles   = [...new Set(routine.exercises.flatMap(e => e.muscleGroups || []))]
  const estimatedMin = routine.exercises.reduce((sum, e) => {
    const setsTime = (e.sets?.length || 0) * 0.5
    const restTime = ((e.sets?.length || 0) - 1) * ((e.restSeconds || 60) / 60)
    return sum + setsTime + restTime
  }, 0)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        className="space-y-8 max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            className="mt-1 p-2 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{routine.name}</h1>
            {routine.description && (
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">{routine.description}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-3 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5" />
                {routine.exercises.length} ejercicio{routine.exercises.length !== 1 ? 's' : ''}
              </span>
              {totalSets > 0 && (
                <span>{totalSets} series</span>
              )}
              {estimatedMin > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  ~{Math.round(estimatedMin)} min
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Muscle group summary */}
        {allMuscles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allMuscles.map(m => {
              const s = MUSCLE_GROUP_STYLE[m] ?? { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' }
              return (
                <span key={m} className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${s.bg} border ${s.border} ${s.color}`}>
                  {m}
                </span>
              )
            })}
          </div>
        )}

        {/* Exercise list */}
        <div className="space-y-3">
          {routine.exercises.map((ex, idx) => {
            const totalVolume = ex.sets?.reduce((sum, s) => sum + (s.reps * s.weight), 0) || 0
            return (
              <motion.button
                key={ex.id || idx}
                onClick={() => setActiveExercise(ex)}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
                className="w-full flex items-center gap-4 p-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl text-left cursor-pointer hover:border-purple-500/30 transition-colors group"
              >
                <span className="w-9 h-9 flex-shrink-0 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-sm font-black text-purple-400">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-white">{ex.name || 'Ejercicio sin nombre'}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {ex.muscleGroups?.slice(0, 3).map(m => {
                      const s = MUSCLE_GROUP_STYLE[m] ?? { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' }
                      return (
                        <span key={m} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${s.bg} border ${s.border} ${s.color}`}>
                          {m}
                        </span>
                      )
                    })}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-black text-white">{ex.sets?.length || 0} series</p>
                  {totalVolume > 0 && (
                    <p className="text-[10px] text-slate-500 mt-0.5">{totalVolume.toFixed(0)} kg vol.</p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-purple-400 transition-colors flex-shrink-0" />
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Exercise modal */}
      <AnimatePresence>
        {activeExercise && (
          <ExerciseModal
            exercise={activeExercise}
            onClose={() => setActiveExercise(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
