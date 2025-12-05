/**
 * Unit Tests for EventsTable Component
 * Tests event display and transaction history
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"

// Mock Zustand store with events
const mockClearEvents = vi.fn()

const mockEventsData = [
  {
    id: "1",
    token: "DAI" as const,
    type: "Transfer" as const,
    amount: "50.0000",
    from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    to: "0x1234567890123456789012345678901234567890",
    txHash: "0xabc123def456789",
    timestamp: Date.now(),
  },
  {
    id: "2",
    token: "USDC" as const,
    type: "Approval" as const,
    amount: "100.00",
    from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    to: "0x9876543210987654321098765432109876543210",
    txHash: "0xdef456abc789012",
    timestamp: Date.now() - 60000,
  },
]

vi.mock("@/store/web3-store", () => ({
  useWeb3Store: vi.fn((selector) => {
    const state = {
      tx: {
        events: mockEventsData,
      },
      clearEvents: mockClearEvents,
    }
    return selector(state)
  }),
  selectEvents: (state: any) => state.tx.events,
  selectClearEvents: (state: any) => state.clearEvents,
}))

import { EventsTable } from "@/components/events-table"

describe("EventsTable", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders events table", () => {
    render(<EventsTable />)

    expect(screen.getByText("Activity")).toBeInTheDocument()
  })

  it("displays event rows after successful transactions", () => {
    render(<EventsTable />)

    // Check for token names
    expect(screen.getByText("DAI")).toBeInTheDocument()
    expect(screen.getByText("USDC")).toBeInTheDocument()

    // Check for event types
    expect(screen.getByText("Transfer")).toBeInTheDocument()
    expect(screen.getByText("Approval")).toBeInTheDocument()

    // Check for amounts
    expect(screen.getByText("50.0000")).toBeInTheDocument()
    expect(screen.getByText("100.00")).toBeInTheDocument()
  })

  it("shows truncated addresses", () => {
    render(<EventsTable />)

    // Should show truncated addresses (first 6 + last 4 chars)
    expect(screen.getAllByText("0x742d...f44e").length).toBeGreaterThan(0)
  })

  it("shows clear button when events exist", () => {
    render(<EventsTable />)

    expect(screen.getByText("Clear")).toBeInTheDocument()
  })
})
