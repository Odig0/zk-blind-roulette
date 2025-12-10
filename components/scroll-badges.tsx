"use client"

import { Card } from "@/components/ui/card"
import { Zap, Shield, Layers, Trophy } from "lucide-react"

export function ScrollBadges() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
      <Card className="glass-card p-3 border-cyan-500/30">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <Zap className="h-4 w-4 text-cyan-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-cyan-400">Fast</p>
            <p className="text-[10px] text-muted-foreground">Scroll L2</p>
          </div>
        </div>
      </Card>

      <Card className="glass-card p-3 border-purple-500/30">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Shield className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-purple-400">Private</p>
            <p className="text-[10px] text-muted-foreground">ZK Proofs</p>
          </div>
        </div>
      </Card>

      <Card className="glass-card p-3 border-emerald-500/30">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Layers className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-400">Cheap</p>
            <p className="text-[10px] text-muted-foreground">Low Fees</p>
          </div>
        </div>
      </Card>

      <Card className="glass-card p-3 border-orange-500/30">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
            <Trophy className="h-4 w-4 text-orange-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-orange-400">Fair</p>
            <p className="text-[10px] text-muted-foreground">Verifiable</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
