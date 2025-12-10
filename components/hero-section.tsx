"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, Sparkles } from "lucide-react"

interface HeroSectionProps {
  onEnterDashboard: () => void
}

export function HeroSection({ onEnterDashboard }: HeroSectionProps) {
  return (
    <section id="hero" className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      {/* Artistic Background Layer 1 - Large ambient glows */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large gradient spheres */}
        <div className="absolute -top-24 -left-24 sm:-top-48 sm:-left-48 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-gradient-to-br from-purple-900/60 via-cyan-700/40 to-transparent rounded-full blur-[80px] sm:blur-[120px] animate-pulse-glow" />
        <div
          className="absolute -bottom-48 -right-48 w-[700px] h-[700px] bg-gradient-to-tl from-orange-500/60 via-yellow-400/50 to-transparent rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/40 via-purple-800/45 to-cyan-600/35 rounded-full blur-[140px] animate-pulse-glow"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Artistic Background Layer 2 - Medium floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-[20%] left-[15%] w-64 h-64 bg-gradient-to-br from-cyan-400/50 to-blue-600/40 rounded-full blur-[80px] animate-float"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute top-[60%] right-[20%] w-80 h-80 bg-gradient-to-tl from-teal-700/50 to-purple-900/45 rounded-full blur-[90px] animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-[30%] left-[40%] w-72 h-72 bg-gradient-to-tr from-yellow-400/50 to-orange-500/45 rounded-full blur-[85px] animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[40%] right-[10%] w-56 h-56 bg-gradient-to-bl from-purple-700/50 to-blue-600/40 rounded-full blur-[75px] animate-float"
          style={{ animationDelay: "2.5s" }}
        />
      </div>

      {/* Artistic Background Layer 3 - Accent highlights */}
      <div className="absolute inset-0 overflow-hidden mix-blend-screen">
        <div className="absolute top-[25%] right-[30%] w-32 h-32 bg-purple-600/50 rounded-full blur-[60px] animate-pulse-glow" />
        <div
          className="absolute bottom-[35%] left-[25%] w-40 h-40 bg-cyan-400/55 rounded-full blur-[65px] animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[50%] left-[60%] w-36 h-36 bg-orange-400/60 rounded-full blur-[70px] animate-pulse-glow"
          style={{ animationDelay: "1.8s" }}
        />
      </div>

      {/* Artistic grain overlay for texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20" />

      {/* Lighter radial gradient vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_70%,rgba(0,0,0,0.6)_100%)]" />

      {/* Keyhole icon */}
      <div className="relative mb-6 sm:mb-8 animate-float">
        <div className="w-12 h-20 sm:w-20 sm:h-32 relative">
          <svg viewBox="0 0 80 128" className="w-full h-full">
            <defs>
              <linearGradient id="keyhole-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4dd4d4" />
                <stop offset="30%" stopColor="#4DA6FF" />
                <stop offset="65%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ff9a3c" />
              </linearGradient>
            </defs>
            <path
              d="M40 0 C60 0 80 20 80 45 C80 60 70 72 55 78 L55 128 L25 128 L25 78 C10 72 0 60 0 45 C0 20 20 0 40 0 Z M40 25 C30 25 22 33 22 43 C22 53 30 61 40 61 C50 61 58 53 58 43 C58 33 50 25 40 25 Z"
              fill="url(#keyhole-gradient)"
            />
          </svg>
        </div>
      </div>

      {/* Main headline */}
      <div className="text-center max-w-5xl mx-auto z-10 px-4">
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight mb-4 sm:mb-6 text-balance leading-tight">
          <span className="neon-gradient-text">RAFFERO</span>
          <br />
          <span className="text-foreground">ANONYMOUS</span>
          <br />
          <span className="neon-gradient-text">RAFFLE</span>
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
          Experience truly private raffles with zero-knowledge proofs. Spin the wheel, win prizes, and verify results—all while keeping winners completely anonymous. No public announcements, no data leaks. Winners check their status manually, ensuring complete privacy.
        </p>

        {/* <Button
          size="lg"
          onClick={onEnterDashboard}
          className="group bg-gradient-to-r from-neon-pink via-neon-purple to-neon-orange text-white border-0 px-8 py-6 text-lg font-medium hover:opacity-90 transition-all hover:scale-105"
        >
          <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin" />
          Enter Dashboard
          <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
        </Button> */}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-xs uppercase tracking-widest">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
