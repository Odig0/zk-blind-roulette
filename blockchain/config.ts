import { http, createConfig } from "wagmi"
import { sepolia, mainnet, polygon, arbitrum, optimism, base, scrollSepolia } from "wagmi/chains"
import { injected, metaMask, coinbaseWallet } from "wagmi/connectors"
import type { CreateConnectorFn } from "wagmi"

// Lazy load WalletConnect only on client side
let walletConnectConnector: CreateConnectorFn | null = null

if (typeof window !== 'undefined') {
  const { walletConnect } = require('wagmi/connectors')
  walletConnectConnector = walletConnect({ 
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    showQrModal: true,
    metadata: {
      name: "Raffero",
      description: "Anonymous Raffle System",
      url: "https://raffero.vercel.app",
      icons: ["https://raffero.vercel.app/logoEnaid.png"]
    },
    qrModalOptions: {
      themeMode: 'dark' as const,
    },
  })
}

// Build connectors array based on environment
const connectors: CreateConnectorFn[] = [
  injected(),
  metaMask(),
  coinbaseWallet({ appName: "Raffero" }),
]

// Add WalletConnect only on client
if (walletConnectConnector) {
  connectors.splice(1, 0, walletConnectConnector)
}

// Wagmi configuration with multiple chains
export const config = createConfig({
  chains: [scrollSepolia, sepolia, mainnet, polygon, arbitrum, optimism, base],
  connectors,
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
