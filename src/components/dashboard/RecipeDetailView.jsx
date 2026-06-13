import React, { useState, useEffect, useCallback } from 'react'
import {
  ArrowLeft, Trash2, Eye, EyeOff, Save, Plus, X,
  ChevronUp, ChevronDown, Flame, Clock, Users, AlertTriangle, UserCheck, Loader2
} from 'lucide-react'
import {
  getAssignableUsers, getRecipeAssignments,
  assignRecipeToUser, unassignRecipeFromUser,
} from '../../lib/recipes'

// 14 alérgenos de declaración obligatoria — Reglamento UE 1169/2011
const ALLERGENS = [
  { key: 'gluten',       label: 'Gluten',        emoji: '🌾' },
  { key: 'crustaceos',   label: 'Crustáceos',    emoji: '🦐' },
  { key: 'huevos',       label: 'Huevos',        emoji: '🥚' },
  { key: 'pescado',      label: 'Pescado',        emoji: '🐟' },
  { key: 'cacahuetes',   label: 'Cacahuetes',    emoji: '🥜' },
  { key: 'soja',         label: 'Soja',           emoji: '🫘' },
  { key: 'lacteos',      label: 'Lácteos',        emoji: '🥛' },
  { key: 'frutos_secos', label: 'Frutos Secos',  emoji: '🌰' },
  { key: 'apio',         label: 'Apio',           emoji: '🥬' },
  { key: 'mostaza',      label: 'Mostaza',        emoji: '🌻' },
  { key: 'sesamo',       label: 'Sésamo',         emoji: '⚪' },
  { key: 'sulfitos',     label: 'Sulfitos',       emoji: '🍷' },
  { key: 'altramuces',   label: 'Altramuces',    emoji: '🟡' },
  { key: 'moluscos',     label: 'Moluscos',       emoji: '🐚' },
]

const UNITS = ['g', 'kg', 'ml', 'l', 'cucharada', 'cucharadita', 'taza', 'unidad', 'pizca', 'al gusto']

const CATEGORIES = [
  { key: 'desayuno', label: 'Desayuno' },
  { key: 'almuerzo', label: 'Almuerzo' },
  { key: 'cena',     label: 'Cena' },
  { key: 'snack',    label: 'Snack' },
  { key: 'postre',   label: 'Postre' },
]

const NUTRITION_FIELDS = [
  { key: 'calories', label: 'Calorías',       unit: 'kcal', color: 'text-amber-400' },
  { key: 'protein',  label: 'Proteínas',      unit: 'g',    color: 'text-blue-400' },
  { key: 'carbs',    label: 'Carbohidratos',  unit: 'g',    color: 'text-emerald-400' },
  { key: 'fat',      label: 'Grasas',         unit: 'g',    color: 'text-yellow-400' },
  { key: 'fiber',    label: 'Fibra',          unit: 'g',    color: 'text-purple-400' },
]

