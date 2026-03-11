import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HabitFlow — Seguimiento de Hábitos y Control de Gastos',
  description: 'Ecosistema completo para el seguimiento de hábitos y control de gastos personales. App móvil, bot de Telegram y dashboard con estadísticas.',
  keywords: ['hábitos', 'gastos', 'productividad', 'app', 'seguimiento', 'finanzas personales'],
  authors: [{ name: 'María Bravo Angulo' }],
  openGraph: {
    title: 'HabitFlow — Seguimiento de Hábitos y Control de Gastos',
    description: 'Ecosistema completo para el seguimiento de hábitos y control de gastos personales.',
    type: 'website',
    locale: 'es_ES',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
