import type React from "react"
/**
 * Unit Tests for WalletCard Component
 * Tests wallet connection UI states and behavior
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"

// Mock wagmi hooks
vi.mock("wagmi", () => ({
  useAccount: vi.fn(),
  useChainId: vi.fn(),
  useEnsName: vi.fn(),
  useConnect: vi.fn(),
  useDisconnect: vi.fn(),
  useSwitchChain: vi.fn(),
  createConfig: vi.fn(() => ({})),
  http: vi.fn(),
}))

// Mock wagmi/chains
vi.mock("wagmi/chains", () => ({
  sepolia: { id: 11155111, name: "Sepolia" },
  mainnet: { id: 1, name: "Ethereum" },
  polygon: { id: 137, name: "Polygon" },
  arbitrum: { id: 42161, name: "Arbitrum" },
  optimism: { id: 10, name: "Optimism" },
  base: { id: 8453, name: "Base" },
}))

// Mock Zustand store
vi.mock("@/store/web3-store", () => ({
  useWeb3Store: vi.fn(() => ({
    setWalletAddress: vi.fn(),
    setChainId: vi.fn(),
    setIsCorrectNetwork: vi.fn(),
    setEnsName: vi.fn(),
    wallet: {
      address: null,
      chainId: null,
      isCorrectNetwork: false,
      ensName: null,
    },
  })),
}))

import { useAccount, useChainId, useEnsName, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { WalletCard } from "@/components/wallet-card"

describe("WalletCard", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.innerWidth for mobile detection
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    // Mock navigator.userAgent
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      configurable: true,
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    })
  })

  it("renders wallet connection card", () => {
    ;(useAccount as any).mockReturnValue({ address: undefined, isConnected: false, chain: null })
    ;(useChainId as any).mockReturnValue(undefined)
    ;(useEnsName as any).mockReturnValue({ data: undefined })
    ;(useConnect as any).mockReturnValue({ connect: vi.fn(), connectors: [], isPending: false })
    ;(useDisconnect as any).mockReturnValue({ disconnect: vi.fn() })
    ;(useSwitchChain as any).mockReturnValue({ switchChain: vi.fn() })

    render(<WalletCard />)

    expect(screen.getByText("Wallet Connection")).toBeInTheDocument()
  })

  it("shows connect wallet button when not connected", () => {
    ;(useAccount as any).mockReturnValue({ address: undefined, isConnected: false, chain: null })
    ;(useChainId as any).mockReturnValue(undefined)
    ;(useEnsName as any).mockReturnValue({ data: undefined })
    ;(useConnect as any).mockReturnValue({ connect: vi.fn(), connectors: [], isPending: false })
    ;(useDisconnect as any).mockReturnValue({ disconnect: vi.fn() })
    ;(useSwitchChain as any).mockReturnValue({ switchChain: vi.fn() })

    render(<WalletCard />)

    expect(screen.getByText("Connect Wallet")).toBeInTheDocument()
  })
})
