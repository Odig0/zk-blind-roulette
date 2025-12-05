/**
 * Unit Tests for TokenActionsCard Component
 * Tests approve/transfer functionality and validation
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"

// Mock wagmi hooks
const mockWriteContract = vi.fn()

vi.mock("wagmi", () => ({
  useAccount: vi.fn(),
  useWriteContract: vi.fn(() => ({
    writeContract: mockWriteContract,
    data: undefined,
    isPending: false,
    error: null,
  })),
  useWaitForTransactionReceipt: vi.fn(() => ({
    isLoading: false,
    isSuccess: false,
  })),
}))

// Mock toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

// Mock Zustand store
const mockSetIsPending = vi.fn()
const mockSetLastError = vi.fn()
const mockAddEvent = vi.fn()
const mockSetSelectedToken = vi.fn()

vi.mock("@/store/web3-store", () => ({
  useWeb3Store: vi.fn(() => ({
    tokens: {
      balances: { DAI: "100", USDC: "50" },
      selectedToken: "DAI",
      isLoadingBalances: false,
    },
    wallet: {
      isCorrectNetwork: true,
      address: "0x123",
    },
    tx: {
      isPending: false,
      pendingAction: null,
      lastError: null,
    },
    setIsPending: mockSetIsPending,
    setLastError: mockSetLastError,
    addEvent: mockAddEvent,
    setSelectedToken: mockSetSelectedToken,
  })),
  TOKEN_ADDRESSES: {
    DAI: "0x1D70D57ccD2798323232B2dD027B3aBcA5C00091",
    USDC: "0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47",
  },
  TOKEN_DECIMALS: {
    DAI: 18,
    USDC: 6,
  },
}))

vi.mock("@/blockchain/config", () => ({
  ERC20_ABI: [],
}))

import { useAccount } from "wagmi"
import { TokenActionsCard } from "@/components/token-actions-card"

describe("TokenActionsCard", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders token actions card", () => {
    ;(useAccount as any).mockReturnValue({ address: "0x123", isConnected: true })

    render(<TokenActionsCard />)

    expect(screen.getByText("Token Actions")).toBeInTheDocument()
  })

  it("shows approve and transfer buttons", () => {
    ;(useAccount as any).mockReturnValue({ address: "0x123", isConnected: true })

    render(<TokenActionsCard />)

    expect(screen.getByText("APPROVE")).toBeInTheDocument()
    expect(screen.getByText("TRANSFER")).toBeInTheDocument()
  })

  it("shows validation error for invalid transfer amount", async () => {
    ;(useAccount as any).mockReturnValue({ address: "0x123", isConnected: true })

    render(<TokenActionsCard />)

    const transferAmountInput = screen.getByPlaceholderText("Amount to transfer")
    const recipientInput = screen.getByPlaceholderText("Recipient address (0x...)")

    // Enter amount greater than balance (100 DAI available, trying to send 200)
    fireEvent.change(transferAmountInput, { target: { value: "200" } })
    fireEvent.change(recipientInput, { target: { value: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" } })

    const transferButton = screen.getByText("TRANSFER")
    fireEvent.click(transferButton)

    // Should show "Not enough funds" error
    expect(await screen.findByText("Not enough funds")).toBeInTheDocument()
  })

  it("shows message when wallet not connected", () => {
    ;(useAccount as any).mockReturnValue({ address: undefined, isConnected: false })

    render(<TokenActionsCard />)

    expect(screen.getByText("Connect your wallet to perform actions")).toBeInTheDocument()
  })

  it("allows token selection between DAI and USDC", () => {
    ;(useAccount as any).mockReturnValue({ address: "0x123", isConnected: true })

    const { container } = render(<TokenActionsCard />)

    const daiTab = screen.getByRole("tab", { name: "DAI" })
    const usdcTab = screen.getByRole("tab", { name: "USDC" })

    expect(daiTab).toBeInTheDocument()
    expect(usdcTab).toBeInTheDocument()

    // Verify initial state
    expect(daiTab).toHaveAttribute("data-state", "active")
    expect(usdcTab).toHaveAttribute("data-state", "inactive")
    
    // Simulate mouseDown and click - Radix UI uses these events
    fireEvent.mouseDown(usdcTab, { button: 0 })
    fireEvent.mouseUp(usdcTab, { button: 0 })
    fireEvent.click(usdcTab, { button: 0 })
    
    // The mock should have been called with the new token
    expect(mockSetSelectedToken).toHaveBeenCalledWith("USDC")
  })
})
