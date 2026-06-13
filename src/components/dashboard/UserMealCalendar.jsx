import { motion } from 'framer-motion'
import { CATEGORY_STYLE } from './RecipeCard'

const DAYS = [
  { key: 0, label: 'Lunes',     short: 'Lun' },
  { key: 1, label: 'Martes',    short: 'Mar' },
  { key: 2, label: 'Miércoles', short: 'Mié' },
  { key: 3, label: 'Jueves',    short: 'Jue' },
  { key: 4, label: 'Viernes',   short: 'Vie' },
  { key: 5, label: 'Sábado',    short: 'Sáb' },
  { key: 6, label: 'Domingo',   short: 'Dom' },
]

const MEAL_SLOTS = [
  { key: 'desayuno', label: 'Desayuno', emoji: '🌅' },
  { key: 'almuerzo', label: 'Almuerzo', emoji: '☀️' },
  { key: 'cena',     label: 'Cena',     emoji: '🌙' },
  { key: 'snack',    label: 'Snack',    emoji: '🍎' },
  { key: 'postre',   label: 'Postre',   emoji: '🍮' },
]

// 0=Mon … 6=Sun
function getTodayDow() {
  const js = new Date().getDay() // 0=Sun, 1=Mon…6=Sat
  return js === 0 ? 6 : js - 1
}

export function UserMealCalendar({ entries, onViewRecipe }) {
  if (!entries || entries.length === 0) return null

  const todayDow = getTodayDow()
  const getEntry = (day, slot) => entries.find(e => e.dayOfWeek === day && e.mealSlot === slot)

  // How many slots have entries per day (for the "today" summary)
  const todayEntries = MEAL_SLOTS.map(s => getEntry(todayDow, s.key)).filter(Boolean)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">Mi Plan Semanal</h2>
        <span className="text-xs text-slate-500">
          {todayEntries.length > 0 ? `${todayEntries.length} comida${todayEntries.length !== 1 ? 's' : ''} hoy` : 'Sin plan para hoy'}
        </span>
      </div>

      {/* Today's highlight strip */}
      {todayEntries.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {todayEntries.map(entry => {
            const cat = CATEGORY_STYLE[entry.recipe?.category] ?? CATEGORY_STYLE.almuerzo
            const slot = MEAL_SLOTS.find(s => s.key === entry.mealSlot)
            return (
              <motion.button
                key={entry.mealSlot}
                onClick={() => onViewRecipe && entry.recipe && onViewRecipe(entry.recipe)}
                whileHover={{ y: -2 }}
                className="flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 bg-purple-500/10 border border-purple-500/25 rounded-2xl text-left cursor-pointer hover:border-purple-500/50 transition-colors"
              >
                <span className="text-lg leading-none">{slot?.emoji}</span>
                <div>
                  <p className="text-[10px] font-bold text-purple-300">{slot?.label}</p>
                  <p className="text-xs font-black text-white leading-tight max-w-[140px] truncate">{entry.recipe?.name}</p>
                  {entry.recipe?.nutrition?.calories > 0 && (
                    <p className="text-[10px] text-amber-400 font-semibold">{entry.recipe.nutrition.calories} kcal</p>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Full weekly grid */}
      <div className="overflow-x-auto pb-2">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className="w-24 pb-3" />
              {DAYS.map(d => (
                <th
                  key={d.key}
                  className={`pb-3 text-center text-[10px] font-black uppercase tracking-wider px-0.5 ${
                    d.key === todayDow ? 'text-purple-400' : 'text-slate-600'
                  }`}
                >
                  {d.short}
                  {d.key === todayDow && (
                    <span className="block w-1 h-1 bg-purple-400 rounded-full mx-auto mt-0.5" />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MEAL_SLOTS.map(slot => (
              <tr key={slot.key}>
                <td className="py-0.5 pr-2 align-middle">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm leading-none">{slot.emoji}</span>
                    <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">{slot.label}</span>
                  </div>
                </td>
                {DAYS.map(day => {
                  const entry = getEntry(day.key, slot.key)
                  const isToday = day.key === todayDow

                  if (!entry) {
                    return (
                      <td key={day.key} className="py-0.5 px-0.5">
                        <div className={`h-[62px] rounded-xl border ${isToday ? 'border-purple-500/10 bg-purple-500/3' : 'border-slate-900/40'}`} />
                      </td>
                    )
                  }

                  const cat = CATEGORY_STYLE[entry.recipe?.category] ?? CATEGORY_STYLE.almuerzo
                  return (
                    <td key={day.key} className="py-0.5 px-0.5">
                      <motion.button
                        onClick={() => onViewRecipe && entry.recipe && onViewRecipe(entry.recipe)}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.15 }}
                        className={`w-full h-[62px] text-left p-2 rounded-xl border cursor-pointer overflow-hidden transition-colors ${
                          isToday
                            ? 'bg-purple-500/12 border-purple-500/35 hover:border-purple-500/60'
                            : 'bg-slate-900/40 border-slate-800/70 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[9px] leading-none opacity-50">{cat.emoji}</span>
                        <p className="text-[10px] font-black text-white leading-tight line-clamp-2 mt-0.5">{entry.recipe?.name}</p>
                        {entry.recipe?.nutrition?.calories > 0 && (
                          <p className="text-[9px] text-amber-400 font-semibold mt-0.5">{entry.recipe.nutrition.calories} kcal</p>
                        )}
                      </motion.button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
