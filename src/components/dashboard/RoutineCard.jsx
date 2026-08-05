import { motion } from 'framer-motion'
import { Edit2, Trash2, Eye, EyeOff, Dumbbell } from 'lucide-react'

export const MUSCLE_GROUP_STYLE = {
  'Pecho':           { color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20'   },
  'Espalda':         { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  'Hombros':         { color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20'    },
  'Bíceps':          { color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20'  },
  'Tríceps':         { color: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/20'    },
  'Cuádriceps':      { color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20'    },
  'Isquiotibiales':  { color: 'text-indigo-400',  bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20'  },
  'Glúteos':         { color: 'text-pink-400',    bg: 'bg-pink-500/10',    border: 'border-pink-500/20'    },
  'Gemelos':         { color: 'text-teal-400',    bg: 'bg-teal-500/10',    border: 'border-teal-500/20'    },
  'Abdominales':     { color: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/20'  },
  'Antebrazos':      { color: 'text-slate-400',   bg: 'bg-slate-500/10',   border: 'border-slate-500/20'   },
  'Trapecio':        { color: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20'  },
}

export const MUSCLE_GROUPS_LIST = Object.keys(MUSCLE_GROUP_STYLE)

export function RoutineCard({ routine, onEdit, onDelete, onToggleStatus }) {
  const allMuscles = [...new Set(routine.exercises.flatMap(e => e.muscleGroups || []))]
  const totalSets = routine.exercises.reduce((sum, e) => sum + (e.sets?.length || 0), 0)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-slate-900/30 border border-slate-800/80 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-4 hover:border-slate-700/80 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
              routine.status === 'published'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800/80 border-slate-700/60 text-slate-500'
            }`}>
              {routine.status === 'published' ? 'Publicada' : 'Borrador'}
            </span>
          </div>
          <h3 className="text-sm font-black text-white leading-snug line-clamp-2">{routine.name}</h3>
        </div>
        <div className="w-10 h-10 flex-shrink-0 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
          <Dumbbell className="w-4.5 h-4.5 text-purple-400" />
        </div>
      </div>

      {routine.description && (
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed -mt-1">{routine.description}</p>
      )}

      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
        <span>{routine.exercises.length} ejercicio{routine.exercises.length !== 1 ? 's' : ''}</span>
        {totalSets > 0 && <span>·</span>}
        {totalSets > 0 && <span>{totalSets} series totales</span>}
      </div>

      {allMuscles.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allMuscles.slice(0, 5).map(m => {
            const s = MUSCLE_GROUP_STYLE[m] ?? MUSCLE_GROUP_STYLE['Hombros']
            return (
              <span key={m} className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${s.bg} border ${s.border} ${s.color}`}>
                {m}
              </span>
            )
          })}
          {allMuscles.length > 5 && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/40 text-slate-500">
              +{allMuscles.length - 5}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition cursor-pointer border-0 bg-transparent"
        >
          <Edit2 className="w-3.5 h-3.5" /> Editar
        </button>
        <button
          onClick={() => onToggleStatus(routine.id)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold rounded-xl transition cursor-pointer border-0 bg-transparent ${
            routine.status === 'published'
              ? 'text-slate-400 hover:text-amber-400 hover:bg-amber-500/5'
              : 'text-emerald-400 hover:bg-emerald-500/10'
          }`}
        >
          {routine.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {routine.status === 'published' ? 'Retirar' : 'Publicar'}
        </button>
        <button
          onClick={() => onDelete(routine.id)}
          className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer border-0 bg-transparent"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}
