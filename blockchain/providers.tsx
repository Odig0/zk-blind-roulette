"use client"

import type { ReactNode } from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider, darkTheme, Theme } from "@rainbow-me/rainbowkit"
import "@rainbow-me/rainbowkit/styles.css"
import { config } from "./config"
import { merge } from "lodash"

const queryClient = new QueryClient()

interface Web3ProviderProps {
  children: ReactNode
}

const customTheme = merge(darkTheme(), {
  colors: {
    accentColor: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #6366f1 100%)",
    accentColorForeground: "white",
    actionButtonBorder: "rgba(90, 184, 255, 0.4)",
    actionButtonBorderMobile: "rgba(90, 184, 255, 0.3)",
    actionButtonSecondaryBackground: "rgba(90, 184, 255, 0.15)",
    closeButton: "#c084fc",
    closeButtonBackground: "rgba(192, 132, 252, 0.15)",
    connectButtonBackground: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #6366f1 100%)",
    connectButtonBackgroundError: "#ef4444",
    connectButtonInnerBackground: "rgba(25, 20, 50, 0.85)",
    connectButtonText: "white",
    connectButtonTextError: "white",
    connectionIndicator: "#10b981",
    error: "#ef4444",
    generalBorder: "rgba(139, 92, 246, 0.3)",
    generalBorderDim: "rgba(139, 92, 246, 0.15)",
    menuItemBackground: "rgba(124, 58, 237, 0.08)",
    modalBackdrop: "rgba(15, 10, 35, 0.6)",
    modalBackground: "rgba(20, 15, 40, 0.97)",
    modalBorder: "rgba(139, 92, 246, 0.4)",
    modalText: "#e9d5ff",
    modalTextDim: "#c4b5fd",
    modalTextSecondary: "#ddd6fe",
    profileAction: "rgba(139, 92, 246, 0.12)",
    profileActionHover: "rgba(139, 92, 246, 0.25)",
    profileForeground: "rgba(20, 15, 40, 0.95)",
    selectedOptionBorder: "#8b5cf6",
    standby: "#fbbf24",
  },
  radii: {
    actionButton: "16px",
    connectButton: "16px",
    menuButton: "16px",
    modal: "24px",
    modalMobile: "28px",
  },
  shadows: {
    connectButton: "0 4px 20px rgba(59, 130, 246, 0.5), 0 2px 10px rgba(99, 102, 241, 0.4)",
    dialog: "0 8px 32px rgba(124, 58, 237, 0.3)",
    profileDetailsAction: "0 2px 10px rgba(139, 92, 246, 0.2)",
    selectedOption: "0 0 0 2px rgba(139, 92, 246, 0.4)",
    selectedWallet: "0 4px 16px rgba(139, 92, 246, 0.35)",
    walletLogo: "0 2px 8px rgba(0, 0, 0, 0.3)",
  },
} as Theme)

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          showRecentTransactions={true}
          modalSize="wide"
          appInfo={{
            appName: "ENAID - Learn Web3 Wallets for Artists",
            learnMoreUrl: "https://ethereum.org/en/wallets/",
          }}
          theme={customTheme}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
