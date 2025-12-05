"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Coins } from "lucide-react"

interface Prize {
  id: number
  name: string
  price: number
}

interface PrizeShopProps {
  prizes: Prize[]
  totalPoints: number
  onPurchase: (index: number) => void
}

export function PrizeShop({ prizes, totalPoints, onPurchase }: PrizeShopProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <ShoppingCart className="h-6 w-6 text-neon-pink" />
          Prize Shop
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {prizes.map((prize, index) => {
          const canAfford = prize.price <= totalPoints

          return (
            <Card
              key={prize.id}
              className={`border-2 transition-all ${
                canAfford
                  ? "border-neon-pink/50 hover:border-neon-pink"
                  : "border-muted opacity-60"
              }`}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{prize.name}</h3>
                  <p className="flex items-center gap-1 text-neon-orange">
                    <Coins className="h-4 w-4" />
                    {prize.price} points
                  </p>
                </div>
                <Button
                  onClick={() => onPurchase(index)}
                  disabled={!canAfford}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                >
                  Buy
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </CardContent>
    </Card>
  )
}
