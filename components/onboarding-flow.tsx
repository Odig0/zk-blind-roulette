"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"

type OnboardingStep = "connect" | "funded" | "ready" | "complete"

interface OnboardingFlowProps {
  isConnected: boolean
  balance: number
  onComplete: () => void
}

export function OnboardingFlow({ isConnected, balance, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    !isConnected ? "connect" : balance > 0 ? "ready" : "funded"
  )

  const steps = [
    {
      id: "connect" as OnboardingStep,
      title: "Connect Wallet",
      description: "Connect your wallet to get started",
      icon: isConnected ? CheckCircle2 : Loader2,
      status: isConnected ? "complete" : "active",
    },
    {
      id: "funded" as OnboardingStep,
      title: "Ready to Play",
      description: "Enter the roulette and start winning",
      icon: balance > 0 ? CheckCircle2 : AlertCircle,
      status: !isConnected ? "pending" : balance > 0 ? "complete" : "active",
    },
    {
      id: "ready" as OnboardingStep,
      title: "Spin the Wheel!",
      description: "Try your luck anonymously",
      icon: CheckCircle2,
      status: !isConnected || balance === 0 ? "pending" : "active",
    },
  ]

  const getStepColor = (status: string) => {
    switch (status) {
      case "complete":
        return "text-emerald-400 bg-emerald-500/20 border-emerald-500/30"
      case "active":
        return "text-cyan-400 bg-cyan-500/20 border-cyan-500/30"
      default:
        return "text-muted-foreground bg-muted/20 border-border"
    }
  }

  if (isConnected && balance > 0) {
    return null
  }

  return (
    <Card className="glass-card p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full" />
          <h3 className="text-lg sm:text-xl font-semibold">Quick Start Guide</h3>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isComplete = step.status === "complete"
            const isActive = step.status === "active"

            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${getStepColor(step.status)} ${
                  isActive ? "ring-2 ring-cyan-500/50" : ""
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Icon
                    className={`h-5 w-5 ${isComplete ? "text-emerald-400" : isActive ? "text-cyan-400 animate-pulse" : "text-muted-foreground"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium opacity-60">STEP {index + 1}</span>
                    {isComplete && <span className="text-xs text-emerald-400">✓ Done</span>}
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base mb-1">{step.title}</h4>
                  <p className="text-xs sm:text-sm opacity-80">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {isConnected && balance === 0 && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              Get free test tokens from the Scroll Sepolia faucet:
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => window.open("https://sepolia.scroll.io/faucet", "_blank")}
            >
              Open Scroll Faucet →
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
