import { Address } from "viem"
import PrivateRaffleABI from "./abi/PrivateRaffle.json"

// Deployed on Scroll Sepolia
export const PRIVATE_RAFFLE_ADDRESS = "0x46aa91f8f0f52471fdea6481cf5027ee839ebb69" as Address
export const VERIFIER_ADDRESS = "0x3ab7ed4598e2841413ab9efab1710835f0d952e9" as Address
export const POSEIDON2_ADDRESS = "0x0a4ca220772c7d1e17fab8f3b26eaaa1a9b612fc" as Address

export const CONTRACTS = {
  PrivateRaffle: {
    address: PRIVATE_RAFFLE_ADDRESS,
    abi: PrivateRaffleABI,
  },
} as const

// Tipos para el contrato
export enum RaffleStatus {
  Active = 0,
  Closed = 1,
  Claimed = 2,
}

export enum PrizeType {
  NativeToken = 0,
}

export interface RaffleData {
  creator: Address
  ticketPrice: bigint
  maxParticipants: bigint
  duration: bigint
  endTime: bigint
  levels: bigint
  nextIndex: bigint
  root: bigint
  prizeType: PrizeType
  prizePool: bigint
  status: RaffleStatus
  winnerIndex: bigint
  createdAt: bigint
}
