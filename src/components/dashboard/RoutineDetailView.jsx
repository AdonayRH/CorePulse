import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, Save, Users } from 'lucide-react'
import { MUSCLE_GROUP_STYLE, MUSCLE_GROUPS_LIST } from './RoutineCard'
import { getAssignableUsers } from '../../lib/recipes'
import { getRoutineAssignments, assignRoutineToUser, unassignRoutineFromUser } from '../../lib/routines'

function newExercise() {
  return {
    id: crypto.randomUUID(),
    name: '',
    muscleGroups: [],
    sets: [{ reps: 12, weight: 0 }],
    restSeconds: 60,
    gifUrl: '',
    notes: '',
  }
}

export function RoutineDetailView({ routine, onBack, onSave, onDelete, addToast }) {
  const [form, setForm] = useState({
    name:        routine.name,
    description: routine.description,
    status:      routine.status,
    exercises:   routine.exercises,
  })

  // ─── Assignments ─────────────────────────────────────────────────────────────
  const [assignableUsers, setAssignableUsers]   = useState([])
  const [assignedIds, setAssignedIds]           = useState(new Set())
  const [assignmentLoading, setAssignmentLoading] = useState(true)
  const [togglingUser, setTogglingUser]         = useState(null)

  useEffect(() => {
    if (!routine.id) return
    Promise.all([getAssignableUsers(), getRoutineAssignments(routine.id)])
      .then(([users, ids]) => {
        setAssignableUsers(users)
        setAssignedIds(new Set(ids))
      })
      .catch(() => {})
      .finally(() => setAssignmentLoading(false))
  }, [routine.id])

  const handleToggleAssignment = async (userId) => {
    if (togglingUser) return
    setTogglingUser(userId)
    const isAssigned = assignedIds.has(userId)
    setAssignedIds(prev => {
      const next = new Set(prev)
      isAssigned ? next.delete(userId) : next.add(userId)
      return next
    })
    try {
      if (isAssigned) {
        await unassignRoutineFromUser(routine.id, userId)
      } else {
        await assignRoutineToUser(routine.id, userId, routine.trainerId)
      }
    } catch {
      setAssignedIds(prev => {
        const next = new Set(prev)
        isAssigned ? next.add(userId) : next.delete(userId)
        return next
      })
      addToast('Error al actualizar asignación', 'error')
    } finally {
      setTogglingUser(null)
    }
  }

  // ─── Exercises ───────────────────────────────────────────────────────────────
  const updateExercise = (idx, patch) =>
    setForm(f => ({ ...f, exercises: f.exercises.map((e, i) => i === idx ? { ...e, ...patch } : e) }))

  const moveExercise = (idx, dir) => {
    setForm(f => {
      const arr = [...f.exercises]
      const target = idx + dir
      if (target < 0 || target >= arr.length) return f;
      [arr[idx], arr[target]] = [arr[target], arr[idx]]
      return { ...f, exercises: arr }
    })
  }

  const removeExercise = (idx) =>
    setForm(f => ({ ...f, exercises: f.exercises.filter((_, i) => i !== idx) }))

  const addSet = (idx) =>
    updateExercise(idx, { sets: [...form.exercises[idx].sets, { reps: 10, weight: 0 }] })

  const updateSet = (exIdx, setIdx, patch) =>
    updateExercise(exIdx, {
      sets: form.exercises[exIdx].sets.map((s, i) => i === setIdx ? { ...s, ...patch } : s),
    })

  const removeSet = (exIdx, setIdx) =>
    updateExercise(exIdx, {
      sets: form.exercises[exIdx].sets.filter((_, i) => i !== setIdx),
    })

  const toggleMuscle = (exIdx, muscle) => {
    const current = form.exercises[exIdx].muscleGroups
    const next = current.includes(muscle) ? current.filter(m => m !== muscle) : [...current, muscle]
    updateExercise(exIdx, { muscleGroups: next })
  }

  const handleSave = () => onSave({ ...routine, ...form })

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-8 max-w-5xl mx-auto"
    >
      {/* Top bar */}
      <div className="flex items-start gap-4">
        <button
          onClick={onBack}
          className="mt-1 p-2 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Nombre de la rutina…"
            className="w-full text-2xl font-black text-white bg-transparent border-0 outline-none placeholder-slate-700 focus:ring-0"
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs rounded-xl transition cursor-pointer border-0"
          >
            <Save className="w-3.5 h-3.5" /> Guardar
          </button>
          <button
            onClick={() => onDelete(routine.id)}
            className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-500 hover:text-rose-400 hover:border-rose-500/30 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT: metadata + assignment */}
        <div className="lg:col-span-4 space-y-5">

          {/* Status */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Configuración</h3>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Descripción de la rutina…"
              rows={3}
              className="w-full text-sm text-slate-300 bg-slate-950/40 border border-slate-800 rounded-xl p-3 resize-none focus:outline-none focus:border-purple-500 placeholder-slate-700 transition"
            />
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Estado</p>
              <div className="flex gap-2">
                {['draft', 'published'].map(s => (
                  <button
                    key={s}
                    onClick={() => setForm(f => ({ ...f, status: s }))}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition cursor-pointer border ${
                      form.status === s
                        ? s === 'published'
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                          : 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-transparent border-slate-800 text-slate-600 hover:border-slate-700'
                    }`}
                  >
                    {s === 'published' ? 'Publicada' : 'Borrador'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Assignments */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Alumnos asignados
              <span className="ml-auto text-[10px] font-bold text-slate-500 normal-case tracking-normal">{assignedIds.size}</span>
            </h3>
            {assignmentLoading ? (
              <div className="flex justify-center py-4">
                <div className="w-5 h-5 border-2 border-purple-500/40 border-t-purple-500 rounded-full animate-spin" />
              </div>
            ) : assignableUsers.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-3">No hay alumnos registrados</p>
            ) : (
              <div className="space-y-2">
                {assignableUsers.map(u => {
                  const assigned = assignedIds.has(u.id)
                  const toggling = togglingUser === u.id
                  return (
                    <button
                      key={u.id}
                      onClick={() => handleToggleAssignment(u.id)}
                      disabled={!!togglingUser}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition text-left cursor-pointer ${
                        assigned
                          ? 'bg-purple-500/10 border-purple-500/30'
                          : 'bg-slate-950/30 border-slate-800/60 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                        assigned ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {(u.full_name || u.email || '?')[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">{u.full_name || u.email}</p>
                      </div>
                      {toggling ? (
                        <div className="w-4 h-4 border-2 border-purple-500/40 border-t-purple-500 rounded-full animate-spin" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition ${
                          assigned ? 'bg-purple-500 border-purple-500' : 'border-slate-700'
                        }`} />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: exercises */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Ejercicios
              <span className="ml-2 text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-md font-bold normal-case tracking-normal">
                {form.exercises.length}
              </span>
            </h3>
            <button
              onClick={() => setForm(f => ({ ...f, exercises: [...f.exercises, newExercise()] }))}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-purple-400 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl transition cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Añadir ejercicio
            </button>
          </div>

          {form.exercises.length === 0 && (
            <div className="border border-dashed border-slate-800/60 rounded-2xl p-10 text-center">
              <p className="text-slate-600 text-sm font-semibold">Sin ejercicios</p>
              <p className="text-slate-700 text-xs mt-1">Añade ejercicios a esta rutina</p>
            </div>
          )}

          <AnimatePresence>
            {form.exercises.map((ex, exIdx) => (
              <ExerciseEditor
                key={ex.id}
                exercise={ex}
                index={exIdx}
                total={form.exercises.length}
                onUpdate={patch => updateExercise(exIdx, patch)}
                onMove={dir => moveExercise(exIdx, dir)}
                onRemove={() => removeExercise(exIdx)}
                onAddSet={() => addSet(exIdx)}
                onUpdateSet={(sIdx, patch) => updateSet(exIdx, sIdx, patch)}
                onRemoveSet={sIdx => removeSet(exIdx, sIdx)}
                onToggleMuscle={muscle => toggleMuscle(exIdx, muscle)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

function ExerciseEditor({ exercise, index, total, onUpdate, onMove, onRemove, onAddSet, onUpdateSet, onRemoveSet, onToggleMuscle }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden"
    >
      {/* Exercise header */}
      <div className="flex items-center gap-3 p-4">
        <span className="w-6 h-6 flex-shrink-0 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center text-[10px] font-black text-purple-400">
          {index + 1}
        </span>
        <input
          value={exercise.name}
          onChange={e => onUpdate({ name: e.target.value })}
          placeholder="Nombre del ejercicio…"
          className="flex-1 text-sm font-bold text-white bg-transparent border-0 outline-none placeholder-slate-700"
          onClick={() => setExpanded(true)}
        />
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onMove(-1)} disabled={index === 0} className="p-1 text-slate-600 hover:text-slate-300 disabled:opacity-20 transition cursor-pointer">
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onMove(1)} disabled={index === total - 1} className="p-1 text-slate-600 hover:text-slate-300 disabled:opacity-20 transition cursor-pointer">
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setExpanded(e => !e)} className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-white transition cursor-pointer">
            {expanded ? 'Colapsar' : 'Expandir'}
          </button>
          <button onClick={onRemove} className="p-1 text-slate-700 hover:text-rose-400 transition cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 space-y-5 border-t border-slate-800/60 pt-4">

              {/* Muscle groups */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Grupos musculares</p>
                <div className="flex flex-wrap gap-1.5">
                  {MUSCLE_GROUPS_LIST.map(m => {
                    const active = exercise.muscleGroups.includes(m)
                    const s = MUSCLE_GROUP_STYLE[m]
                    return (
                      <button
                        key={m}
                        onClick={() => onToggleMuscle(m)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition cursor-pointer ${
                          active
                            ? `${s.bg} ${s.border} ${s.color}`
                            : 'bg-transparent border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400'
                        }`}
                      >
                        {m}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Sets table */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Series</p>
                <div className="space-y-1.5">
                  <div className="grid grid-cols-[24px_1fr_1fr_24px] gap-2 px-1">
                    <span className="text-[9px] font-bold text-slate-600 text-center">#</span>
                    <span className="text-[9px] font-bold text-slate-600 text-center">Reps</span>
                    <span className="text-[9px] font-bold text-slate-600 text-center">Peso (kg)</span>
                    <span />
                  </div>
                  {exercise.sets.map((set, sIdx) => (
                    <div key={sIdx} className="grid grid-cols-[24px_1fr_1fr_24px] gap-2 items-center">
                      <span className="text-[10px] font-black text-slate-600 text-center">{sIdx + 1}</span>
                      <input
                        type="number"
                        min="1"
                        value={set.reps}
                        onChange={e => onUpdateSet(sIdx, { reps: parseInt(e.target.value) || 0 })}
                        className="w-full text-center text-sm font-bold text-white bg-slate-950/60 border border-slate-800 rounded-lg py-1.5 focus:outline-none focus:border-purple-500 transition"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={set.weight}
                        onChange={e => onUpdateSet(sIdx, { weight: parseFloat(e.target.value) || 0 })}
                        className="w-full text-center text-sm font-bold text-white bg-slate-950/60 border border-slate-800 rounded-lg py-1.5 focus:outline-none focus:border-purple-500 transition"
                      />
                      <button
                        onClick={() => onRemoveSet(sIdx)}
                        disabled={exercise.sets.length <= 1}
                        className="p-1 text-slate-700 hover:text-rose-400 disabled:opacity-20 transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={onAddSet}
                    className="w-full py-1.5 text-[10px] font-bold text-slate-500 hover:text-purple-400 border border-dashed border-slate-800 hover:border-purple-500/30 rounded-lg transition cursor-pointer mt-1"
                  >
                    + Añadir serie
                  </button>
                </div>
              </div>

              {/* Rest + GIF URL */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Descanso (seg)</p>
                  <input
                    type="number"
                    min="0"
                    step="15"
                    value={exercise.restSeconds}
                    onChange={e => onUpdate({ restSeconds: parseInt(e.target.value) || 0 })}
                    className="w-full text-sm font-bold text-white bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">URL del GIF</p>
                  <input
                    type="url"
                    value={exercise.gifUrl}
                    onChange={e => onUpdate({ gifUrl: e.target.value })}
                    placeholder="https://…"
                    className="w-full text-sm text-slate-400 bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 placeholder-slate-700 transition"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Notas / técnica</p>
                <textarea
                  value={exercise.notes}
                  onChange={e => onUpdate({ notes: e.target.value })}
                  placeholder="Consejos de ejecución, puntos clave de la técnica…"
                  rows={2}
                  className="w-full text-xs text-slate-400 bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-2 resize-none focus:outline-none focus:border-purple-500 placeholder-slate-700 transition"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
