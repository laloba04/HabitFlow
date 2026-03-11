import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Platforms from '@/components/Platforms'
import Stats from '@/components/Stats'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Platforms />
      <Stats />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
