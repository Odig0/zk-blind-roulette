# Raffero - Anonymous Raffle System

🎰 **Private raffles with zero-knowledge proofs on Scroll**

## 🎯 What is Raffero?

Raffero is a privacy-first raffle platform where winners verify results privately using zero-knowledge proofs—no public announcements, ever.

Players enter scheduled draws with one tap, watch the roulette wheel spin automatically at draw time, and verify if they won using ZK proofs. Only you know if you won.

## ✨ Key Features

- 🔐 **Zero-Knowledge Privacy**: Winners verify results privately using ZK-SNARKs
- ⚡ **Scroll L2**: Fast & cheap transactions on Scroll Sepolia
- 📱 **Mobile-First**: Optimized for mobile Web3 gaming
- 🎲 **Scheduled Draws**: Automatic daily raffles (9 AM, 12 PM, 3 PM GMT-4)
- 🎯 **One-Tap Entry**: Connect wallet and enter instantly

## 🏗️ Deployed Contracts (Scroll Sepolia)

| Contract | Address | Explorer |
|----------|---------|----------|
| **PrivateRaffle** | `0x46aa91f8f0f52471fdea6481cf5027ee839ebb69` | [View](https://sepolia.scrollscan.com/address/0x46aa91f8f0f52471fdea6481cf5027ee839ebb69#code) |
| **Verifier** | `0x3ab7ed4598e2841413ab9efab1710835f0d952e9` | [View](https://sepolia.scrollscan.com/address/0x3ab7ed4598e2841413ab9efab1710835f0d952e9#code) |
| **Poseidon2** | `0x0a4ca220772c7d1e17fab8f3b26eaaa1a9b612fc` | [View](https://sepolia.scrollscan.com/address/0x0a4ca220772c7d1e17fab8f3b26eaaa1a9b612fc#code) |

## 🚀 Getting Started

### Prerequisites

- MetaMask or compatible Web3 wallet
- Scroll Sepolia testnet configured
- Test ETH from [Scroll Sepolia Faucet](https://sepolia.scroll.io/faucet)

### Installation

```bash
# Clone the repository
git clone https://github.com/Odig0/zk-blind-roulette-scroll.git
cd zk-blind-roulette-scroll

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Add your WalletConnect Project ID to .env

# Run development server
pnpm dev