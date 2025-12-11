"use client"

import { useEffect, useState } from "react"
import { useAccount, useChainId, useEnsName, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, CheckCircle2, XCircle, LogOut, Monitor } from "lucide-react"
import { useWeb3Store } from "@/store/web3-store"
import { sepolia } from "wagmi/chains"

export function WalletCard() {
  const { address, isConnected, chain } = useAccount()
  const chainId = useChainId()
  const { data: ensName } = useEnsName({ address })
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  const { setWalletAddress, setChainId, setIsCorrectNetwork, setEnsName, wallet } = useWeb3Store()
  
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device or small screen (responsive view)
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const isSmallScreen = window.innerWidth < 768 // Tailwind md breakpoint
      setIsMobile(isMobileDevice || isSmallScreen)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Update wallet state when connection changes
  useEffect(() => {
    if (isConnected && address) {
      const currentChainId = chain?.id ?? chainId
      
      setWalletAddress(address)
      setChainId(currentChainId)
      setIsCorrectNetwork(true) // Always true since we removed network validation
      setEnsName(ensName ?? null)
    } else {
      // Clear state when disconnected
      setWalletAddress(null)
      setChainId(null)
      setIsCorrectNetwork(false)
      setEnsName(null)
    }
  }, [address, isConnected, chain?.id, chainId, ensName, setWalletAddress, setChainId, setIsCorrectNetwork, setEnsName])

  // Force update network status when chainId changes (for MetaMask network switches)
  useEffect(() => {
    if (isConnected) {
      const currentChainId = chain?.id ?? chainId
      setChainId(currentChainId)
      setIsCorrectNetwork(true) // Always true since we removed network validation
    }
  }, [chainId, chain?.id, isConnected, setChainId, setIsCorrectNetwork])

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Wallet className="h-6 w-6 text-neon-pink" />
          Wallet Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {isMobile ? (
          <div className="text-center space-y-4 py-6">
            <Wallet className="h-12 w-12 mx-auto text-neon-purple" />
            <div className="space-y-2">
              <p className="text-base font-medium text-foreground">Wallet Required</p>
              <p className="text-sm text-muted-foreground">
                To use Raffero, you need a Web3 wallet like Gem Wallet or MetaMask installed on your device.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Download a compatible wallet from your app store to get started.
              </p>
            </div>
          </div>
        ) : !isConnected ? (
          <Button
            onClick={() => {
              const injected = connectors.find(c => c.name.includes('MetaMask') || c.name.includes('Injected'))
              if (injected) connect({ connector: injected })
            }}
            disabled={isPending}
            size="lg"
            className="w-full bg-gradient-to-r from-[#1e3a8a] via-[#3b82f6] to-[#6366f1] text-white hover:opacity-90 text-base shadow-lg shadow-blue-500/50"
          >
            {isPending ? "Connecting..." : "Connect Wallet"}
          </Button>
        ) : (
          <div className="space-y-3">
            {/* Network display */}
            <div className="w-full flex items-center justify-between py-3 px-4 bg-secondary/50 rounded-lg">
              <span className="text-base text-muted-foreground">Network</span>
              <span className="text-base font-medium">
                {chain?.name || `Chain ${chainId}`}
              </span>
            </div>

            {/* Address display */}
            <div className="w-full flex items-center justify-between py-3 px-4 bg-secondary/50 rounded-lg">
              <span className="text-base text-muted-foreground">Address</span>
              <span className="text-base font-mono">{ensName || (address ? truncateAddress(address) : "")}</span>
            </div>

            {/* Network status */}
            <div className="flex items-center gap-2 text-sm">
              {wallet.isCorrectNetwork ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">Connected to Sepolia</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-destructive">Wrong network</span>
                  <Button
                    size="sm"
                    onClick={() => switchChain({ chainId: sepolia.id })}
                    className="ml-auto text-xs bg-gradient-to-r from-[#1e3a8a] via-[#3b82f6] to-[#6366f1] text-white hover:opacity-90 shadow-md shadow-blue-500/40"
                  >
                    Switch to Sepolia
                  </Button>
                </>
              )}
            </div>

            {/* Disconnect button */}
            <Button 
              onClick={() => disconnect()} 
              className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 shadow-md shadow-purple-500/40"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
