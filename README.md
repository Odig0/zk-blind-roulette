# Raffero - Anonymous Raffle System

🏆 **Built for Scroll Hackathon - Consumer Crypto App**

## 🎯 Problem & Solution

**Problem:** Traditional raffles and lotteries lack privacy. Winners are publicly announced, creating security risks and privacy concerns.

**Solution:** Raffero uses zero-knowledge proofs on Scroll L2 to enable completely anonymous raffle participation. Winners verify their results privately—no public announcements, no data leaks.

## ✨ Key Features

### 🔐 Complete Privacy
- Winners verify results privately using ZK proofs
- No public winner announcements
- Personal verification only

### ⚡ Scroll L2 Integration
- Fast transactions on Scroll
- Low gas fees
- EVM-compatible smart contracts
- Sepolia testnet integration

### 📱 Mobile-First UX
- Optimized for mobile devices
- Intuitive onboarding flow
- Clear 0-1 success indicators
- Smooth animations and transitions

### 🎲 Flexible Raffle Options
- **Free Raffles:** No entry cost
- **Paid Raffles:** Entry fees with prize pools
- **Scheduled Draws:** Automated daily raffles (12:00 PM & 8:00 PM)
- **Custom Raffles:** Set your own date, time, and participant limits

## 🏗️ Technical Architecture

### Smart Contract Design
```
RafferoRaffle.sol
├── Entry Management (free/paid)
├── Random Number Generation (VRF)
├── ZK Proof Verification
└── Prize Distribution
```

### Tech Stack
- **Frontend:** Next.js 15, React 18, TypeScript
- **Web3:** Wagmi 3.0, Viem, RainbowKit
- **Blockchain:** Scroll Sepolia L2
- **Styling:** Tailwind CSS 4
- **State:** Zustand

### Zero-Knowledge Implementation
- Private winner verification
- Merkle tree for participant registry
- ZK-SNARK proofs for result validation
- No on-chain winner disclosure

## 🚀 User Flow

### Onboarding (0-1 Success)
1. **Connect Wallet** → One-click RainbowKit integration
2. **Get Test Tokens** → Direct link to Scroll faucet
3. **Start Playing** → Immediate access to raffles

### Playing
1. **Choose Raffle** → Browse free or paid raffles
2. **Enter** → Connect wallet and join
3. **Wait for Draw** → Automatic execution at scheduled time
4. **Verify Privately** → Check if you won (ZK proof)
5. **Claim Prize** → If winner, claim anonymously

## 📊 Consumer Value

### Real User Needs
- **Privacy-conscious users** who want to participate without exposure
- **Security-focused individuals** avoiding public winner lists
- **Crypto enthusiasts** seeking fair, verifiable randomness
- **Community organizers** running private giveaways

### Retention Mechanics
- Daily scheduled raffles create habit loops
- Free raffles lower entry barriers
- Anonymous verification encourages repeat participation
- Social proof without privacy compromise

## 🎨 UX Innovations

### Mobile-First Design
- Responsive breakpoints: Mobile → Tablet → Desktop
- Touch-optimized interactions
- Fast load times (<2s)
- Smooth 60fps animations

### Clarity & Polish
- **Onboarding badges:** Visual progress indicators
- **Success modal:** Clear win/loss feedback
- **Scroll benefits:** Prominent L2 advantages
- **Step-by-step guide:** No confusion, instant understanding

### Speed Optimizations
- Next.js App Router for instant navigation
- Optimistic UI updates
- Background transaction processing
- Cached wallet state

## 🔒 Security Features

### Smart Contract
- OpenZeppelin security standards
- Reentrancy guards
- Access control patterns
- Emergency pause mechanism

### Frontend
- Secure wallet integration
- Transaction validation
- Error boundary handling
- Rate limiting

## 🌟 Originality

### Novel UX Concepts
1. **Private Results Modal:** First raffle app with zero-knowledge winner verification UX
2. **Scroll Badges:** Visual trust indicators for L2 benefits
3. **Onboarding Flow:** Gamified wallet connection and funding
4. **Mobile Wheel:** Touch-optimized spinning animation

### Onchain Primitives
- VRF for provable randomness
- Merkle proofs for efficient participant verification
- ZK-SNARKs for private winner checking
- Event-driven automation for scheduled draws

## 📱 Mobile Optimizations

### Performance
- Uses `100svh` for mobile viewport accuracy
- Responsive images with Next.js Image
- Lazy loading for off-screen content
- Minimal JavaScript bundle (<200KB)

### Touch Experience
- Large tap targets (min 44px)
- Swipe gestures for navigation
- Pull-to-refresh patterns
- Haptic feedback (via Web Vibration API)

## 🛠️ Development

### Prerequisites
```bash
Node.js 20+
pnpm 10+
```

### Installation
```bash
pnpm install
```

### Run Development
```bash
pnpm dev
```

### Build Production
```bash
pnpm build
pnpm start
```

### Environment Variables
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## 🎯 Hackathon Criteria Alignment

### ✅ User Experience
- **Intuitive mobile flow:** Step-by-step onboarding
- **Speed:** <2s load, instant wallet connection
- **Polish:** Smooth animations, professional design
- **0-1-success clarity:** Visual progress, clear CTAs

### ✅ Technical Quality
- **Smart contract design:** Modular, secure, upgradeable
- **Scroll integration:** Native L2 deployment, optimized gas
- **Reliability:** Error handling, fallback states
- **Security:** ZK proofs, audited patterns

### ✅ Consumer Value
- **Clear problem:** Privacy in public raffles
- **Real user need:** Proven by lottery market size ($300B+)
- **Retention potential:** Daily draws, habit formation

### ✅ Originality
- **Novel UX:** ZK verification modal, mobile-first wheel
- **Thoughtful primitives:** VRF + ZK + Merkle efficiency

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines.

## 🔗 Links

- **Demo:** [raffero.vercel.app](#)
- **Contracts:** [Scroll Sepolia Explorer](#)
- **Docs:** [docs.raffero.app](#)
