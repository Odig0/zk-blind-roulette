/**
 * Unit Tests for EventsTable Component - Empty State
 * Tests empty state display
 */

import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"

// Mock Zustand store with empty events
vi.mock("@/store/web3-store", () => ({
  useWeb3Store: vi.fn((selector) => {
    const state = {
      tx: {
        events: [],
      },
      clearEvents: vi.fn(),
    }
    return selector(state)
  }),
  selectEvents: (state: any) => state.tx.events,
  selectClearEvents: (state: any) => state.clearEvents,
}))

import { EventsTable } from "@/components/events-table"

describe("EventsTable - Empty State", () => {
  it("shows empty state message when no events", () => {
    render(<EventsTable />)

    expect(screen.getByText("No transactions yet")).toBeInTheDocument()
    expect(screen.getByText("Your approve and transfer transactions will appear here")).toBeInTheDocument()
  })

  it("does not show clear button when no events", () => {
    render(<EventsTable />)

    expect(screen.queryByText("Clear")).not.toBeInTheDocument()
  })
})
