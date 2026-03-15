'use client'

import { useEffect, useRef } from 'react'

const techStack = [
  {
    category: 'Frontend Móvil',
    icon: '📱',
    items: [
      { name: 'Ionic 7', description: 'Framework híbrido' },
      { name: 'Angular 17', description: 'Framework SPA' },
      { name: 'Capacitor', description: 'Runtime nativo' },
    ],
    color: 'primary',
  },
  {
    category: 'Backend Cloud',
    icon: '☁️',
    items: [
      { name: 'AWS Lambda', description: 'Compute serverless' },
      { name: 'DynamoDB', description: 'Base de datos NoSQL' },
      { name: 'API Gateway', description: 'API REST + throttling' },
    ],
    color: 'accent',
  },
  {
    category: 'Autenticación',
    icon: '🔐',
    items: [
      { name: 'Firebase Auth', description: 'Identity provider' },
      { name: 'JWT', description: 'Tokens de sesión' },
      { name: 'Security Rules', description: 'Acceso por usuario' },
    ],
    color: 'red',
  },
  {
    category: 'Bot & Automation',
    icon: '🤖',
    items: [
      { name: 'Python', description: 'Lenguaje del bot' },
      { name: 'python-telegram-bot', description: 'SDK de Telegram' },
      { name: 'Firestore', description: 'Datos del bot' },
    ],
    color: 'blue',
  },
  {
    category: 'Landing & Web',
    icon: '🌐',
    items: [
      { name: 'Next.js 14', description: 'Framework React' },
      { name: 'Tailwind CSS', description: 'Utility-first CSS' },
      { name: 'Vercel', description: 'Hosting & deploy' },
    ],
    color: 'purple',
  },
  {
    category: 'DevOps & IaC',
    icon: '⚙️',
    items: [
      { name: 'SAM / CloudFormation', description: 'Infraestructura como código' },
      { name: 'CloudWatch', description: 'Monitorización & logs' },
      { name: 'GitHub', description: 'Control de versiones' },
    ],
    color: 'orange',
  },
]

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string; dot: string }> = {
  primary: {
    bg: 'from-primary-500/15 to-primary-600/5',
    border: 'border-primary-500/20 hover:border-primary-500/40',
    text: 'text-primary-400',
    badge: 'bg-primary-500/10 text-primary-300',
    dot: 'bg-primary-500',
  },
  accent: {
    bg: 'from-accent-500/15 to-accent-600/5',
    border: 'border-accent-500/20 hover:border-accent-500/40',
    text: 'text-accent-400',
    badge: 'bg-accent-500/10 text-accent-300',
    dot: 'bg-accent-500',
  },
  red: {
    bg: 'from-red-500/15 to-red-600/5',
    border: 'border-red-500/20 hover:border-red-500/40',
    text: 'text-red-400',
    badge: 'bg-red-500/10 text-red-300',
    dot: 'bg-red-500',
  },
  blue: {
    bg: 'from-blue-500/15 to-blue-600/5',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    text: 'text-blue-400',
    badge: 'bg-blue-500/10 text-blue-300',
    dot: 'bg-blue-500',
  },
  purple: {
    bg: 'from-purple-500/15 to-purple-600/5',
    border: 'border-purple-500/20 hover:border-purple-500/40',
    text: 'text-purple-400',
    badge: 'bg-purple-500/10 text-purple-300',
    dot: 'bg-purple-500',
  },
  orange: {
    bg: 'from-orange-500/15 to-orange-600/5',
    border: 'border-orange-500/20 hover:border-orange-500/40',
    text: 'text-orange-400',
    badge: 'bg-orange-500/10 text-orange-300',
    dot: 'bg-orange-500',
  },
}

export default function TechStack() {
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
    <section id="techstack" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-dark-950" />
      <div className="blob w-[500px] h-[500px] bg-purple-500 top-[30%] right-[-200px]" style={{ opacity: 0.06 }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 section-enter">
          <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary-300 font-medium mb-6">
            🛠️ Tech Stack
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Construido con{' '}
            <span className="gradient-text">tecnología moderna</span>
          </h2>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            Un stack completo orientado a escalabilidad, rendimiento y preparación para la certificación AWS Developer Associate.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((category, i) => {
            const colors = colorMap[category.color]
            return (
              <div
                key={category.category}
                className={`section-enter feature-card rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} p-8 group cursor-default transition-all duration-400`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{category.category}</h3>
                </div>

                <div className="space-y-3">
                  {category.items.map((item) => (
                    <div key={item.name} className={`flex items-center gap-3 p-3 rounded-xl ${colors.badge} transition-all duration-300`}>
                      <div className={`w-2 h-2 rounded-full ${colors.dot} flex-shrink-0`} />
                      <div>
                        <span className="text-sm font-semibold text-white">{item.name}</span>
                        <span className="text-xs text-dark-400 ml-2">— {item.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* AWS certification banner */}
        <div className="mt-16 section-enter">
          <div className="glass rounded-2xl p-8 md:p-10 max-w-4xl mx-auto text-center">
            <div className="text-3xl mb-4">🎓</div>
            <h3 className="text-xl font-bold text-white mb-3">AWS Certified Developer Associate</h3>
            <p className="text-dark-300 text-sm max-w-2xl mx-auto mb-6">
              Este proyecto cubre temas clave del examen: desarrollo serverless, DynamoDB, API Gateway, IAM, SAM/CloudFormation y CloudWatch.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Lambda', 'DynamoDB', 'API Gateway', 'IAM', 'SAM', 'CloudWatch'].map((service) => (
                <span key={service} className="px-4 py-2 rounded-xl bg-accent-500/15 border border-accent-500/20 text-sm text-accent-300 font-medium">
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
