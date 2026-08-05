import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Flame } from 'lucide-react'
import { CATEGORY_STYLE } from './RecipeCard'

const MEAL_SLOTS = [
  { key: 'desayuno', label: 'Desayuno', emoji: '🌅', time: '08:00' },
  { key: 'snack',    label: 'Snack',    emoji: '🍎', time: '11:00' },
  { key: 'almuerzo', label: 'Almuerzo', emoji: '☀️',  time: '14:00' },
  { key: 'postre',   label: 'Postre',   emoji: '🍮', time: '16:30' },
  { key: 'cena',     label: 'Cena',     emoji: '🌙', time: '21:00' },
]

const DAYS_SHORT  = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MONTHS_SHORT = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']

// 0 = Mon … 6 = Sun
function getTodayDow() {
  const js = new Date().getDay()
  return js === 0 ? 6 : js - 1
}

function getWeekDates() {
  const today    = new Date()
  const todayDow = getTodayDow()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + (i - todayDow))
    return { dow: i, iso: d.toISOString().split('T')[0], day: d.getDate(), month: d.getMonth() }
  })
}

function ck(dateISO, slot) { return `${dateISO}_${slot}` }

// ─────────────────────────────────────────────────────────────────────────────

export function UserMealCalendar({ entries, onViewRecipe }) {
  const todayDow  = getTodayDow()
  const weekDates = getWeekDates()

  const [selectedDow, setSelectedDow] = useState(todayDow)
  const [completions, setCompletions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('corepulse_meal_completions') || '{}') }
    catch { return {} }
  })

  if (!entries?.length) return null

  const selDate = weekDates[selectedDow]
  const isToday = selectedDow === todayDow

  const toggle = (slot) => {
    const key = ck(selDate.iso, slot)
    setCompletions(prev => {
      const next = { ...prev }
      if (next[key]) delete next[key]; else next[key] = true
      localStorage.setItem('corepulse_meal_completions', JSON.stringify(next))
      return next
    })
  }

  const isDone = (slot) => !!completions[ck(selDate.iso, slot)]

  // Ordered slots with entry + completion for selected day
  const dayMeals = MEAL_SLOTS.map(s => ({
    ...s,
    entry: entries.find(e => e.dayOfWeek === selectedDow && e.mealSlot === s.key),
    done:  isDone(s.key),
  }))

  const planned   = dayMeals.filter(m => m.entry)
  const completed = planned.filter(m => m.done)
  const totalCal  = planned.reduce((sum, m) => sum + (m.entry?.recipe?.nutrition?.calories || 0), 0)
  const progress  = planned.length > 0 ? completed.length / planned.length : 0
  const allDone   = planned.length > 0 && completed.length === planned.length

  // Per-day dot summary for the strip
  const daySummary = weekDates.map(({ dow, iso }) => {
    const total = entries.filter(e => e.dayOfWeek === dow).length
    const done  = MEAL_SLOTS.filter(s =>
      entries.find(e => e.dayOfWeek === dow && e.mealSlot === s.key) &&
      !!completions[ck(iso, s.key)]
    ).length
    return { total, done }
  })

  const dateLabel = isToday
    ? `Hoy · ${DAYS_SHORT[selectedDow]} ${selDate.day} ${MONTHS_SHORT[selDate.month]}`
    : `${DAYS_SHORT[selectedDow]} ${selDate.day} de ${MONTHS_SHORT[selDate.month]}`

  return (
    <div className="space-y-4">
      {/* ── Header: day picker + progress ── */}
      <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white">Plan Alimenticio</h2>
          <span className="text-xs font-bold text-slate-400">{dateLabel}</span>
        </div>

        {/* 7-day strip */}
        <div className="grid grid-cols-7 gap-1">
          {weekDates.map(({ dow, day }, i) => {
            const { total, done } = daySummary[i]
            const sel = dow === selectedDow
            const tod = dow === todayDow
            const dotColor = total === 0 ? 'bg-transparent'
              : done === total ? 'bg-emerald-400'
              : done > 0       ? 'bg-amber-400'
              : 'bg-slate-700'

            return (
              <button
                key={dow}
                onClick={() => setSelectedDow(dow)}
                className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl border transition cursor-pointer ${
                  sel ? 'bg-purple-500/20 border-purple-500/40'
                  : tod ? 'bg-slate-800/50 border-slate-700/40'
                  : 'border-transparent hover:bg-slate-800/40'
                }`}
              >
                <span className={`text-[9px] font-black uppercase tracking-wider ${sel ? 'text-purple-300' : tod ? 'text-white' : 'text-slate-600'}`}>
                  {DAYS_SHORT[dow]}
                </span>
                <span className={`text-sm font-black leading-none ${sel || tod ? 'text-white' : 'text-slate-500'}`}>
                  {day}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
              </button>
            )
          })}
        </div>

        {/* Progress bar */}
        {planned.length > 0 ? (
          <div className="space-y-2 pt-1 border-t border-slate-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                <span className="text-white font-black text-sm">{completed.length}</span>
                <span className="font-bold"> / {planned.length} comidas</span>
              </span>
              {totalCal > 0 && (
                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                  <Flame className="w-3 h-3" />{totalCal} kcal planificadas
                </span>
              )}
            </div>
            <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${allDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-500 to-emerald-500'}`}
                animate={{ width: `${Math.round(progress * 100)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <AnimatePresence>
              {allDone && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-black text-emerald-400 text-center"
                >
                  ✅ ¡Plan del día completado!
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-xs text-slate-700 font-semibold text-center py-1 border-t border-slate-800/60 pt-3">
            Sin comidas planificadas para este día
          </p>
        )}
      </div>

      {/* ── Timeline ── */}
      <div className="space-y-0">
        {dayMeals.map((meal, idx) => {
          const isLast = idx === dayMeals.length - 1

          if (!meal.entry) {
            // Empty slot — very subtle
            return (
              <div key={meal.key} className="flex items-center gap-3 px-1">
                <span className="text-[10px] font-black text-slate-800 w-11 text-right tabular-nums shrink-0">
                  {meal.time}
                </span>
                <div className="flex flex-col items-center shrink-0 self-stretch">
                  <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800/60 mt-0.5" />
                  {!isLast && <div className="w-px flex-1 bg-slate-900 min-h-[20px]" />}
                </div>
                <div className="flex items-center gap-1.5 py-2.5 opacity-25">
                  <span className="text-xs leading-none">{meal.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-600">{meal.label}</span>
                  <span className="text-[10px] text-slate-700">· sin planificar</span>
                </div>
              </div>
            )
          }

          const cat = CATEGORY_STYLE[meal.entry.recipe?.category] ?? CATEGORY_STYLE.almuerzo
          const cal = meal.entry.recipe?.nutrition?.calories || 0

          return (
            <div key={meal.key} className="flex items-start gap-3 px-1">
              <span className="text-[10px] font-black text-slate-500 w-11 text-right tabular-nums shrink-0 mt-[22px]">
                {meal.time}
              </span>

              {/* Dot + line */}
              <div className="flex flex-col items-center shrink-0 self-stretch">
                <motion.div
                  animate={{
                    backgroundColor: meal.done ? 'rgb(16 185 129)' : 'rgb(2 6 23)',
                    borderColor:      meal.done ? 'rgb(16 185 129)' : 'rgb(71 85 105)',
                  }}
                  transition={{ duration: 0.25 }}
                  className="w-3 h-3 rounded-full border-2 mt-4 shrink-0 z-10 shadow-md"
                />
                {!isLast && (
                  <div className={`w-px flex-1 mt-1 min-h-[12px] ${meal.done ? 'bg-emerald-500/20' : 'bg-slate-800/60'}`} />
                )}
              </div>

              {/* Card */}
              <motion.div
                layout
                animate={{
                  borderColor: meal.done ? 'rgb(16 185 129 / 0.25)' : 'rgb(30 41 59 / 0.8)',
                  backgroundColor: meal.done ? 'rgb(16 185 129 / 0.05)' : 'rgb(15 23 42 / 0.4)',
                }}
                transition={{ duration: 0.25 }}
                className="flex-1 mb-2.5 rounded-2xl border overflow-hidden"
              >
                <div className="flex items-center gap-3 p-3.5">
                  <div className={`w-10 h-10 shrink-0 ${cat.bg} border ${cat.border} rounded-xl flex items-center justify-center text-xl leading-none`}>
                    {meal.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{meal.label}</p>
                    <button
                      onClick={() => meal.entry.recipe && onViewRecipe?.(meal.entry.recipe)}
                      className={`text-sm font-black text-left leading-tight block w-full transition-colors cursor-pointer truncate ${
                        meal.done ? 'text-slate-500' : 'text-white hover:text-purple-300'
                      }`}
                    >
                      {meal.entry.recipe?.name || '—'}
                    </button>
                    {cal > 0 && (
                      <p className={`text-[10px] font-bold mt-0.5 tabular-nums ${meal.done ? 'text-slate-700' : 'text-amber-400'}`}>
                        {cal} kcal
                      </p>
                    )}
                  </div>

                  {/* Check button */}
                  <motion.button
                    onClick={() => toggle(meal.key)}
                    whileTap={{ scale: 0.85 }}
                    animate={{
                      backgroundColor: meal.done ? 'rgb(16 185 129)' : 'transparent',
                      borderColor:      meal.done ? 'rgb(16 185 129)' : 'rgb(51 65 85)',
                    }}
                    transition={{ duration: 0.2 }}
                    className="w-10 h-10 shrink-0 rounded-xl border-2 flex items-center justify-center cursor-pointer shadow-sm"
                    title={meal.done ? 'Marcar como no comido' : 'Marcar como comido'}
                  >
                    <Check className={`w-4 h-4 transition-colors ${meal.done ? 'text-white' : 'text-slate-600'}`} />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
