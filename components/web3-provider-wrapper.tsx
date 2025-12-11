"use client"

import { useState, useEffect, type ReactNode } from "react"
import { Web3Provider } from "@/blockchain/providers"

interface Web3ProviderWrapperProps {
  children: ReactNode
}

export function Web3ProviderWrapper({ children }: Web3ProviderWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return <Web3Provider>{children}</Web3Provider>
}
