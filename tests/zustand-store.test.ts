/**
 * Unit Tests for Zustand Web3 Store
 * Tests state management actions
 */

import { describe, it, expect, beforeEach } from "vitest"
import { useWeb3Store } from "@/store/web3-store"

describe("Web3Store", () => {
  beforeEach(() => {
    // Reset store to initial state
    useWeb3Store.setState({
      wallet: {
        address: null,
        chainId: null,
        isCorrectNetwork: false,
        ensName: null,
      },
      tokens: {
        balances: { DAI: "0", USDC: "0" },
        selectedToken: "DAI",
        isLoadingBalances: false,
      },
      tx: {
        isPending: false,
        pendingAction: null,
        lastError: null,
        events: [],
      },
      ui: {
        isLoading: false,
        showDashboard: false,
      },
    })
  })

  describe("Wallet Actions", () => {
    it("sets wallet address", () => {
      const store = useWeb3Store.getState()
      store.setWalletAddress("0x123")

      expect(useWeb3Store.getState().wallet.address).toBe("0x123")
    })

    it("sets chain ID", () => {
      const store = useWeb3Store.getState()
      store.setChainId(11155111)

      expect(useWeb3Store.getState().wallet.chainId).toBe(11155111)
    })

    it("sets correct network flag", () => {
      const store = useWeb3Store.getState()
      store.setIsCorrectNetwork(true)

      expect(useWeb3Store.getState().wallet.isCorrectNetwork).toBe(true)
    })

    it("sets ENS name", () => {
      const store = useWeb3Store.getState()
      store.setEnsName("vitalik.eth")

      expect(useWeb3Store.getState().wallet.ensName).toBe("vitalik.eth")
    })
  })

  describe("Token Actions", () => {
    it("sets all balances", () => {
      const store = useWeb3Store.getState()
      store.setBalances({ DAI: "100.5", USDC: "50.25" })

      const { balances } = useWeb3Store.getState().tokens
      expect(balances.DAI).toBe("100.5")
      expect(balances.USDC).toBe("50.25")
    })

    it("sets individual balance", () => {
      const store = useWeb3Store.getState()
      store.setBalance("DAI", "200.0")

      expect(useWeb3Store.getState().tokens.balances.DAI).toBe("200.0")
    })

    it("sets selected token", () => {
      const store = useWeb3Store.getState()
      store.setSelectedToken("USDC")

      expect(useWeb3Store.getState().tokens.selectedToken).toBe("USDC")
    })

    it("sets loading balances state", () => {
      const store = useWeb3Store.getState()
      store.setIsLoadingBalances(true)

      expect(useWeb3Store.getState().tokens.isLoadingBalances).toBe(true)
    })
  })

  describe("Transaction Actions", () => {
    it("sets pending state with action", () => {
      const store = useWeb3Store.getState()
      store.setIsPending(true, "approve")

      const { tx } = useWeb3Store.getState()
      expect(tx.isPending).toBe(true)
      expect(tx.pendingAction).toBe("approve")
    })

    it("sets last error", () => {
      const store = useWeb3Store.getState()
      store.setLastError("Transaction failed")

      expect(useWeb3Store.getState().tx.lastError).toBe("Transaction failed")
    })

    it("adds event to list", () => {
      const store = useWeb3Store.getState()
      store.addEvent({
        token: "DAI",
        type: "Transfer",
        amount: "50",
        from: "0x123",
        to: "0x456",
        txHash: "0xabc",
      })

      const { events } = useWeb3Store.getState().tx
      expect(events).toHaveLength(1)
      expect(events[0].token).toBe("DAI")
      expect(events[0].type).toBe("Transfer")
      expect(events[0].amount).toBe("50")
      expect(events[0].id).toBeDefined()
      expect(events[0].timestamp).toBeDefined()
    })

    it("adds events in reverse chronological order", () => {
      const store = useWeb3Store.getState()

      store.addEvent({
        token: "DAI",
        type: "Transfer",
        amount: "50",
        from: "0x123",
        to: "0x456",
        txHash: "0xfirst",
      })

      store.addEvent({
        token: "USDC",
        type: "Approval",
        amount: "100",
        from: "0x123",
        to: "0x789",
        txHash: "0xsecond",
      })

      const { events } = useWeb3Store.getState().tx
      expect(events[0].txHash).toBe("0xsecond")
      expect(events[1].txHash).toBe("0xfirst")
    })

    it("clears all events", () => {
      const store = useWeb3Store.getState()

      store.addEvent({
        token: "DAI",
        type: "Transfer",
        amount: "50",
        from: "0x123",
        to: "0x456",
        txHash: "0xabc",
      })

      store.clearEvents()

      expect(useWeb3Store.getState().tx.events).toHaveLength(0)
    })
  })

  describe("UI Actions", () => {
    it("sets show dashboard", () => {
      const store = useWeb3Store.getState()
      store.setShowDashboard(true)

      expect(useWeb3Store.getState().ui.showDashboard).toBe(true)
    })

    it("sets loading state", () => {
      const store = useWeb3Store.getState()
      store.setIsLoading(true)

      expect(useWeb3Store.getState().ui.isLoading).toBe(true)
    })
  })
})
