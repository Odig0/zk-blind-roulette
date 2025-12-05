import { http, createConfig } from "wagmi"
import { sepolia, mainnet, polygon, arbitrum, optimism, base } from "wagmi/chains"
import { injected } from "wagmi/connectors"
import { erc20Abi } from "viem"

// Network configuration
export const SEPOLIA_CHAIN_ID = 11155111

// Token configuration
export const TOKEN_ADDRESSES = {
  DAI: (process.env.NEXT_PUBLIC_DAI_ADDRESS ) as `0x${string}`,
  USDC: (process.env.NEXT_PUBLIC_USDC_ADDRESS) as `0x${string}`,
} as const

export const TOKEN_DECIMALS = {
  DAI: 18,
  USDC: 6,
} as const

export type TokenSymbol = keyof typeof TOKEN_ADDRESSES

// Wagmi configuration with multiple chains
export const config = createConfig({
  chains: [sepolia, mainnet, polygon, arbitrum, optimism, base],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
  },
  ssr: true,
})

// Use viem's built-in ERC20 ABI with mint function extension
export const ERC20_ABI = [
  ...erc20Abi,
  {
    name: "mint",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
] as const
