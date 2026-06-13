import { motion } from 'framer-motion'
import { Clock, Trash2, Edit2, Eye, EyeOff, Flame, AlertTriangle } from 'lucide-react'

export const CATEGORY_STYLE = {
  desayuno: { label: 'Desayuno', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', emoji: '☀️' },
  almuerzo: { label: 'Almuerzo', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', emoji: '🥗' },
  cena:     { label: 'Cena',     color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    emoji: '🌙' },
  snack:    { label: 'Snack',    color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  emoji: '🍎' },
  postre:   { label: 'Postre',   color: 'text-pink-400',    bg: 'bg-pink-500/10',    border: 'border-pink-500/20',    emoji: '🍮' },
}

export function RecipeCard({ recipe, onEdit, onDelete, onToggleStatus }) {
  const cat = CATEGORY_STYLE[recipe.category] ?? CATEGORY_STYLE.almuerzo
  const isPublished = recipe.status === 'published'
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)
  const allergenCount = recipe.allergens?.length ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition-all duration-200 group flex flex-col gap-4"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`w-9 h-9 ${cat.bg} border ${cat.border} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
            {cat.emoji}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-black text-white truncate">{recipe.name}</p>
            <span className={`text-[10px] font-bold ${cat.color} uppercase tracking-wider`}>{cat.label}</span>
          </div>
        </div>
        <span className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider ${
          isPublished
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-slate-900/60 border-slate-800 text-slate-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-400' : 'bg-slate-600'}`} />
          {isPublished ? 'Publicada' : 'Borrador'}
        </span>
      </div>

      {recipe.description && (
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{recipe.description}</p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
        {totalTime > 0 && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {totalTime} min
          </span>
        )}
        {recipe.nutrition?.calories > 0 && (
          <span className="flex items-center gap-1 text-amber-400">
            <Flame className="w-3 h-3" />
            {recipe.nutrition.calories} kcal
          </span>
        )}
        {allergenCount > 0 && (
          <span className="flex items-center gap-1 text-rose-400">
            <AlertTriangle className="w-3 h-3" />
            {allergenCount} alérg.
          </span>
        )}
        <span>{recipe.ingredients?.length ?? 0} ingred.</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-slate-800/60 pt-3 mt-auto">
        <button
          onClick={() => onEdit(recipe)}
          className="flex-1 text-[10px] font-bold text-slate-400 hover:text-white bg-transparent hover:bg-slate-800 border border-slate-800 rounded-xl py-2 transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Edit2 className="w-3 h-3" />
          Editar
        </button>
        <button
          onClick={() => onToggleStatus(recipe.id)}
          className={`flex-1 text-[10px] font-bold border rounded-xl py-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
            isPublished
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
              : 'text-slate-400 hover:text-white bg-transparent hover:bg-slate-800 border-slate-800'
          }`}
        >
          {isPublished ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {isPublished ? 'Retirar' : 'Publicar'}
        </button>
        <button
          onClick={() => onDelete(recipe.id)}
          className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}
