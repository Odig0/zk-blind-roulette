"use client"

import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther, Address } from "viem"
import { CONTRACTS, RaffleData } from "@/blockchain/contracts"
import { useToast } from "./use-toast"

export function usePrivateRaffle() {
  const { toast } = useToast()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  // =========================================================================
  // WRITE FUNCTIONS
  // =========================================================================

  /**
   * Crear una nueva rifa
   * @param ticketPrice Precio del ticket en ETH
   * @param levels Altura del árbol Merkle (2^levels = max participantes)
   * @param duration Duración en segundos
   * @param prizeAmount Premio inicial en ETH
   */
  const createRaffle = async (
    ticketPrice: string,
    levels: number,
    duration: number,
    prizeAmount: string
  ) => {
    try {
      writeContract({
        address: CONTRACTS.PrivateRaffle.address,
        abi: CONTRACTS.PrivateRaffle.abi,
        functionName: "createRaffle",
        args: [parseEther(ticketPrice), BigInt(levels), BigInt(duration)],
        value: parseEther(prizeAmount),
      })
    } catch (error) {
      toast({
        title: "Error creating raffle",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  /**
   * Comprar ticket (debe llamarse a través de relayer para privacidad)
   * @param raffleId ID de la rifa
   * @param commitment Poseidon2(secret, nullifier) calculado off-chain
   * @param ticketPrice Precio del ticket
   */
  const purchaseTicket = async (
    raffleId: bigint,
    commitment: bigint,
    ticketPrice: bigint
  ) => {
    try {
      writeContract({
        address: CONTRACTS.PrivateRaffle.address,
        abi: CONTRACTS.PrivateRaffle.abi,
        functionName: "purchaseTicket",
        args: [raffleId, commitment],
        value: ticketPrice,
      })
    } catch (error) {
      toast({
        title: "Error purchasing ticket",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  /**
   * Elegir ganador (pseudo-random, solo para devnet)
   * @param raffleId ID de la rifa
   */
  const drawWinner = async (raffleId: bigint) => {
    try {
      writeContract({
        address: CONTRACTS.PrivateRaffle.address,
        abi: CONTRACTS.PrivateRaffle.abi,
        functionName: "drawWinner",
        args: [raffleId],
      })
    } catch (error) {
      toast({
        title: "Error drawing winner",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  /**
   * Reclamar premio con prueba ZK
   * @param raffleId ID de la rifa
   * @param proof Prueba ZK en bytes
   * @param publicInputs Inputs públicos de la prueba
   * @param recipient Dirección que recibirá el premio
   * @param relayerFee Fee para el relayer
   */
  const claimPrize = async (
    raffleId: bigint,
    proof: `0x${string}`,
    publicInputs: readonly `0x${string}`[],
    recipient: Address,
    relayerFee: bigint
  ) => {
    try {
      writeContract({
        address: CONTRACTS.PrivateRaffle.address,
        abi: CONTRACTS.PrivateRaffle.abi,
        functionName: "claimPrize",
        args: [raffleId, proof, publicInputs, recipient, relayerFee],
      })
    } catch (error) {
      toast({
        title: "Error claiming prize",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  return {
    createRaffle,
    purchaseTicket,
    drawWinner,
    claimPrize,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  }
}

// =========================================================================
// READ HOOKS
// =========================================================================

/**
 * Obtener datos de una rifa
 */
export function useRaffleData(raffleId: bigint | undefined) {
  return useReadContract({
    address: CONTRACTS.PrivateRaffle.address,
    abi: CONTRACTS.PrivateRaffle.abi,
    functionName: "getRaffle",
    args: raffleId !== undefined ? [raffleId] : undefined,
    query: {
      enabled: raffleId !== undefined,
    },
  }) as { data: RaffleData | undefined; isLoading: boolean; refetch: () => void }
}

/**
 * Verificar si una rifa está activa
 */
export function useIsRaffleActive(raffleId: bigint | undefined) {
  return useReadContract({
    address: CONTRACTS.PrivateRaffle.address,
    abi: CONTRACTS.PrivateRaffle.abi,
    functionName: "isRaffleActive",
    args: raffleId !== undefined ? [raffleId] : undefined,
    query: {
      enabled: raffleId !== undefined,
    },
  })
}

/**
 * Verificar si se puede elegir ganador
 */
export function useCanDrawWinner(raffleId: bigint | undefined) {
  return useReadContract({
    address: CONTRACTS.PrivateRaffle.address,
    abi: CONTRACTS.PrivateRaffle.abi,
    functionName: "canDrawWinner",
    args: raffleId !== undefined ? [raffleId] : undefined,
    query: {
      enabled: raffleId !== undefined,
    },
  })
}

/**
 * Obtener raíz del árbol Merkle
 */
export function useRaffleRoot(raffleId: bigint | undefined) {
  return useReadContract({
    address: CONTRACTS.PrivateRaffle.address,
    abi: CONTRACTS.PrivateRaffle.abi,
    functionName: "getRoot",
    args: raffleId !== undefined ? [raffleId] : undefined,
    query: {
      enabled: raffleId !== undefined,
    },
  })
}

/**
 * Obtener contador de participantes
 */
export function useParticipantCount(raffleId: bigint | undefined) {
  return useReadContract({
    address: CONTRACTS.PrivateRaffle.address,
    abi: CONTRACTS.PrivateRaffle.abi,
    functionName: "getParticipantCount",
    args: raffleId !== undefined ? [raffleId] : undefined,
    query: {
      enabled: raffleId !== undefined,
    },
  })
}

/**
 * Calcular hash Poseidon2 (útil para generar commitments)
 */
export function useComputeHash(a: bigint | undefined, b: bigint | undefined) {
  return useReadContract({
    address: CONTRACTS.PrivateRaffle.address,
    abi: CONTRACTS.PrivateRaffle.abi,
    functionName: "computeHash",
    args: a !== undefined && b !== undefined ? [a, b] : undefined,
    query: {
      enabled: a !== undefined && b !== undefined,
    },
  })
}
