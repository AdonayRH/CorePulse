import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Users, Flame, AlertTriangle } from 'lucide-react'
import { CATEGORY_STYLE } from './RecipeCard'

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

const NUTRITION_FIELDS = [
  { key: 'calories', label: 'Calorías',      unit: 'kcal', color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
  { key: 'protein',  label: 'Proteínas',     unit: 'g',    color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  { key: 'carbs',    label: 'Carbohidratos', unit: 'g',    color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { key: 'fat',      label: 'Grasas',        unit: 'g',    color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/20' },
  { key: 'fiber',    label: 'Fibra',         unit: 'g',    color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20' },
]

export function RecipeUserView({ recipe, onBack }) {
  const cat = CATEGORY_STYLE[recipe.category] ?? CATEGORY_STYLE.almuerzo
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)
  const n = recipe.nutrition || {}
  const p = (n.protein || 0) * 4
  const c = (n.carbs   || 0) * 4
  const f = (n.fat     || 0) * 9
  const macroTotal = p + c + f || 1
  const activeAllergens = ALLERGENS.filter(a => recipe.allergens?.includes(a.key))

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-8 max-w-5xl mx-auto"
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
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${cat.bg} border ${cat.border} rounded-full text-[10px] font-bold ${cat.color} mb-2`}>
            <span>{cat.emoji}</span> {cat.label}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{recipe.name}</h1>
          {recipe.description && (
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">{recipe.description}</p>
          )}
          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mt-4 text-xs font-bold text-slate-500">
            {totalTime > 0 && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {recipe.prepTime > 0 && `${recipe.prepTime} min prep · `}
                {recipe.cookTime > 0 && `${recipe.cookTime} min cocción`}
              </span>
            )}
            {recipe.servings > 0 && (
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {recipe.servings} ración{recipe.servings !== 1 ? 'es' : ''}
              </span>
            )}
            {n.calories > 0 && (
              <span className="flex items-center gap-1.5 text-amber-400">
                <Flame className="w-3.5 h-3.5" />
                {n.calories} kcal / ración
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT: Nutrition + Allergens */}
        <div className="lg:col-span-4 space-y-5">

          {/* Nutrition */}
          {n.calories > 0 && (
            <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Valores Nutricionales
              </h3>
              <p className="text-[10px] text-slate-500">Por ración</p>
              <div className="space-y-3">
                {NUTRITION_FIELDS.map(({ key, label, unit, color, bg, border }) =>
                  n[key] > 0 ? (
                    <div key={key} className={`flex items-center justify-between p-2.5 ${bg} border ${border} rounded-xl`}>
                      <span className={`text-[10px] font-bold ${color}`}>{label}</span>
                      <span className="text-sm font-black text-white tabular-nums">
                        {n[key]} <span className="text-[10px] font-medium text-slate-500">{unit}</span>
                      </span>
                    </div>
                  ) : null
                )}
              </div>
              {/* Macro bar */}
              {(p + c + f) > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                  <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                    <div className="bg-blue-500 rounded-l-full" style={{ width: `${(p / macroTotal) * 100}%` }} />
                    <div className="bg-emerald-500" style={{ width: `${(c / macroTotal) * 100}%` }} />
                    <div className="bg-yellow-500 rounded-r-full" style={{ width: `${(f / macroTotal) * 100}%` }} />
                  </div>
                  <div className="flex gap-3 text-[9px] font-bold text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />Prot. {Math.round((p / macroTotal) * 100)}%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" />Carbs {Math.round((c / macroTotal) * 100)}%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-500 rounded-full inline-block" />Gras. {Math.round((f / macroTotal) * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Allergens */}
          {activeAllergens.length > 0 && (
            <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-3xl space-y-3">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Contiene Alérgenos
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeAllergens.map(({ key, label, emoji }) => (
                  <span key={key} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-[10px] font-bold">
                    <span className="text-sm leading-none">{emoji}</span>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Ingredients + Steps */}
        <div className="lg:col-span-8 space-y-5">

          {/* Ingredients */}
          {recipe.ingredients?.length > 0 && (
            <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Ingredientes
                <span className="ml-2 text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-md font-bold">{recipe.ingredients.length}</span>
              </h3>
              <div className="space-y-2">
                {recipe.ingredients.map((ing, idx) => (
                  <div key={ing.id || idx} className="flex items-center gap-3 p-3 bg-slate-950/40 border border-slate-900/60 rounded-xl">
                    <span className="text-[10px] font-black text-slate-600 w-5 text-center">{idx + 1}</span>
                    <p className="flex-1 text-xs font-semibold text-white">{ing.name}</p>
                    {ing.amount && (
                      <span className="text-xs font-bold text-slate-400 tabular-nums">
                        {ing.amount} <span className="text-slate-600">{ing.unit}</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Steps */}
          {recipe.steps?.length > 0 && (
            <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Preparación
                <span className="ml-2 text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-md font-bold">{recipe.steps.length} pasos</span>
              </h3>
              <div className="space-y-3">
                {recipe.steps.map((step, idx) => (
                  <div key={step.id || idx} className="flex gap-4">
                    <span className="w-7 h-7 flex-shrink-0 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center text-[11px] font-black text-purple-400 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="flex-1 text-sm text-slate-300 leading-relaxed">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
