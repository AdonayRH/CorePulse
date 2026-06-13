import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Plus, ChevronDown, User2 } from 'lucide-react'
import { getAssignableUsers } from '../../lib/recipes'
import { fetchTrainerMealPlan, setMealPlanEntry, removeMealPlanEntry } from '../../lib/mealPlans'
import { CATEGORY_STYLE } from './RecipeCard'

const DAYS = [
  { key: 0, label: 'Lunes' },
  { key: 1, label: 'Martes' },
  { key: 2, label: 'Miércoles' },
  { key: 3, label: 'Jueves' },
  { key: 4, label: 'Viernes' },
  { key: 5, label: 'Sábado' },
  { key: 6, label: 'Domingo' },
]

const MEAL_SLOTS = [
  { key: 'desayuno', label: 'Desayuno', emoji: '🌅' },
  { key: 'almuerzo', label: 'Almuerzo', emoji: '☀️' },
  { key: 'cena',     label: 'Cena',     emoji: '🌙' },
  { key: 'snack',    label: 'Snack',    emoji: '🍎' },
  { key: 'postre',   label: 'Postre',   emoji: '🍮' },
]

export function MealPlannerCalendar({ trainerId, recipes, addToast }) {
  const [users, setUsers]               = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [entries, setEntries]           = useState([])
  const [loading, setLoading]           = useState(false)
  const [picker, setPicker]             = useState(null) // { dayOfWeek, mealSlot }
  const [pickerSearch, setPickerSearch] = useState('')
  const [saving, setSaving]             = useState(null) // `${day}-${slot}`

  useEffect(() => {
    getAssignableUsers().then(setUsers).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedUserId) { setEntries([]); return }
    setLoading(true)
    fetchTrainerMealPlan(selectedUserId)
      .then(setEntries)
      .catch(() => addToast('Error al cargar el plan', 'error'))
      .finally(() => setLoading(false))
  }, [selectedUserId])

  const getEntry = (day, slot) =>
    entries.find(e => e.dayOfWeek === day && e.mealSlot === slot)

  const openPicker = (day, slot) => {
    if (!selectedUserId) return
    setPicker({ dayOfWeek: day, mealSlot: slot })
    setPickerSearch('')
  }

  const handlePickRecipe = async (recipe) => {
    const { dayOfWeek, mealSlot } = picker
    setPicker(null)
    const key = `${dayOfWeek}-${mealSlot}`
    setSaving(key)
    try {
      await setMealPlanEntry(selectedUserId, trainerId, dayOfWeek, mealSlot, recipe.id)
      setEntries(prev => [
        ...prev.filter(e => !(e.dayOfWeek === dayOfWeek && e.mealSlot === mealSlot)),
        { dayOfWeek, mealSlot, recipeId: recipe.id, recipe },
      ])
    } catch {
      addToast('Error al guardar', 'error')
    } finally {
      setSaving(null)
    }
  }

  const handleRemove = async (e, day, slot) => {
    e.stopPropagation()
    const key = `${day}-${slot}`
    setSaving(key)
    try {
      await removeMealPlanEntry(selectedUserId, day, slot)
      setEntries(prev => prev.filter(en => !(en.dayOfWeek === day && en.mealSlot === slot)))
    } catch {
      addToast('Error al eliminar', 'error')
    } finally {
      setSaving(null)
    }
  }

  const publishedRecipes = recipes.filter(r => r.status === 'published')
  const pickerRecipes = picker
    ? publishedRecipes.filter(r =>
        !pickerSearch || r.name.toLowerCase().includes(pickerSearch.toLowerCase())
      )
    : []

  return (
    <div className="space-y-6">

      {/* User selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <select
            value={selectedUserId}
            onChange={e => setSelectedUserId(e.target.value)}
            className="appearance-none bg-slate-900/60 border border-slate-800 hover:border-slate-700 focus:border-purple-500 text-white text-sm rounded-xl pl-4 pr-10 py-2.5 focus:outline-none cursor-pointer transition"
          >
            <option value="">Seleccionar alumno…</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
        {selectedUserId && !loading && (
          <span className="text-xs text-slate-500">
            {entries.length} comida{entries.length !== 1 ? 's' : ''} planificada{entries.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Grid */}
      {!selectedUserId ? (
        <div className="text-center py-16 border border-dashed border-slate-800/60 rounded-3xl">
          <User2 className="w-10 h-10 text-slate-800 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-semibold">Selecciona un alumno para ver o editar su plan semanal</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-purple-500/40 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto pb-2 -mx-1">
          <table className="w-full min-w-[680px] border-collapse px-1">
            <thead>
              <tr>
                <th className="w-24 pb-3" />
                {DAYS.map(d => (
                  <th key={d.key} className="pb-3 text-center text-[10px] font-black text-slate-500 uppercase tracking-wider px-1">
                    {d.label.substring(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="space-y-1">
              {MEAL_SLOTS.map(slot => (
                <tr key={slot.key}>
                  <td className="py-1 pr-3 align-middle">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base leading-none">{slot.emoji}</span>
                      <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{slot.label}</span>
                    </div>
                  </td>
                  {DAYS.map(day => {
                    const entry = getEntry(day.key, slot.key)
                    const key = `${day.key}-${slot.key}`
                    const isSaving = saving === key
                    const cat = entry?.recipe ? (CATEGORY_STYLE[entry.recipe.category] ?? CATEGORY_STYLE.almuerzo) : null

                    return (
                      <td key={day.key} className="py-1 px-1 align-top">
                        {isSaving ? (
                          <div className="h-[68px] border border-slate-800/60 rounded-xl flex items-center justify-center bg-slate-900/20">
                            <div className="w-4 h-4 border-2 border-purple-500/40 border-t-purple-500 rounded-full animate-spin" />
                          </div>
                        ) : entry ? (
                          <div
                            onClick={() => openPicker(day.key, slot.key)}
                            className="relative h-[68px] bg-slate-900/50 border border-slate-800/80 rounded-xl p-2 cursor-pointer hover:border-purple-500/40 transition-colors group overflow-hidden"
                          >
                            {cat && (
                              <span className="text-[9px] leading-none absolute top-1.5 left-2 opacity-60">{cat.emoji}</span>
                            )}
                            <p className="text-[10px] font-black text-white leading-tight line-clamp-2 mt-3 pr-4">{entry.recipe?.name}</p>
                            {entry.recipe?.nutrition?.calories > 0 && (
                              <p className="text-[9px] text-amber-400 mt-0.5 font-semibold">{entry.recipe.nutrition.calories} kcal</p>
                            )}
                            <button
                              onClick={e => handleRemove(e, day.key, slot.key)}
                              className="absolute top-1 right-1 w-4 h-4 bg-rose-500/20 border border-rose-500/20 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <X className="w-2.5 h-2.5 text-rose-400" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => openPicker(day.key, slot.key)}
                            className="w-full h-[68px] border border-dashed border-slate-800/60 rounded-xl flex items-center justify-center text-slate-800 hover:border-purple-500/30 hover:text-purple-500/40 transition-colors cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recipe Picker Modal */}
      <AnimatePresence>
        {picker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setPicker(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 12, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0d1117] border border-slate-800 rounded-3xl p-5 w-full max-w-sm max-h-[72vh] flex flex-col gap-4 shadow-2xl shadow-black"
            >
              <div className="flex items-center justify-between flex-shrink-0">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {DAYS.find(d => d.key === picker.dayOfWeek)?.label}
                  </p>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>{MEAL_SLOTS.find(s => s.key === picker.mealSlot)?.emoji}</span>
                    {MEAL_SLOTS.find(s => s.key === picker.mealSlot)?.label}
                  </h3>
                </div>
                <button
                  onClick={() => setPicker(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative flex-shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar receta…"
                  value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                  autoFocus
                  className="w-full bg-slate-900/60 border border-slate-800 focus:border-purple-500 text-sm text-white placeholder-slate-600 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none transition"
                />
              </div>

              <div className="overflow-y-auto space-y-1.5 flex-1 min-h-0">
                {publishedRecipes.length === 0 ? (
                  <p className="text-center text-slate-600 text-xs py-10">No tienes recetas publicadas</p>
                ) : pickerRecipes.length === 0 ? (
                  <p className="text-center text-slate-600 text-xs py-10">Sin resultados</p>
                ) : pickerRecipes.map(recipe => {
                  const cat = CATEGORY_STYLE[recipe.category] ?? CATEGORY_STYLE.almuerzo
                  return (
                    <button
                      key={recipe.id}
                      onClick={() => handlePickRecipe(recipe)}
                      className="w-full flex items-center gap-3 p-3 bg-slate-900/30 border border-slate-800/60 rounded-xl hover:border-purple-500/40 hover:bg-slate-900/70 transition text-left cursor-pointer"
                    >
                      <div className={`w-7 h-7 flex-shrink-0 ${cat.bg} border ${cat.border} rounded-lg flex items-center justify-center text-sm leading-none`}>
                        {cat.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{recipe.name}</p>
                        <p className={`text-[10px] font-semibold ${cat.color}`}>{cat.label}</p>
                      </div>
                      {recipe.nutrition?.calories > 0 && (
                        <span className="text-[10px] font-bold text-amber-400 flex-shrink-0">
                          {recipe.nutrition.calories} kcal
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
