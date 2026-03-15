'use client'

import { useEffect, useRef } from 'react'

const features = [
  {
    icon: '📋',
    title: 'CRUD de Hábitos',
    description: 'Crea, edita y elimina hábitos. Registra tu progreso diario y mantén rachas de días consecutivos.',
    gradient: 'from-primary-500/20 to-primary-600/5',
    border: 'border-primary-500/20',
  },
  {
    icon: '💰',
    title: 'Control de Gastos',
    description: 'Registra tus gastos por categorías. Visualiza a dónde va tu dinero con gráficos detallados.',
    gradient: 'from-accent-500/20 to-accent-600/5',
    border: 'border-accent-500/20',
  },
  {
    icon: '📊',
    title: 'Dashboard y Gráficos',
    description: 'Estadísticas en tiempo real con gráficos de progreso, tendencias semanales y desglose por categorías.',
    gradient: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-500/20',
  },
  {
    icon: '🔥',
    title: 'Sistema de Rachas',
    description: 'Mantén la motivación con rachas de días consecutivos. Visualiza tu constancia y celebra tus logros.',
    gradient: 'from-orange-500/20 to-orange-600/5',
    border: 'border-orange-500/20',
  },
  {
    icon: '🌙',
    title: 'Modo Oscuro',
    description: 'Interfaz con tema claro y oscuro. Diseño elegante que se adapta a tu preferencia.',
    gradient: 'from-purple-500/20 to-purple-600/5',
    border: 'border-purple-500/20',
  },
  {
    icon: '🔐',
    title: 'Seguridad Avanzada',
    description: 'Firebase Auth, JWT, rate limiting, validación de inputs y cifrado de datos en reposo.',
    gradient: 'from-red-500/20 to-red-600/5',
    border: 'border-red-500/20',
  },
]

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    const cards = sectionRef.current?.querySelectorAll('.section-enter')
    cards?.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" />
      <div className="blob w-[400px] h-[400px] bg-primary-500 top-[10%] right-[-150px]" style={{ opacity: 0.1 }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 section-enter">
          <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary-300 font-medium mb-6">
            ✨ Características
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Todo lo que necesitas para{' '}
            <span className="gradient-text">mejorar tu vida</span>
          </h2>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            Un ecosistema completo de herramientas diseñadas para ayudarte a construir mejores hábitos y controlar tus finanzas.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className={`section-enter feature-card rounded-2xl bg-gradient-to-br ${feat.gradient} border ${feat.border} p-8 group cursor-default`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
              <p className="text-dark-300 leading-relaxed text-sm">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
