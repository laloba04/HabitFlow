'use client'

import { useEffect, useRef, useState } from 'react'

const faqs = [
  {
    question: '¿En qué plataformas está disponible?',
    answer: 'HabitFlow funciona en iOS, Android y Web como app híbrida con Ionic. También puedes usar el bot de Telegram para acceso rápido sin abrir la app.',
  },
  {
    question: '¿Mis datos están seguros?',
    answer: 'Absolutamente. Usamos Firebase Auth para autenticación, JWT para verificación, rate limiting en API Gateway, validación de inputs en Lambda, y cifrado en reposo con AWS KMS en DynamoDB.',
  },
  {
    question: '¿Cuánto cuesta mantener el backend?',
    answer: 'El backend serverless en AWS tiene un coste estimado de 3-5€/mes gracias a Lambda (pago por uso), DynamoDB bajo demanda y Firebase Auth gratuito.',
  },
  {
    question: '¿Qué puedo hacer con el bot de Telegram?',
    answer: 'Puedes registrar hábitos completados, consultar tu racha actual, ver estadísticas rápidas y recibir recordatorios. Todo directamente desde Telegram.',
  },
  {
    question: '¿Se puede usar sin conexión?',
    answer: 'La app tiene capacidad offline básica gracias a Capacitor y almacenamiento local. Los datos se sincronizan automáticamente cuando recuperas la conexión.',
  },
  {
    question: '¿Cómo funciona el sistema de rachas?',
    answer: 'Cada hábito tiene un contador de días consecutivos. Cuando completas un hábito, tu racha aumenta. Si no lo completas un día, la racha se reinicia. Es una forma efectiva de mantener la constancia.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
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
    <section id="faq" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-dark-950" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <div className="text-center mb-16 section-enter">
          <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary-300 font-medium mb-6">
            ❓ FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Preguntas{' '}
            <span className="gradient-text">frecuentes</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="section-enter glass rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary-500/20"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <button
                id={`faq-toggle-${i}`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-white font-semibold pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-primary-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`faq-content ${openIndex === i ? 'open' : ''}`}
              >
                <p className="px-6 pb-6 text-dark-300 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