export function RecipeDetailView({ recipe, onBack, onSave, onDelete, addToast }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('almuerzo')
  const [description, setDescription] = useState('')
  const [servings, setServings] = useState(1)
  const [prepTime, setPrepTime] = useState(15)
  const [cookTime, setCookTime] = useState(30)
  const [status, setStatus] = useState('draft')
  const [ingredients, setIngredients] = useState([])
  const [steps, setSteps] = useState([])
  const [nutrition, setNutrition] = useState({ calories: '', protein: '', carbs: '', fat: '', fiber: '' })
  const [allergens, setAllergens] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  // Assignment state
  const [assignableUsers, setAssignableUsers] = useState([])
  const [assignedIds, setAssignedIds] = useState(new Set())
  const [togglingUser, setTogglingUser] = useState(null)
  const [assignmentLoading, setAssignmentLoading] = useState(false)

  // New ingredient form
  const [newIngName, setNewIngName] = useState('')
  const [newIngAmount, setNewIngAmount] = useState('')
  const [newIngUnit, setNewIngUnit] = useState('g')

  useEffect(() => {
    if (!recipe) return
    setName(recipe.name || '')
    setCategory(recipe.category || 'almuerzo')
    setDescription(recipe.description || '')
    setServings(recipe.servings ?? 1)
    setPrepTime(recipe.prepTime ?? 15)
    setCookTime(recipe.cookTime ?? 30)
    setStatus(recipe.status || 'draft')
    setIngredients(recipe.ingredients || [])
    setSteps(recipe.steps || [])
    setNutrition(recipe.nutrition || { calories: '', protein: '', carbs: '', fat: '', fiber: '' })
    setAllergens(recipe.allergens || [])
  }, [recipe?.id])

  // Load assignable users and current assignments for this recipe
  const loadAssignments = useCallback(async () => {
    if (!recipe?.id) return
    setAssignmentLoading(true)
    try {
      const [users, ids] = await Promise.all([
        getAssignableUsers(),
        getRecipeAssignments(recipe.id),
      ])
      setAssignableUsers(users)
      setAssignedIds(new Set(ids))
    } catch {
      // Non-fatal: assignment section stays empty
    } finally {
      setAssignmentLoading(false)
    }
  }, [recipe?.id])

  useEffect(() => { loadAssignments() }, [loadAssignments])

  // ─── Allergens ───────────────────────────────────────────────────────────
  const toggleAllergen = (key) =>
    setAllergens(prev => prev.includes(key) ? prev.filter(a => a !== key) : [...prev, key])

  // ─── Ingredients ─────────────────────────────────────────────────────────
  const addIngredient = () => {
    if (!newIngName.trim()) return
    setIngredients(prev => [...prev, {
      id: `ing-${Date.now()}`,
      name: newIngName.trim(),
      amount: newIngAmount,
      unit: newIngUnit,
    }])
    setNewIngName('')
    setNewIngAmount('')
    setNewIngUnit('g')
  }

  const removeIngredient = (id) => setIngredients(prev => prev.filter(i => i.id !== id))

  // ─── Steps ───────────────────────────────────────────────────────────────
  const addStep = () =>
    setSteps(prev => [...prev, { id: `step-${Date.now()}`, text: '' }])

  const updateStep = (id, text) =>
    setSteps(prev => prev.map(s => s.id === id ? { ...s, text } : s))

  const removeStep = (id) => setSteps(prev => prev.filter(s => s.id !== id))

  const moveStep = (index, dir) => {
    const next = [...steps]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setSteps(next)
  }

  // ─── Assignment toggle ────────────────────────────────────────────────────
  const handleToggleAssignment = async (userId) => {
    if (!recipe?.id || !recipe?.trainerId) return
    setTogglingUser(userId)
    const isAssigned = assignedIds.has(userId)
    try {
      if (isAssigned) {
        await unassignRecipeFromUser(recipe.id, userId)
        setAssignedIds(prev => { const s = new Set(prev); s.delete(userId); return s })
      } else {
        await assignRecipeToUser(recipe.id, userId, recipe.trainerId)
        setAssignedIds(prev => new Set([...prev, userId]))
      }
    } catch {
      addToast('Error al actualizar la asignación', 'error')
    } finally {
      setTogglingUser(null)
    }
  }

  // ─── Save ─────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!name.trim()) {
      addToast('El nombre de la receta es obligatorio', 'error')
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      onSave({
        ...recipe,
        name: name.trim(),
        category,
        description: description.trim(),
        servings: Number(servings) || 1,
        prepTime: Number(prepTime) || 0,
        cookTime: Number(cookTime) || 0,
        status,
        ingredients,
        steps,
        nutrition: {
          calories: Number(nutrition.calories) || 0,
          protein:  Number(nutrition.protein)  || 0,
          carbs:    Number(nutrition.carbs)    || 0,
          fat:      Number(nutrition.fat)      || 0,
          fiber:    Number(nutrition.fiber)    || 0,
        },
        allergens,
      })
      setIsSaving(false)
    }, 350)
  }

  const isPublished = status === 'published'

  // ─── Shared input className ───────────────────────────────────────────────
  const inputCls = 'w-full bg-slate-950 border border-slate-850 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition duration-200'

  return (
    <div className="space-y-8">

      {/* ─── HEADER ─── */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-900/60">
        <div className="flex items-center gap-4 text-left">
          <button
            onClick={onBack}
            className="p-2.5 bg-slate-950/40 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white rounded-xl transition duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Editar Receta</span>
            <h1 className="text-xl sm:text-2xl font-black text-white m-0 tracking-tight flex flex-wrap items-center gap-2.5">
              {name || 'Nueva Receta'}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider ${
                isPublished
                  ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}>
                <span className={`w-1 h-1 rounded-full ${isPublished ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                {isPublished ? 'Publicada' : 'Borrador'}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <button
            onClick={() => {
              const next = status === 'published' ? 'draft' : 'published'
              setStatus(next)
              addToast(next === 'published' ? '¡Receta publicada para los alumnos!' : 'Receta guardada como borrador.', 'success')
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition cursor-pointer ${
              isPublished
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-slate-900 border-slate-850 text-slate-300 hover:text-white hover:border-slate-800'
            }`}
          >
            {isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-purple-400" />}
            {isPublished ? 'Retirar' : 'Publicar'}
          </button>
          <button
            onClick={() => onDelete(recipe.id)}
            className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-white rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        </div>
      </section>

      {/* ─── TWO-COLUMN WORKSPACE ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT: Info + Nutrition + Allergens */}
        <div className="lg:col-span-4 space-y-6">

          {/* Basic info */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Información General</h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nombre</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Ej. Pollo al limón con quinoa" className={inputCls} />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Categoría</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer">
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Descripción</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                rows={3} placeholder="Descripción breve de la receta..."
                className={`${inputCls} resize-none`} />
            </div>

            {/* Times + Servings */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Prep.', icon: Clock, value: prepTime, setter: setPrepTime, suffix: 'min' },
                { label: 'Coc.',  icon: Clock, value: cookTime, setter: setCookTime, suffix: 'min' },
                { label: 'Rac.',  icon: Users, value: servings, setter: setServings, suffix: '' },
              ].map(({ label, icon: Icon, value, setter, suffix }) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Icon className="w-3 h-3" /> {label}
                  </label>
                  <div className="relative">
                    <input type="number" min="0" value={value} onChange={e => setter(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-center pr-6" />
                    {suffix && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-600 pointer-events-none">{suffix}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition facts */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Información Nutricional
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">Por ración — valores aproximados</p>
            </div>

            <div className="space-y-3">
              {NUTRITION_FIELDS.map(({ key, label, unit, color }) => (
                <div key={key} className="flex items-center gap-3">
                  <label className={`text-[10px] font-bold ${color} w-28 flex-shrink-0`}>{label}</label>
                  <div className="flex-1 relative">
                    <input
                      type="number" min="0"
                      value={nutrition[key]}
                      onChange={e => setNutrition(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder="0"
                      className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-right pr-8"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-600 pointer-events-none">{unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Macro visual bar */}
            {(Number(nutrition.protein) + Number(nutrition.carbs) + Number(nutrition.fat)) > 0 && (() => {
              const p = Number(nutrition.protein) * 4
              const c = Number(nutrition.carbs) * 4
              const f = Number(nutrition.fat) * 9
              const total = p + c + f || 1
              return (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">Distribución de macros</p>
                  <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                    <div className="bg-blue-500 rounded-l-full" style={{ width: `${(p / total) * 100}%` }} title={`Proteína ${Math.round((p / total) * 100)}%`} />
                    <div className="bg-emerald-500" style={{ width: `${(c / total) * 100}%` }} title={`Carbos ${Math.round((c / total) * 100)}%`} />
                    <div className="bg-yellow-500 rounded-r-full" style={{ width: `${(f / total) * 100}%` }} title={`Grasa ${Math.round((f / total) * 100)}%`} />
                  </div>
                  <div className="flex gap-3 text-[9px] font-bold text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full" />Prot. {Math.round((p / total) * 100)}%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full" />Carbs {Math.round((c / total) * 100)}%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-500 rounded-full" />Gras. {Math.round((f / total) * 100)}%</span>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Allergens */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Alérgenos
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">Reglamento UE 1169/2011 — 14 de declaración obligatoria</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALLERGENS.map(({ key, label, emoji }) => {
                const active = allergens.includes(key)
                return (
                  <button
                    key={key}
                    onClick={() => toggleAllergen(key)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition cursor-pointer ${
                      active
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                        : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <span className="text-sm leading-none">{emoji}</span>
                    {label}
                  </button>
                )
              })}
            </div>
            {allergens.length > 0 && (
              <p className="text-[10px] text-rose-400 font-bold">
                ⚠ Contiene: {allergens.map(k => ALLERGENS.find(a => a.key === k)?.label).filter(Boolean).join(', ')}
              </p>
            )}
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600 text-white font-extrabold text-sm py-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/10 active:scale-[0.98] cursor-pointer border-0 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Guardando...' : 'Guardar Receta'}
          </button>
        </div>

        {/* RIGHT: Ingredients + Preparation */}
        <div className="lg:col-span-8 space-y-6">

          {/* ─── INGREDIENTS ─── */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Ingredientes
              {ingredients.length > 0 && (
                <span className="text-[10px] font-bold text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded-md">{ingredients.length}</span>
              )}
            </h3>

            {ingredients.length > 0 && (
              <div className="space-y-2">
                {ingredients.map((ing, idx) => (
                  <div
                    key={ing.id}
                    className="flex items-center gap-3 p-3 bg-slate-950/50 border border-slate-900/80 rounded-xl group/ing"
                  >
                    <span className="text-[10px] font-black text-slate-600 w-5 text-center flex-shrink-0">{idx + 1}</span>
                    <p className="flex-1 text-xs font-semibold text-white min-w-0">{ing.name}</p>
                    {ing.amount && (
                      <span className="text-xs font-bold text-slate-400 flex-shrink-0 tabular-nums">
                        {ing.amount} <span className="text-slate-600">{ing.unit}</span>
                      </span>
                    )}
                    <button
                      onClick={() => removeIngredient(ing.id)}
                      className="flex-shrink-0 opacity-0 group-hover/ing:opacity-100 w-5 h-5 flex items-center justify-center text-slate-600 hover:text-rose-400 transition cursor-pointer border-0 bg-transparent"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add ingredient form */}
            <div className="flex gap-2 items-end pt-3 border-t border-slate-800/60">
              <div className="flex-1 space-y-1">
                <label className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">Ingrediente</label>
                <input
                  type="text" value={newIngName} onChange={e => setNewIngName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addIngredient()}
                  placeholder="Ej. Pechuga de pollo"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
                />
              </div>
              <div className="w-20 space-y-1">
                <label className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">Cantidad</label>
                <input
                  type="text" value={newIngAmount} onChange={e => setNewIngAmount(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addIngredient()}
                  placeholder="200"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
                />
              </div>
              <div className="w-28 space-y-1">
                <label className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">Unidad</label>
                <select
                  value={newIngUnit} onChange={e => setNewIngUnit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-2 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <button
                onClick={addIngredient}
                className="h-[33px] flex-shrink-0 flex items-center gap-1 px-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[10px] font-bold rounded-xl transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Añadir
              </button>
            </div>
          </div>

          {/* ─── PREPARATION STEPS ─── */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                Preparación
                {steps.length > 0 && (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded-md">{steps.length} pasos</span>
                )}
              </h3>
              <button
                onClick={addStep}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[10px] font-bold rounded-xl transition cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                Añadir Paso
              </button>
            </div>

            {steps.length === 0 ? (
              <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center space-y-3">
                <p className="text-xs text-slate-500">Añade los pasos de preparación de la receta.</p>
                <button
                  onClick={addStep}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-bold text-slate-300 rounded-xl transition cursor-pointer"
                >
                  + Añadir primer paso
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div key={step.id} className="flex gap-3 group/step">
                    {/* Index + reorder controls */}
                    <div className="flex flex-col items-center gap-0.5 flex-shrink-0 pt-1">
                      <span className="w-6 h-6 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400">
                        {idx + 1}
                      </span>
                      <button
                        onClick={() => moveStep(idx, -1)} disabled={idx === 0}
                        className="p-0.5 text-slate-700 hover:text-slate-400 transition disabled:opacity-20 cursor-pointer border-0 bg-transparent"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveStep(idx, 1)} disabled={idx === steps.length - 1}
                        className="p-0.5 text-slate-700 hover:text-slate-400 transition disabled:opacity-20 cursor-pointer border-0 bg-transparent"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                    {/* Text area */}
                    <textarea
                      value={step.text}
                      onChange={e => updateStep(step.id, e.target.value)}
                      placeholder={`Paso ${idx + 1}: describe la acción...`}
                      rows={2}
                      className="flex-1 bg-slate-950 border border-slate-850 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition resize-none"
                    />
                    {/* Remove */}
                    <button
                      onClick={() => removeStep(step.id)}
                      className="flex-shrink-0 p-1.5 text-slate-700 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer border-0 bg-transparent opacity-0 group-hover/step:opacity-100 self-start mt-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ─── ASSIGNMENT SECTION (full width) ─── */}
      <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Asignar a Alumnos
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">
              {assignedIds.size > 0
                ? `${assignedIds.size} alumno${assignedIds.size !== 1 ? 's' : ''} con acceso a esta receta`
                : 'Ningún alumno tiene acceso todavía'}
            </p>
          </div>
          {assignmentLoading && <Loader2 className="w-4 h-4 text-slate-500 animate-spin flex-shrink-0" />}
        </div>

        {assignableUsers.length === 0 && !assignmentLoading ? (
          <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center">
            <p className="text-xs text-slate-500">No hay alumnos registrados en la plataforma todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {assignableUsers.map(user => {
              const isAssigned = assignedIds.has(user.id)
              const isToggling = togglingUser === user.id
              const initials = user.full_name
                ? user.full_name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
                : (user.email?.[0] ?? '?').toUpperCase()
              return (
                <button
                  key={user.id}
                  onClick={() => handleToggleAssignment(user.id)}
                  disabled={isToggling}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition duration-200 cursor-pointer w-full ${
                    isAssigned
                      ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                  } disabled:opacity-60 disabled:cursor-wait`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0 ${
                    isAssigned
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-800 border border-slate-700 text-slate-400'
                  }`}>
                    {isToggling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${isAssigned ? 'text-emerald-300' : 'text-slate-300'}`}>
                      {user.full_name || 'Sin nombre'}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <span className={`flex-shrink-0 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border ${
                    isAssigned
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-900 border-slate-700 text-slate-600'
                  }`}>
                    {isAssigned ? '✓ Sí' : '○ No'}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
