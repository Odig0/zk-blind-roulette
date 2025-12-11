"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Clock, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function HowItWorksSection() {
  const features = [
    {
      icon: Calendar,
      title: "Create Your Raffle",
      description: "Set up custom raffles by choosing your ticket price, prize pool, max participants, and draw time. Full control over when your raffle happens.",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
    },
    {
      icon: Users,
      title: "Join with Invite Code",
      description: "Enter raffles using exclusive invitation codes. Some raffles may be public and available to everyone without a code.",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      icon: Clock,
      title: "Wait for Draw Time",
      description: "Once you've entered, wait until the scheduled draw time. The winner will be selected automatically using verifiable randomness.",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
    },
    {
      icon: Shield,
      title: "Private Verification",
      description: "Winners verify results privately using zero-knowledge proofs. No public announcements, complete anonymity guaranteed.",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
    },
  ]

  return (
    <section id="how-it-works" className="relative min-h-[100svh] px-4 py-16 sm:py-20 md:px-8 flex items-center">
      {/* Background Effects - Same as hero */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-gradient-to-br from-purple-900/60 via-cyan-700/40 to-transparent rounded-full blur-[120px] animate-pulse-glow" />
        <div
          className="absolute -bottom-48 -right-48 w-[700px] h-[700px] bg-gradient-to-tl from-orange-500/60 via-yellow-400/50 to-transparent rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/40 via-purple-800/45 to-cyan-600/35 rounded-full blur-[140px] animate-pulse-glow"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2 hover:gap-3 transition-all">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="neon-gradient-text">How It Works</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4">
            Create custom raffles or join with invitation codes. Experience truly anonymous and fair prize distribution powered by blockchain technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className={`glass-card p-4 sm:p-5 md:p-6 hover:border-opacity-70 transition-all duration-300 group ${feature.borderColor}`}
              >
                <div className="space-y-3 sm:space-y-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${feature.bgColor} border ${feature.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.color}`} />
                  </div>

                  {/* Content */}
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className={`font-semibold text-base sm:text-lg ${feature.color}`}>
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
            <Clock className="h-5 w-5 text-cyan-400" />
            <span className="text-sm font-medium">
              Each raffle has a <span className="text-cyan-400">specific draw time</span> set by the creator. Make sure to enter before the deadline!
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
