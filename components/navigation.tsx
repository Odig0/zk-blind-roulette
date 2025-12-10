"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useChainId, useChains } from "wagmi"

const navLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/raffles", label: "Raffles" },
  { href: "#dashboard", label: "Dashboard" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const chains = useChains()
  
  // Detectar automáticamente la red actual de MetaMask
  const currentChain = chains.find(c => c.id === chainId)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-3 py-3 sm:px-4 sm:py-4 md:px-8 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-lg">
            <Image
              src="/logoEnaid.png"
              alt="Enaid Logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <span className="text-foreground font-semibold text-lg tracking-wide">RAFFERO</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm uppercase tracking-wider"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3">
            <ConnectButton chainStatus="none" showBalance={false} />
            {isConnected && currentChain && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary/50 border border-border">
                <Network className="h-5 w-5 text-neon-purple" />
                <span className="text-base font-semibold">{currentChain.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button & Connect */}
        <div className="md:hidden flex items-center gap-2">
          <ConnectButton chainStatus="none" showBalance={false} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm uppercase tracking-wider py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isConnected && currentChain && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary/50 border border-border">
                <Network className="h-5 w-5 text-neon-purple" />
                <span className="text-base font-semibold">{currentChain.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
