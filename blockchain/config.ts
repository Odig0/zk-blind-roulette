import { http, createConfig } from "wagmi"
import { sepolia, mainnet, polygon, arbitrum, optimism, base, scrollSepolia } from "wagmi/chains"
import { injected, walletConnect, metaMask, coinbaseWallet } from "wagmi/connectors"

// Wagmi configuration with multiple chains
export const config = createConfig({
  chains: [scrollSepolia, sepolia, mainnet, polygon, arbitrum, optimism, base],
  connectors: [
    injected(),
    walletConnect({ 
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      showQrModal: true,
      metadata: {
        name: "Raffero",
        description: "Anonymous Raffle System",
        url: "https://zk-blind-roulette.vercel.app",
        icons: ["https://zk-blind-roulette.vercel.app/logoEnaid.png"]
      },
      qrModalOptions: {
        themeMode: 'dark' as const,
      },
    }),
    metaMask(),
    coinbaseWallet({ appName: "Raffero" }),
  ],
  transports: {
    [scrollSepolia.id]: http(),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
  },
  ssr: true,
})
