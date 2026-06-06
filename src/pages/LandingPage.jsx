import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'
import heroCoach from '../assets/hero_coach.png'

const CheckIcon = ({ color = '#1D9E75' }) => (
  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color }}>
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

export default function LandingPage() {
  const [activePlanTab, setActivePlanTab] = useState('3months')

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#111A14] text-slate-100 font-dm-sans overflow-x-hidden selection:bg-[#1D9E75] selection:text-white">
      {/* BACKGROUND GLOWS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#1D9E75]/8 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#5DCAA5]/4 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-[#1D9E75]/5 rounded-full blur-[130px] -z-10 pointer-events-none" />

      {/* ─── NAVBAR ─── */}
      <header className="sticky top-0 z-50 w-full bg-[#111A14]/70 backdrop-blur-xl border-b border-[#1D9E75]/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="decoration-none">
            <Logo size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { id: 'metodologia', label: 'Metodología' },
              { id: 'servicios',   label: 'Servicios' },
              { id: 'planes',      label: 'Planes' },
              { id: 'testimonios', label: 'Testimonios' },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="text-slate-400 hover:text-white font-medium text-sm transition-colors duration-200 cursor-pointer bg-transparent border-0">
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-300 hover:text-white font-semibold text-sm px-4 py-2 rounded-xl transition duration-200 decoration-none">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition duration-200 decoration-none shadow-lg shadow-[#1D9E75]/20">
              Comenzar
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ─── HERO ─── */}
        <section id="hero" className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-20 md:pb-28 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-8 text-left">
            <p className="text-[#5DCAA5] text-xs font-light tracking-[0.3em] uppercase">
              COACH DE TRANSFORMACIÓN
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1D9E75]/10 border border-[#1D9E75]/30 text-[#5DCAA5] text-xs font-semibold rounded-full tracking-wide">
              ★ Entrenamiento Personal & Nutrición Adaptada
            </div>

            <h1 className="font-syne text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] m-0">
              Cambia tus <span className="text-[#5DCAA5]">Hábitos</span>.<br />
              Consigue{' '}
              <span style={{ background: 'linear-gradient(to right, #5DCAA5, #1D9E75)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Resultados Reales
              </span>.
            </h1>

            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl">
              Un método progresivo y sostenible para personas que quieren un cambio auténtico. Sin dietas imposibles, sin entrenamientos extremos. Solo hábitos sólidos que se mantienen en el tiempo.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/register" className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white font-bold text-base px-8 py-4 rounded-2xl transition duration-300 shadow-xl shadow-[#1D9E75]/10 active:scale-[0.98] decoration-none">
                Empieza Tu Cambio
              </Link>
              <button onClick={() => scrollTo('planes')} className="bg-[#1A2B1E]/60 hover:bg-[#1A2B1E] border border-[#1D9E75]/20 text-slate-200 hover:text-white font-bold text-base px-8 py-4 rounded-2xl transition duration-300 backdrop-blur-md cursor-pointer">
                Ver Planes
              </button>
            </div>

            <div className="pt-8 border-t border-[#1D9E75]/10 grid grid-cols-3 gap-6">
              {[
                { value: '+350', label: 'Personas Cambiadas', color: 'white' },
                { value: '98%',  label: 'Objetivos Conseguidos', color: '#5DCAA5' },
                { value: '100%', label: 'Método a Medida', color: '#5DCAA5' },
              ].map(({ value, label, color }) => (
                <div key={label}>
                  <p className="font-syne text-3xl md:text-4xl font-extrabold" style={{ color }}>{value}</p>
                  <p className="text-xs md:text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="md:col-span-5 relative flex justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1D9E75] to-[#5DCAA5] rounded-3xl blur-[40px] opacity-15 -z-10 scale-95" />
            <div className="relative border border-[#1D9E75]/20 p-3 bg-[#1A2B1E]/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl max-w-sm md:max-w-none">
              <img src={heroCoach} alt="Coach de Transformación de Hábitos" className="w-full h-auto object-cover rounded-2xl" />

              <div className="absolute top-8 -left-6 bg-[#0D1710]/90 backdrop-blur-xl border border-[#1D9E75]/20 p-4 rounded-2xl flex items-center gap-3 shadow-xl">
                <div className="w-10 h-10 bg-[#1D9E75]/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" style={{ color: '#5DCAA5' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Entrenamiento</p>
                  <p className="text-sm font-bold text-white">Progresión Gradual</p>
                </div>
              </div>

              <div className="absolute bottom-8 -right-6 bg-[#0D1710]/90 backdrop-blur-xl border border-[#1D9E75]/20 p-4 rounded-2xl flex items-center gap-3 shadow-xl">
                <div className="w-10 h-10 bg-[#5DCAA5]/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" style={{ color: '#5DCAA5' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Nutrición</p>
                  <p className="text-sm font-bold text-white">Hábitos Flexibles</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SERVICES ─── */}
        <section id="servicios" className="bg-[#0D1710] py-24 border-y border-[#1D9E75]/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
              <h2 className="font-syne text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight m-0">
                Entrenamiento y Nutrición<br />Como un Todo
              </h2>
              <p className="text-slate-400 text-base md:text-lg">
                Mejorar sin cambiar lo que comes es frustrante. Comer mejor sin moverse tampoco funciona. El cambio real llega cuando actúas en ambos frentes, con un método que respeta tu ritmo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div className="bg-[#1A2B1E]/30 border border-[#1D9E75]/20 hover:border-[#1D9E75]/40 rounded-3xl p-8 md:p-10 text-left transition duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#1D9E75]/5 rounded-full blur-3xl group-hover:bg-[#1D9E75]/10 transition-colors duration-300" />
                <div className="w-14 h-14 bg-[#1D9E75]/10 border border-[#1D9E75]/30 rounded-2xl flex items-center justify-center mb-8" style={{ color: '#5DCAA5' }}>
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 3m0-3a2 2 0 110 3m-9 8h10M3 15a2 2 0 110-4h10a2 2 0 110 4M15 11v8m0-8h4a2 2 0 110 4h-4" />
                  </svg>
                </div>
                <h3 className="font-syne text-2xl font-bold text-white mb-4">Entrenamiento Adaptado</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Rutinas diseñadas según tu nivel, tiempo disponible y objetivos concretos. Avanza de forma segura y constante, sin necesidad de conocimientos previos.
                </p>
                <ul className="space-y-3.5 text-slate-300">
                  {[
                    'Rutinas personalizadas según tu disponibilidad',
                    'Vídeo-guía para cada ejercicio en la App',
                    'Seguimiento de progresión semana a semana',
                    'Técnica correcta y feedback continuo',
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-medium">
                      <CheckIcon />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#1A2B1E]/30 border border-[#1D9E75]/20 hover:border-[#5DCAA5]/40 rounded-3xl p-8 md:p-10 text-left transition duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#5DCAA5]/5 rounded-full blur-3xl group-hover:bg-[#5DCAA5]/10 transition-colors duration-300" />
                <div className="w-14 h-14 bg-[#5DCAA5]/10 border border-[#5DCAA5]/30 rounded-2xl flex items-center justify-center mb-8" style={{ color: '#5DCAA5' }}>
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="font-syne text-2xl font-bold text-white mb-4">Nutrición con Sentido</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Aprende a comer bien sin obsesionarte. Planes flexibles y sostenibles, adaptados a tu vida real, tus gustos y tu familia.
                </p>
                <ul className="space-y-3.5 text-slate-300">
                  {[
                    'Distribución de macros ajustada a tu metabolismo',
                    'Menú flexible con recetario intercambiable',
                    'Lista de la compra semanal optimizada',
                    'Estrategias para comer fuera sin perder el rumbo',
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-medium">
                      <CheckIcon color="#5DCAA5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── METHODOLOGY ─── */}
        <section id="metodologia" className="max-w-7xl mx-auto px-6 py-24 text-left">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="font-syne text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight m-0">
                Cómo Funciona el Cambio en 4 Pasos
              </h2>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                No hay atajos, pero sí hay un camino claro. Una metodología estructurada que genera resultados visibles desde las primeras semanas y hábitos que perduran.
              </p>
              <div className="pt-4">
                <Link to="/register" className="inline-flex items-center gap-2 bg-[#1A2B1E] hover:bg-[#1D9E75]/20 border border-[#1D9E75]/30 text-white font-bold py-3 px-6 rounded-xl transition duration-200 decoration-none text-sm">
                  Empezar ahora
                  <svg className="w-4 h-4" style={{ color: '#5DCAA5' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
              {[
                { n: 1, c: '#1D9E75', title: 'Valoración Inicial',        text: 'Analizamos tu punto de partida: historial, lesiones, hábitos, gustos y disponibilidad real para construir algo que encaje con tu vida.' },
                { n: 2, c: '#5DCAA5', title: 'Plan Personalizado',         text: 'Diseñamos tu rutina de entrenamiento y tu menú semanal adaptados exactamente a tus metas y a tu ritmo de vida cotidiano.' },
                { n: 3, c: '#1D9E75', title: 'Acompañamiento Activo',      text: 'Registra tu progreso en la plataforma y consulta tus dudas. Soporte real con respuesta garantizada en menos de 24 horas.' },
                { n: 4, c: '#5DCAA5', title: 'Revisión y Ajuste Continuo', text: 'Evaluamos tus avances cada semana y ajustamos el plan para que siempre estés avanzando, sin estancarte ni frustrarte.' },
              ].map(({ n, c, title, text }) => (
                <div key={n} className="bg-[#1A2B1E]/20 border border-[#1D9E75]/15 p-6 rounded-2xl space-y-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-base border" style={{ background: `${c}18`, borderColor: `${c}35`, color: c }}>
                    {n}
                  </div>
                  <h4 className="font-syne text-lg font-bold text-white">{title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRICING ─── */}
        <section id="planes" className="bg-[#0D1710] py-24 border-t border-[#1D9E75]/10">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto space-y-4 mb-12">
              <h2 className="font-syne text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight m-0">
                Planes Claros y Sin Letra Pequeña
              </h2>
              <p className="text-slate-400 text-base md:text-lg">
                Elige el nivel de compromiso que mejor encaja con tu momento. Todos los planes incluyen acceso completo a la plataforma y seguimiento personalizado.
              </p>
              <div className="inline-flex bg-[#111A14] p-1 rounded-2xl border border-[#1D9E75]/20 mt-4">
                {[
                  { id: 'monthly',  label: 'Mensual' },
                  { id: '3months', label: '3 Meses (Recomendado)' },
                  { id: '6months', label: '6 Meses (Mejor Valor)' },
                ].map(({ id, label }) => (
                  <button key={id} onClick={() => setActivePlanTab(id)}
                    className={`px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer ${activePlanTab === id ? 'text-white shadow' : 'text-slate-400 hover:text-slate-200 bg-transparent border-0'}`}
                    style={activePlanTab === id ? { background: '#1D9E75' } : {}}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-w-3xl mx-auto">
              {activePlanTab === 'monthly' && (
                <div className="bg-[#1A2B1E]/40 border border-[#1D9E75]/20 rounded-3xl p-8 md:p-12 text-left grid md:grid-cols-12 gap-8 items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#1D9E75]/5 rounded-full blur-2xl" />
                  <div className="md:col-span-7 space-y-6">
                    <h3 className="font-syne text-2xl font-bold text-white">Plan Mensual</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Ideal para dar el primer paso y comprobar el método por ti mismo, con toda la guía profesional desde el día uno.
                    </p>
                    <ul className="space-y-3.5 text-slate-300 text-sm">
                      {['Rutina de entrenamiento personalizada en la App', 'Plan nutricional macro ajustado a tus objetivos', 'Soporte y resolución de dudas en 24h'].map(item => (
                        <li key={item} className="flex items-center gap-2.5"><CheckIcon /> {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:col-span-5 text-center md:text-right space-y-4">
                    <div>
                      <span className="font-syne text-5xl font-extrabold text-white">125€</span>
                      <span className="text-slate-500 font-medium"> / mes</span>
                    </div>
                    <Link to="/register?plan=monthly" className="w-full inline-block text-white font-extrabold py-3.5 px-6 rounded-xl transition duration-200 text-center decoration-none text-sm" style={{ background: '#1D9E75' }}
                      onMouseEnter={e => e.target.style.background = '#0F6E56'} onMouseLeave={e => e.target.style.background = '#1D9E75'}>
                      Elegir Plan Mensual
                    </Link>
                  </div>
                </div>
              )}

              {activePlanTab === '3months' && (
                <div className="bg-[#1A2B1E]/50 rounded-3xl p-8 md:p-12 text-left grid md:grid-cols-12 gap-8 items-center relative overflow-hidden shadow-2xl" style={{ border: '2px solid #1D9E75' }}>
                  <div className="absolute top-4 right-4 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: '#1D9E75' }}>Más Popular</div>
                  <div className="md:col-span-7 space-y-6">
                    <h3 className="font-syne text-2xl font-bold text-white flex items-center gap-2">
                      Plan 3 Meses
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md border" style={{ color: '#5DCAA5', background: '#5DCAA515', borderColor: '#5DCAA530' }}>Ahorra 20%</span>
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      El tiempo que la ciencia recomienda para crear hábitos reales. 90 días son suficientes para notar cambios físicos y mentales sólidos y duraderos.
                    </p>
                    <ul className="space-y-3.5 text-slate-300 text-sm">
                      {['Todo el plan mensual incluido', 'Check-ins semanales: peso, fotos y medidas', 'Ajustes ilimitados en comidas y rutinas', 'Soporte prioritario por chat privado'].map(item => (
                        <li key={item} className="flex items-center gap-2.5"><CheckIcon color="#5DCAA5" /> {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:col-span-5 text-center md:text-right space-y-4">
                    <div>
                      <span className="font-syne text-5xl font-extrabold text-white">300€</span>
                      <span className="text-slate-500 font-medium"> / 3 meses</span>
                      <p className="text-xs text-slate-500 mt-1">Equivale a 100€ al mes</p>
                    </div>
                    <Link to="/register?plan=3months" className="w-full inline-block text-white font-extrabold py-3.5 px-6 rounded-xl transition duration-200 text-center decoration-none text-sm shadow-lg" style={{ background: 'linear-gradient(to right, #1D9E75, #5DCAA5)' }}>
                      Elegir Plan 3 Meses
                    </Link>
                  </div>
                </div>
              )}

              {activePlanTab === '6months' && (
                <div className="bg-[#1A2B1E]/40 border border-[#1D9E75]/20 rounded-3xl p-8 md:p-12 text-left grid md:grid-cols-12 gap-8 items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#5DCAA5]/5 rounded-full blur-2xl" />
                  <div className="md:col-span-7 space-y-6">
                    <h3 className="font-syne text-2xl font-bold text-white flex items-center gap-2">
                      Plan 6 Meses
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md border" style={{ color: '#5DCAA5', background: '#5DCAA515', borderColor: '#5DCAA530' }}>Ahorra 30%</span>
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      El compromiso total. Medio año para instalar hábitos que te acompañarán el resto de tu vida. El cambio más profundo y duradero.
                    </p>
                    <ul className="space-y-3.5 text-slate-300 text-sm">
                      {['Todo el plan trimestral incluido', 'Llamada estratégica mensual de 30 min por Zoom', 'Soporte VIP con acceso directo por WhatsApp'].map(item => (
                        <li key={item} className="flex items-center gap-2.5"><CheckIcon /> {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:col-span-5 text-center md:text-right space-y-4">
                    <div>
                      <span className="font-syne text-5xl font-extrabold text-white">525€</span>
                      <span className="text-slate-500 font-medium"> / 6 meses</span>
                      <p className="text-xs text-slate-500 mt-1">Equivale a 87,50€ al mes</p>
                    </div>
                    <Link to="/register?plan=6months" className="w-full inline-block text-white font-extrabold py-3.5 px-6 rounded-xl transition duration-200 text-center decoration-none text-sm" style={{ background: '#1D9E75' }}>
                      Elegir Plan 6 Meses
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section id="testimonios" className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="font-syne text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight m-0">
              Cambios Reales, Personas Reales
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              No prometemos transformaciones en semanas. Prometemos un método que funciona para personas con vidas reales, trabajos reales y tiempo limitado.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                initials: 'AM', name: 'Alejandro M., 43 años', tag: 'Hábitos de fuerza', tagC: '#1D9E75',
                text: '"Después de años sin resultados reales, encontré un método que se adapta a mi agenda. En 3 meses he ganado 4 kg de músculo y he aprendido a comer de verdad, sin restricciones absurdas."',
              },
              {
                initials: 'SR', name: 'Sandra R., 41 años', tag: 'Cambio de composición', tagC: '#5DCAA5',
                text: '"Perdí 11 kg en 5 meses sin pasar hambre y sin dejar de salir con mis amigas. Por fin entiendo cómo funciona mi cuerpo y cómo mantenerlo sin esfuerzo extremo."',
              },
              {
                initials: 'CG', name: 'Carlos G., 45 años', tag: 'Progresión gradual', tagC: '#1D9E75',
                text: '"Tenía la espalda fatal y mucho estrés acumulado. El plan se adaptó a mis limitaciones reales. Ahora entreno tres veces por semana y me siento mejor que con 30 años."',
              },
            ].map(({ initials, name, tag, tagC, text }) => (
              <div key={name} className="bg-[#1A2B1E]/20 border border-[#1D9E75]/15 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex gap-1 text-sm" style={{ color: '#5DCAA5' }}>★★★★★</div>
                  <p className="text-slate-300 text-sm leading-relaxed italic">{text}</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-[#1D9E75]/10">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: '#1D9E7518', border: '1px solid #1D9E7530', color: '#5DCAA5' }}>
                    {initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white m-0">{name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1 inline-block" style={{ color: tagC, background: `${tagC}15`, border: `1px solid ${tagC}30` }}>
                      {tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="relative rounded-3xl overflow-hidden border border-[#1D9E75]/20 p-8 md:p-16 text-center space-y-8 bg-[#1A2B1E]/20 backdrop-blur-md">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-[#1D9E75] to-[#5DCAA5] rounded-full blur-[100px] opacity-10 -z-10" />
            <h2 className="font-syne text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight m-0 max-w-2xl mx-auto">
              ¿Listo para Tu Cambio Real?
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
              Únete a YoPidoDieta y empieza con un método probado, sin presiones y a tu ritmo. Tu coach personal te acompaña desde el primer día.
            </p>
            <div className="flex justify-center pt-2">
              <Link to="/register" className="text-white font-extrabold text-base px-10 py-4 rounded-2xl transition duration-300 shadow-xl active:scale-[0.98] decoration-none" style={{ background: '#1D9E75' }}>
                Empieza Tu Transformación
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[#1D9E75]/10 bg-[#0A1209] py-12 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="decoration-none">
            <Logo size="sm" />
          </Link>
          <p>© 2026 YoPidoDieta. Todos los derechos reservados. Coach de transformación de hábitos.</p>
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
            {['Instagram', 'YouTube', 'Soporte'].map(s => (
              <span key={s} className="hover:text-white cursor-pointer transition-colors" style={{ color: '#888780' }}
                onMouseEnter={e => e.target.style.color = '#5DCAA5'} onMouseLeave={e => e.target.style.color = '#888780'}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
