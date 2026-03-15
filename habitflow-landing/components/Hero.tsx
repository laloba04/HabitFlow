'use client'

import { useEffect, useRef } from 'react'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (el) {
      el.classList.add('visible')
    }
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--gradient-hero)' }}
    >
      {/* Blobs */}
      <div className="blob w-[500px] h-[500px] bg-primary-500 top-[-100px] right-[-100px] animate-pulse-soft" />
      <div className="blob w-[400px] h-[400px] bg-accent-500 bottom-[-50px] left-[-100px] animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
      <div className="blob w-[300px] h-[300px] bg-primary-400 top-[40%] left-[20%] animate-pulse-soft" style={{ animationDelay: '3s', opacity: 0.15 }} />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text side */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            Ecosistema completo de productividad
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
            Tus hábitos,{' '}
            <span className="gradient-text">tu progreso</span>
          </h1>

          <p className="text-lg md:text-xl text-dark-300 max-w-lg leading-relaxed">
            Seguimiento de hábitos y control de gastos personales. 
            App móvil, bot de Telegram y dashboard con estadísticas en tiempo real.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#cta"
              id="hero-cta-primary"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg hover:from-primary-400 hover:to-primary-500 transition-all duration-300 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 active:scale-95"
            >
              Comenzar Ahora →
            </a>
            <a
              href="#features"
              id="hero-cta-secondary"
              className="px-8 py-4 rounded-full glass text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Ver Características
            </a>
          </div>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-3 pt-4">
            {['Ionic', 'Angular', 'AWS Lambda', 'Firebase', 'Telegram'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-dark-300 border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Phone mockup side */}
        <div className="hidden lg:flex justify-center items-center">
          <div className="relative">
            {/* Glow behind phone */}
            <div className="absolute inset-0 bg-primary-500/20 rounded-[60px] blur-[60px] scale-110" />
            
            <div className="phone-mockup animate-float relative z-10">
              {/* Status bar */}
              <div className="h-12 px-6 flex items-end justify-between text-[10px] text-dark-400 font-medium">
                <span>9:41</span>
                <div className="flex gap-1 items-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/></svg>
                </div>
              </div>

              {/* App content mockup */}
              <div className="px-5 pt-3 space-y-4">
                <div className="text-center">
                  <p className="text-[10px] text-dark-400 font-medium">Buenos días 👋</p>
                  <p className="text-sm font-bold text-white mt-1">María</p>
                </div>

                {/* Habit cards */}
                <div className="space-y-2.5">
                  <div className="rounded-xl bg-gradient-to-r from-primary-500/20 to-primary-600/10 border border-primary-500/20 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🏃‍♀️</span>
                        <div>
                          <p className="text-[11px] font-semibold text-white">Ejercicio</p>
                          <p className="text-[9px] text-dark-400">Racha: 12 días 🔥</p>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">📚</span>
                        <div>
                          <p className="text-[11px] font-semibold text-white">Leer 30 min</p>
                          <p className="text-[9px] text-dark-400">Racha: 8 días 🔥</p>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-dark-500" />
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">💧</span>
                        <div>
                          <p className="text-[11px] font-semibold text-white">Beber 2L agua</p>
                          <p className="text-[9px] text-dark-400">Racha: 21 días 🔥</p>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🧘</span>
                        <div>
                          <p className="text-[11px] font-semibold text-white">Meditar</p>
                          <p className="text-[9px] text-dark-400">Racha: 5 días 🔥</p>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-dark-500" />
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="pt-1">
                  <div className="flex justify-between text-[9px] text-dark-400 mb-1.5">
                    <span>Progreso hoy</span>
                    <span className="text-primary-400 font-semibold">50%</span>
                  </div>
                  <div className="h-2 rounded-full bg-dark-700 overflow-hidden">
                    <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-primary-500 to-accent-400" />
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="absolute bottom-0 left-0 right-0 h-14 glass flex items-center justify-around px-6">
                <div className="flex flex-col items-center gap-0.5">
                  <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                  <span className="text-[8px] text-primary-400 font-medium">Inicio</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <svg className="w-4 h-4 text-dark-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
                  <span className="text-[8px] text-dark-500 font-medium">Stats</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <svg className="w-4 h-4 text-dark-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  <span className="text-[8px] text-dark-500 font-medium">Perfil</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-dark-400 font-medium">Scroll</span>
        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
