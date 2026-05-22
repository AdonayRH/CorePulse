import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import heroCoach from '../assets/hero_coach.png'

export default function LandingPage() {
  const [activePlanTab, setActivePlanTab] = useState('quarterly')

  // Smooth scroll helper
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#090b11] text-slate-100 font-sans overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* BACKGROUND GLOWS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[130px] -z-10 pointer-events-none"></div>

      {/* ─── NAVBAR ─── */}
      <header className="sticky top-0 z-50 w-full bg-[#090b11]/70 backdrop-blur-xl border-b border-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group decoration-none">
            <span className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
              C
            </span>
            <span className="text-2xl font-black tracking-tight text-white">
              Core<span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">Pulse</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('metodologia')} 
              className="text-slate-350 hover:text-white font-medium text-sm transition-colors duration-200 cursor-pointer bg-transparent border-0"
            >
              Metodología
            </button>
            <button 
              onClick={() => scrollToSection('servicios')} 
              className="text-slate-350 hover:text-white font-medium text-sm transition-colors duration-200 cursor-pointer bg-transparent border-0"
            >
              Servicios
            </button>
            <button 
              onClick={() => scrollToSection('planes')} 
              className="text-slate-350 hover:text-white font-medium text-sm transition-colors duration-200 cursor-pointer bg-transparent border-0"
            >
              Planes
            </button>
            <button 
              onClick={() => scrollToSection('testimonios')} 
              className="text-slate-350 hover:text-white font-medium text-sm transition-colors duration-200 cursor-pointer bg-transparent border-0"
            >
              Testimonios
            </button>
          </nav>

          {/* Auth CTA Buttons */}
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-slate-300 hover:text-white font-semibold text-sm px-4 py-2 rounded-xl transition duration-200 decoration-none"
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/register" 
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-semibold rounded-xl group bg-gradient-to-br from-purple-600 to-emerald-500 group-hover:from-purple-600 group-hover:to-emerald-500 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-purple-800 decoration-none shadow-lg shadow-purple-500/10 hover:shadow-purple-500/25 active:scale-95 transition-transform duration-150 mt-2"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-slate-950 rounded-xl group-hover:bg-opacity-0 font-bold">
                Comenzar
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ─── HERO SECTION ─── */}
        <section id="hero" className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-20 md:pb-28 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-8 text-left">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold rounded-full tracking-wide">
              <span>★ Entrenador Personal & Nutricionista Certificado</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] m-0">
              Entrena con <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Propósito</span>. <br />
              Aliméntate con <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Ciencia</span>.
            </h1>

            {/* Description */}
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl">
              Rompe el ciclo de las dietas restrictivas y los entrenamientos genéricos. Consigue tu mejor versión con un método integral y científico diseñado 100% a tu medida.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600 text-white font-extrabold text-base px-8 py-4 rounded-2xl transition duration-300 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/25 active:scale-[0.98] decoration-none"
              >
                Comienza Tu Cambio
              </Link>
              <button 
                onClick={() => scrollToSection('planes')} 
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-200 hover:text-white font-bold text-base px-8 py-4 rounded-2xl transition duration-300 backdrop-blur-md cursor-pointer"
              >
                Ver Planes
              </button>
            </div>

            {/* Trust Stats */}
            <div className="pt-8 border-t border-slate-900 grid grid-cols-3 gap-6">
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-white">+350</p>
                <p className="text-xs md:text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">Clientes Activos</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-purple-400">98%</p>
                <p className="text-xs md:text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">Éxito en Objetivos</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-emerald-400">100%</p>
                <p className="text-xs md:text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">Fórmula a Medida</p>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="md:col-span-5 relative flex justify-center">
            {/* Glowing ring under image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-emerald-500 rounded-3xl blur-[40px] opacity-20 -z-10 scale-95"></div>
            
            <div className="relative border border-slate-800/80 p-3 bg-slate-950/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl max-w-sm md:max-w-none">
              <img 
                src={heroCoach} 
                alt="Personal Trainer & Sports Nutritionist Coach" 
                className="w-full h-auto object-cover rounded-2xl"
              />
              
              {/* Floating Badge 1 */}
              <div className="absolute top-8 -left-6 bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-xl">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-medium">Entrenamientos</p>
                  <p className="text-sm font-bold text-white">Máxima Intensidad</p>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute bottom-8 -right-6 bg-slate-900/90 backdrop-blur-xl border border-emerald-550/30 p-4 rounded-2xl flex items-center gap-3 shadow-xl">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-medium">Nutrición</p>
                  <p className="text-sm font-bold text-white">Déficit Inteligente</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── DUAL FOCUS SECTION (SERVICES) ─── */}
        <section id="servicios" className="bg-[#0b0e16] py-24 border-y border-slate-900/70">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight m-0">
                La Sinergia Perfecta
              </h2>
              <p className="text-slate-400 text-base md:text-lg">
                Hacer ejercicio sin comer bien es frustrante. Comer bien sin estímulo muscular no da tono. Descubre la potencia de un plan integrado desde el primer día.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Training Service Card */}
              <div className="bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/30 rounded-3xl p-8 md:p-10 text-left transition duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors duration-300"></div>
                
                <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center text-purple-400 mb-8 shadow-inner">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 3m0-3a2 2 0 110 3m-9 8h10M3 15a2 2 0 110-4h10a2 2 0 110 4M15 11v8m0-8h4a2 2 0 110 4h-4" />
                  </svg>
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-4">Entrenamiento Inteligente</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Programación adaptada a tu nivel, disponibilidad y material disponible. Entrena con biomecánica correcta y progresión de cargas garantizada.
                </p>

                <ul className="space-y-3.5 text-slate-300">
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Rutinas específicas (Fuerza, Hipertrofia o Pérdida)
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Video-guía detallado para cada ejercicio en la App
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Progreso analítico de pesos y series por sesión
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Corrección técnica y feedback mediante video
                  </li>
                </ul>
              </div>

              {/* Nutrition Service Card */}
              <div className="bg-slate-900/30 border border-slate-800/80 hover:border-emerald-500/30 rounded-3xl p-8 md:p-10 text-left transition duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-300"></div>

                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 shadow-inner">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-4">Nutrición con Base Científica</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Dietas calculadas por macronutrientes adaptadas a tu metabolismo. Sin suplementos inútiles, sin pasar hambre extrema y disfrutando de la comida real.
                </p>

                <ul className="space-y-3.5 text-slate-300">
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Distribución óptima de Macros y Calorías diarias
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Menú flexible con recetario saludable e intercambiable
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Lista de la compra optimizada para ahorrar tiempo y dinero
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Estrategias para comer fuera y eventos sociales
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── METHODOLOGY & STEPS ─── */}
        <section id="metodologia" className="max-w-7xl mx-auto px-6 py-24 text-left">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight m-0">
                Tu Camino Hacia el Éxito en 4 Pasos
              </h2>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                No creemos en atajos ni milagros. El camino más rápido es hacer las cosas bien desde el primer momento. Esta es la metodología que garantiza resultados sólidos y duraderos.
              </p>
              <div className="pt-4">
                <Link to="/register" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold py-3 px-6 rounded-xl transition duration-200 decoration-none text-sm">
                  Empezar ahora
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
              {/* Step 1 */}
              <div className="bg-slate-900/20 border border-slate-800/80 p-6 rounded-2xl space-y-4">
                <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400 font-extrabold text-base">
                  1
                </div>
                <h4 className="text-lg font-bold text-white">Análisis & Entrevista Inicial</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Evaluamos tu historial médico, lesiones, hábitos diarios, gustos alimenticios y disponibilidad de horarios.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-900/20 border border-slate-800/80 p-6 rounded-2xl space-y-4">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 font-extrabold text-base">
                  2
                </div>
                <h4 className="text-lg font-bold text-white">Planificación de Rutina y Dieta</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Diseñamos tu rutina óptima de entrenamiento y tu menú semanal flexible calculado exactamente para tus metas.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-900/20 border border-slate-800/80 p-6 rounded-2xl space-y-4">
                <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400 font-extrabold text-base">
                  3
                </div>
                <h4 className="text-lg font-bold text-white">Ejecución en App & Soporte</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Registra tus pesos y comidas en nuestra plataforma web. Acceso a chat de resolución de dudas con respuesta en 24h.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-900/20 border border-slate-800/80 p-6 rounded-2xl space-y-4">
                <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400 font-extrabold text-base">
                  4
                </div>
                <h4 className="text-lg font-bold text-white">Evaluación & Ajustes</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Revisamos tus medidas y fotos semanalmente para ajustar el plan según cómo responda tu cuerpo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PRICING SECTION ─── */}
        <section id="planes" className="bg-[#0b0e16] py-24 border-t border-slate-900/70">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto space-y-4 mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight m-0">
                Planes Sencillos y Transparentes
              </h2>
              <p className="text-slate-400 text-base md:text-lg">
                Elige el nivel de compromiso que deseas. Todos los planes incluyen acceso completo a tu panel privado, dietas flexibles y rutinas estructuradas.
              </p>

              {/* Plan Tabs/Toggle */}
              <div className="inline-flex bg-slate-950 p-1 rounded-2xl border border-slate-850 mt-4">
                <button 
                  onClick={() => setActivePlanTab('monthly')} 
                  className={`px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer ${activePlanTab === 'monthly' ? 'bg-purple-650 text-white shadow' : 'text-slate-400 hover:text-slate-200 bg-transparent border-0'}`}
                >
                  Mensual
                </button>
                <button 
                  onClick={() => setActivePlanTab('quarterly')} 
                  className={`px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer ${activePlanTab === 'quarterly' ? 'bg-purple-650 text-white shadow' : 'text-slate-400 hover:text-slate-200 bg-transparent border-0'}`}
                >
                  Trimestral (Recomendado)
                </button>
                <button 
                  onClick={() => setActivePlanTab('annual')} 
                  className={`px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer ${activePlanTab === 'annual' ? 'bg-purple-650 text-white shadow' : 'text-slate-400 hover:text-slate-200 bg-transparent border-0'}`}
                >
                  Anual (Mejor Valor)
                </button>
              </div>
            </div>

            {/* Pricing Cards Container */}
            <div className="max-w-3xl mx-auto">
              {activePlanTab === 'monthly' && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-12 text-left grid md:grid-cols-12 gap-8 items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
                  <div className="md:col-span-7 space-y-6">
                    <h3 className="text-2xl font-extrabold text-white">Plan Mensual</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Ideal para probar el método y comenzar a estructurar tus rutinas y alimentación con guía profesional.
                    </p>
                    <ul className="space-y-3.5 text-slate-350 text-sm">
                      <li className="flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Rutina a medida e interactiva en la App
                      </li>
                      <li className="flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Estructura macro-nutricional personalizada
                      </li>
                      <li className="flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Soporte técnico por correo/chat
                      </li>
                    </ul>
                  </div>
                  <div className="md:col-span-5 text-center md:text-right space-y-4">
                    <div>
                      <span className="text-5xl font-extrabold text-white">49€</span>
                      <span className="text-slate-500 font-medium"> / mes</span>
                    </div>
                    <Link to="/register" className="w-full inline-block bg-purple-500 hover:bg-purple-600 text-white font-extrabold py-3.5 px-6 rounded-xl transition duration-200 text-center decoration-none text-sm">
                      Elegir Plan Mensual
                    </Link>
                  </div>
                </div>
              )}

              {activePlanTab === 'quarterly' && (
                <div className="bg-slate-900/50 border-2 border-purple-550 rounded-3xl p-8 md:p-12 text-left grid md:grid-cols-12 gap-8 items-center relative overflow-hidden shadow-2xl shadow-purple-500/5">
                  {/* Popular tag */}
                  <div className="absolute top-4 right-4 bg-purple-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                    Más Popular
                  </div>
                  <div className="md:col-span-7 space-y-6">
                    <h3 className="text-2xl font-extrabold text-white flex items-center gap-2">
                      Plan Trimestral
                      <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">Ahorra 18%</span>
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      El periodo recomendado por la ciencia. 90 días son suficientes para lograr adaptaciones neuromusculares y hábitos nutricionales sólidos.
                    </p>
                    <ul className="space-y-3.5 text-slate-350 text-sm">
                      <li className="flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Todo el plan Mensual de Entrenamiento & Nutrición
                      </li>
                      <li className="flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Check-ins semanales (Control de peso, fotos y medidas)
                      </li>
                      <li className="flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Ajustes ilimitados en comidas y rutinas
                      </li>
                      <li className="flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Soporte prioritario 24/7 en chat privado
                      </li>
                    </ul>
                  </div>
                  <div className="md:col-span-5 text-center md:text-right space-y-4">
                    <div>
                      <span className="text-5xl font-extrabold text-white">120€</span>
                      <span className="text-slate-500 font-medium"> / trimestre</span>
                      <p className="text-xs text-slate-500 mt-1">Equivale a solo 40€ al mes</p>
                    </div>
                    <Link to="/register" className="w-full inline-block bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600 text-white font-extrabold py-3.5 px-6 rounded-xl transition duration-200 text-center shadow-lg shadow-purple-500/10 decoration-none text-sm">
                      Elegir Plan Trimestral
                    </Link>
                  </div>
                </div>
              )}

              {activePlanTab === 'annual' && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-12 text-left grid md:grid-cols-12 gap-8 items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
                  <div className="md:col-span-7 space-y-6">
                    <h3 className="text-2xl font-extrabold text-white flex items-center gap-2">
                      Plan Anual
                      <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">Ahorra 38%</span>
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      El plan del máximo compromiso. Construye una transformación absoluta que mantendrás por el resto de tu vida.
                    </p>
                    <ul className="space-y-3.5 text-slate-355 text-sm">
                      <li className="flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Todo el plan Trimestral premium
                      </li>
                      <li className="flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Llamada de estrategia mensual de 30 min por Zoom
                      </li>
                      <li className="flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Soporte técnico VIP con acceso directo por WhatsApp
                      </li>
                    </ul>
                  </div>
                  <div className="md:col-span-5 text-center md:text-right space-y-4">
                    <div>
                      <span className="text-5xl font-extrabold text-white">360€</span>
                      <span className="text-slate-500 font-medium"> / año</span>
                      <p className="text-xs text-slate-500 mt-1">Equivale a solo 30€ al mes</p>
                    </div>
                    <Link to="/register" className="w-full inline-block bg-purple-500 hover:bg-purple-600 text-white font-extrabold py-3.5 px-6 rounded-xl transition duration-200 text-center decoration-none text-sm">
                      Elegir Plan Anual
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS SECTION ─── */}
        <section id="testimonios" className="max-w-7xl mx-auto px-6 py-24 text-left">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight m-0">
              Vidas Transformadas Realmente
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              El verdadero éxito no se mide en números, sino en hábitos que duran para siempre. Estos son algunos testimonios de personas que decidieron tomar el control de su cuerpo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 space-y-6 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                {/* Stars */}
                <div className="flex gap-1 text-purple-400 text-sm">★★★★★</div>
                <p className="text-slate-300 text-sm leading-relaxed italic">
                  "Buscaba un cambio integral ya que estaba cansado de dietas de pollo y arroz que no podía sostener. Aquí aprendí a comer de forma inteligente y gané 5kg de masa muscular."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-900/60">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs">
                  AM
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white m-0">Alejandro Muñoz</h4>
                  <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider mt-1 inline-block">Hipertrofia</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 space-y-6 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex gap-1 text-purple-400 text-sm">★★★★★</div>
                <p className="text-slate-300 text-sm leading-relaxed italic">
                  "Gracias a las pautas nutricionales flexibles he perdido 12kg en 6 meses sin ansiedad, compaginándolo perfectamente con mi trabajo de oficina y mi vida social."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-900/60">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs">
                  SR
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white m-0">Sandra Rodríguez</h4>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider mt-1 inline-block">Recomposición</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 space-y-6 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex gap-1 text-purple-400 text-sm">★★★★★</div>
                <p className="text-slate-300 text-sm leading-relaxed italic">
                  "Poder registrar mis marcas y ver mi menú de forma clara me ha motivado mucho a entrenar con constancia. El soporte técnico y humano es inigualable."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-900/60">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs">
                  CG
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white m-0">Carlos Gómez</h4>
                  <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider mt-1 inline-block">Fuerza & Rendimiento</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA BANNER ─── */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 p-8 md:p-16 text-center space-y-8 bg-slate-900/20 backdrop-blur-md">
            {/* Background glowing effects inside banner */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-purple-650 to-emerald-500 rounded-full blur-[100px] opacity-15 -z-10"></div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight m-0 max-w-2xl mx-auto">
              ¿Listo para Construir Tu Nueva Versión?
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
              Regístrate en CorePulse en segundos y elige el plan que mejor se adapte a tu estilo de vida. Tu entrenador y nutricionista digital te está esperando.
            </p>
            <div className="flex justify-center pt-2">
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600 text-white font-extrabold text-base px-10 py-4.5 rounded-2xl transition duration-300 shadow-xl shadow-purple-500/15 hover:shadow-purple-500/25 active:scale-[0.98] decoration-none"
              >
                Comienza Tu Transformación
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-slate-900 bg-[#07090e] py-12 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-black text-sm shadow">
              C
            </span>
            <span className="text-lg font-black tracking-tight text-white">
              Core<span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">Pulse</span>
            </span>
          </div>

          {/* Copyright */}
          <p>© 2026 CorePulse. Todos los derechos reservados. Diseñado para entrenar inteligente y nutrir con ciencia.</p>

          {/* Social icons links placeholders */}
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="hover:text-purple-400 cursor-pointer">Instagram</span>
            <span className="hover:text-purple-400 cursor-pointer">YouTube</span>
            <span className="hover:text-purple-400 cursor-pointer">Soporte</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
