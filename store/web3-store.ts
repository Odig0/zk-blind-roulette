import { create } from "zustand"

interface WalletState {
  wallet: {
    address: string | null
    chainId: number | null
    isCorrectNetwork: boolean
    ensName: string | null
  }
  ui: {
    showDashboard: boolean
  }
  // Actions
  setWalletAddress: (address: string | null) => void
  setChainId: (chainId: number | null) => void
  setIsCorrectNetwork: (isCorrect: boolean) => void
  setEnsName: (name: string | null) => void
  setShowDashboard: (show: boolean) => void
}

const initialState = {
  wallet: {
    address: null,
    chainId: null,
    isCorrectNetwork: false,
    ensName: null,
  },
  ui: {
    showDashboard: false,
  },
}

export const useWeb3Store = create<WalletState>((set) => ({
  ...initialState,
  setWalletAddress: (address) =>
    set((state) => ({
      wallet: { ...state.wallet, address },
    })),
  setChainId: (chainId) =>
    set((state) => ({
      wallet: { ...state.wallet, chainId },
    })),
  setIsCorrectNetwork: (isCorrectNetwork) =>
    set((state) => ({
      wallet: { ...state.wallet, isCorrectNetwork },
    })),
  setEnsName: (ensName) =>
    set((state) => ({
      wallet: { ...state.wallet, ensName },
    })),
  setShowDashboard: (showDashboard) =>
    set((state) => ({
      ui: { ...state.ui, showDashboard },
    })),
}))

// Selectors
export const selectWallet = (state: WalletState) => state.wallet
export const selectShowDashboard = (state: WalletState) => state.ui.showDashboard
export const selectSetShowDashboard = (state: WalletState) => state.setShowDashboard
export const selectWalletAddress = (state: WalletState) => state.wallet.address
export const selectSetWalletAddress = (state: WalletState) => state.setWalletAddress
export const selectChainId = (state: WalletState) => state.wallet.chainId
export const selectSetChainId = (state: WalletState) => state.setChainId
export const selectIsCorrectNetwork = (state: WalletState) => state.wallet.isCorrectNetwork
export const selectSetIsCorrectNetwork = (state: WalletState) => state.setIsCorrectNetwork
export const selectEnsName = (state: WalletState) => state.wallet.ensName
export const selectSetEnsName = (state: WalletState) => state.setEnsName
