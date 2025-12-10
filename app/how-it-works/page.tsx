"use client"

import { HowItWorksSection } from "@/components/how-it-works-section"
import { Starfield } from "@/components/starfield"

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Starfield />
      <HowItWorksSection />
    </main>
  )
}
