/**
 * Unit Tests for TokenBalancesCard Component
 * Tests balance display with mocked values
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"

// Mock wagmi hooks
vi.mock("wagmi", () => ({
  useAccount: vi.fn(),
  useReadContracts: vi.fn(),
}))

// Mock Zustand store
const mockSetBalances = vi.fn()
const mockSetIsLoadingBalances = vi.fn()

vi.mock("@/store/web3-store", () => ({
  useWeb3Store: vi.fn(() => ({
    setBalances: mockSetBalances,
    setIsLoadingBalances: mockSetIsLoadingBalances,
    tokens: {
      balances: { DAI: "123.4567", USDC: "89.12" },
      selectedToken: "DAI",
      isLoadingBalances: false,
    },
    wallet: {
      isCorrectNetwork: true,
      address: "0x1234567890123456789012345678901234567890",
    },
  })),
}))

vi.mock("@/blockchain/config", () => ({
  ERC20_ABI: [],
  TOKEN_ADDRESSES: {
    DAI: "0x1D70D57ccD2798323232B2dD027B3aBcA5C00091",
    USDC: "0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47",
  },
  TOKEN_DECIMALS: {
    DAI: 18,
    USDC: 6,
  },
}))

import { useAccount, useReadContracts } from "wagmi"
import { TokenBalancesCard } from "@/components/token-balances-card"

describe("TokenBalancesCard", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useReadContracts as any).mockReturnValue({
      data: null,
      isLoading: false,
      refetch: vi.fn(),
      isRefetching: false,
    })
  })

  it("renders token balances card", () => {
    ;(useAccount as any).mockReturnValue({ address: "0x123", isConnected: true })

    render(<TokenBalancesCard />)

    expect(screen.getByText("Token Balances")).toBeInTheDocument()
  })

  it("shows correct balances from store", () => {
    ;(useAccount as any).mockReturnValue({ address: "0x123", isConnected: true })

    render(<TokenBalancesCard />)

    expect(screen.getByText("DAI")).toBeInTheDocument()
    expect(screen.getByText("USDC")).toBeInTheDocument()
    expect(screen.getByText("123.4567")).toBeInTheDocument()
    expect(screen.getByText("89.12")).toBeInTheDocument()
  })

  it("shows message when wallet not connected", () => {
    ;(useAccount as any).mockReturnValue({ address: undefined, isConnected: false })

    render(<TokenBalancesCard />)

    expect(screen.getByText("Connect your wallet to view balances")).toBeInTheDocument()
  })
})
