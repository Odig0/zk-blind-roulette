import { http, createConfig } from "wagmi"
import { sepolia, mainnet, polygon, arbitrum, optimism, base, scrollSepolia } from "wagmi/chains"
import { injected } from "wagmi/connectors"
import type { CreateConnectorFn } from "wagmi"

// Lazy load all wallet connectors on client side to avoid SSR issues
let walletConnectConnector: CreateConnectorFn | null = null
let metaMaskConnector: CreateConnectorFn | null = null
let coinbaseConnector: CreateConnectorFn | null = null

if (typeof window !== 'undefined') {
  const { walletConnect, metaMask, coinbaseWallet } = require('wagmi/connectors')
  
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
  
  metaMaskConnector = metaMask()
  coinbaseConnector = coinbaseWallet({ appName: "Raffero" })
}

// Build connectors array - injected always works, others only on client
const connectors: CreateConnectorFn[] = [injected()]

if (walletConnectConnector) connectors.push(walletConnectConnector)
if (metaMaskConnector) connectors.push(metaMaskConnector)
if (coinbaseConnector) connectors.push(coinbaseConnector)

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
