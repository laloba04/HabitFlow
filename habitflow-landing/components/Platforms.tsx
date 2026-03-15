'use client'

import { useEffect, useRef } from 'react'

const platforms = [
  {
    icon: '📱',
    name: 'App Móvil',
    subtitle: 'iOS & Android',
    description: 'App híbrida con Ionic y Angular. Funciona en iOS, Android y Web con una sola base de código.',
    tech: ['Ionic 7', 'Angular 17', 'Capacitor'],
    color: 'primary',
  },
  {
    icon: '⚡',
    name: 'Backend Serverless',
    subtitle: 'AWS Cloud',
    description: 'API REST serverless con Lambda y DynamoDB. Escalable, seguro y con coste prácticamente cero.',
    tech: ['AWS Lambda', 'DynamoDB', 'API Gateway'],
    color: 'accent',
  },
  {
    icon: '🤖',
    name: 'Bot de Telegram',
    subtitle: 'Python',
    description: 'Registra hábitos y consulta estadísticas directamente desde Telegram sin abrir la app.',
    tech: ['Python', 'python-telegram-bot', 'Firestore'],
    color: 'blue',
  },
  {
    icon: '🌐',
    name: 'Landing Page',
    subtitle: 'Next.js',
    description: 'Página de presentación moderna y responsive. Desplegada en Vercel con rendimiento óptimo.',
    tech: ['Next.js 14', 'Tailwind CSS', 'Vercel'],
    color: 'purple',
  },
]

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  primary: {
    bg: 'from-primary-500/15 to-primary-600/5',
    border: 'border-primary-500/20 hover:border-primary-500/40',
    text: 'text-primary-400',
    badge: 'bg-primary-500/15 text-primary-300 border-primary-500/20',
  },
  accent: {
    bg: 'from-accent-500/15 to-accent-600/5',
    border: 'border-accent-500/20 hover:border-accent-500/40',
    text: 'text-accent-400',
    badge: 'bg-accent-500/15 text-accent-300 border-accent-500/20',
  },
  blue: {
    bg: 'from-blue-500/15 to-blue-600/5',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    text: 'text-blue-400',
    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  },
  purple: {
    bg: 'from-purple-500/15 to-purple-600/5',
    border: 'border-purple-500/20 hover:border-purple-500/40',
    text: 'text-purple-400',
    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
  },
}

export default function Platforms() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )
    const items = sectionRef.current?.querySelectorAll('.section-enter')
    items?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="platforms" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-dark-950" />
      <div className="blob w-[500px] h-[500px] bg-accent-500 bottom-0 left-[-200px]" style={{ opacity: 0.08 }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 section-enter">
          <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary-300 font-medium mb-6">
            🏗️ Arquitectura
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Un ecosistema{' '}
            <span className="gradient-text">multiplataforma</span>
          </h2>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            Cuatro componentes integrados que trabajan juntos para ofrecer la mejor experiencia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {platforms.map((platform, i) => {
            const colors = colorMap[platform.color]
            return (
              <div
                key={platform.name}
                className={`section-enter feature-card rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} p-8 transition-all duration-400`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="text-4xl">{platform.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                    <p className={`text-sm font-medium ${colors.text}`}>{platform.subtitle}</p>
                  </div>
                </div>
                <p className="text-dark-300 text-sm leading-relaxed mb-5">{platform.description}</p>
                <div className="flex flex-wrap gap-2">
                  {platform.tech.map((t) => (
                    <span key={t} className={`px-3 py-1 rounded-lg text-xs font-medium border ${colors.badge}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Architecture diagram */}
        <div className="mt-16 section-enter">
          <div className="glass rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
            <h3 className="text-lg font-bold text-white text-center mb-8">Flujo de datos</h3>
            <div className="space-y-4 text-center">
              <div className="flex flex-wrap justify-center gap-4">
                <div className="px-4 py-2 rounded-xl bg-primary-500/15 border border-primary-500/20 text-sm text-primary-300 font-medium">📱 Ionic App</div>
                <div className="px-4 py-2 rounded-xl bg-blue-500/15 border border-blue-500/20 text-sm text-blue-300 font-medium">🤖 Telegram Bot</div>
                <div className="px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-500/20 text-sm text-purple-300 font-medium">🌐 Landing</div>
              </div>
              <div className="text-dark-500 text-2xl">↓</div>
              <div className="inline-block px-6 py-3 rounded-xl bg-accent-500/15 border border-accent-500/20 text-sm text-accent-300 font-medium">🔐 Firebase Auth</div>
              <div className="text-dark-500 text-2xl">↓</div>
              <div className="inline-block px-6 py-3 rounded-xl bg-orange-500/15 border border-orange-500/20 text-sm text-orange-300 font-medium">⚡ API Gateway + throttling</div>
              <div className="text-dark-500 text-2xl">↓</div>
              <div className="inline-block px-6 py-3 rounded-xl bg-red-500/15 border border-red-500/20 text-sm text-red-300 font-medium">λ Lambda (validación)</div>
              <div className="text-dark-500 text-2xl">↓</div>
              <div className="inline-block px-6 py-3 rounded-xl bg-green-500/15 border border-green-500/20 text-sm text-green-300 font-medium">🗄️ DynamoDB</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
