'use client'

import { useEffect, useRef } from 'react'

const securityLayers = [
  {
    icon: '🔐',
    title: 'Firebase Auth',
    description: 'Email/password y proveedores sociales. JWT tokens con renovación automática de sesión.',
    items: ['JWT Tokens', 'Refresh automático', 'Providers sociales'],
    color: 'accent',
  },
  {
    icon: '🛡️',
    title: 'API Gateway',
    description: 'Rate limiting con throttling y burst limit. HTTPS obligatorio con TLS 1.2+.',
    items: ['100 req/s por IP', 'Burst limit: 200', 'TLS 1.2+'],
    color: 'primary',
  },
  {
    icon: 'λ',
    title: 'Lambda Validation',
    description: 'Verificación JWT, sanitización de inputs y logging seguro sin datos sensibles.',
    items: ['Verificación JWT', 'Sanitización XSS', 'IAM mínimo privilegio'],
    color: 'blue',
  },
  {
    icon: '🗄️',
    title: 'DynamoDB',
    description: 'Cifrado en reposo con AWS KMS. Acceso exclusivo por IAM, sin credenciales en código.',
    items: ['Cifrado KMS', 'Acceso por IAM', 'Queries seguras via SDK'],
    color: 'red',
  },
  {
    icon: '🖥️',
    title: 'Frontend',
    description: 'Sanitización XSS, Content Security Policy y Firebase Security Rules por usuario.',
    items: ['CSP Headers', 'Escape XSS', 'Security Rules'],
    color: 'purple',
  },
]

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string; glow: string }> = {
  primary: {
    bg: 'from-primary-500/15 to-primary-600/5',
    border: 'border-primary-500/20 hover:border-primary-500/40',
    text: 'text-primary-400',
    badge: 'bg-primary-500/15 text-primary-300 border-primary-500/20',
    glow: 'group-hover:shadow-primary-500/10',
  },
  accent: {
    bg: 'from-accent-500/15 to-accent-600/5',
    border: 'border-accent-500/20 hover:border-accent-500/40',
    text: 'text-accent-400',
    badge: 'bg-accent-500/15 text-accent-300 border-accent-500/20',
    glow: 'group-hover:shadow-accent-500/10',
  },
  blue: {
    bg: 'from-blue-500/15 to-blue-600/5',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    text: 'text-blue-400',
    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    glow: 'group-hover:shadow-blue-500/10',
  },
  red: {
    bg: 'from-red-500/15 to-red-600/5',
    border: 'border-red-500/20 hover:border-red-500/40',
    text: 'text-red-400',
    badge: 'bg-red-500/15 text-red-300 border-red-500/20',
    glow: 'group-hover:shadow-red-500/10',
  },
  purple: {
    bg: 'from-purple-500/15 to-purple-600/5',
    border: 'border-purple-500/20 hover:border-purple-500/40',
    text: 'text-purple-400',
    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
    glow: 'group-hover:shadow-purple-500/10',
  },
}

export default function Security() {
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
    <section id="security" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" />
      <div className="blob w-[500px] h-[500px] bg-red-500 top-[20%] left-[-200px]" style={{ opacity: 0.06 }} />
      <div className="blob w-[400px] h-[400px] bg-primary-500 bottom-[10%] right-[-150px]" style={{ opacity: 0.08 }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 section-enter">
          <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary-300 font-medium mb-6">
            🔐 Seguridad
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Protección en{' '}
            <span className="gradient-text">cada capa</span>
          </h2>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            5 capas de seguridad desde el frontend hasta la base de datos. Cada componente implementa sus propias medidas de protección.
          </p>
        </div>

        {/* Security flow - visual pipeline */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {securityLayers.map((layer, i) => {
            const colors = colorMap[layer.color]
            return (
              <div
                key={layer.title}
                className={`section-enter feature-card rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} p-8 group cursor-default transition-all duration-400 ${colors.glow}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className={`text-3xl ${layer.icon === 'λ' ? `${colors.text} font-bold` : ''} group-hover:scale-110 transition-transform duration-300`}>
                    {layer.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{layer.title}</h3>
                  </div>
                </div>
                <p className="text-dark-300 text-sm leading-relaxed mb-5">{layer.description}</p>
                <div className="flex flex-wrap gap-2">
                  {layer.items.map((item) => (
                    <span key={item} className={`px-3 py-1 rounded-lg text-xs font-medium border ${colors.badge}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Production note card */}
          <div
            className="section-enter feature-card rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 hover:border-orange-500/40 p-8 group cursor-default transition-all duration-400 lg:col-span-1 md:col-span-2 lg:col-auto flex flex-col justify-center"
            style={{ transitionDelay: '500ms' }}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">⚠️</div>
              <h3 className="text-lg font-bold text-white">Nota Producción</h3>
            </div>
            <p className="text-dark-300 text-sm leading-relaxed">
              En producción se añadiría <span className="text-orange-300 font-medium">AWS WAF</span> para protección adicional contra SQL injection, XSS y DDoS. Para este proyecto se usa throttling de API Gateway como alternativa viable.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
