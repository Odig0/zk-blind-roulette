import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { sepolia, mainnet, polygon, arbitrum, optimism, base, scrollSepolia } from "wagmi/chains"

// Wagmi configuration with RainbowKit
export const config = getDefaultConfig({
  appName: "Raffero - Anonymous Raffle",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'be88688ad24de3cfd8fb53eb789cd647',
  chains: [scrollSepolia, sepolia, mainnet, polygon, arbitrum, optimism, base],
  ssr: false,
})
