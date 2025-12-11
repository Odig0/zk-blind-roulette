/**
 * Zero-Knowledge utilities for PrivateRaffle
 * Generates commitments and manages secrets/nullifiers
 */

/**
 * Genera un secret aleatorio (256 bits)
 */
export function generateSecret(): bigint {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return BigInt("0x" + Array.from(array).map(b => b.toString(16).padStart(2, "0")).join(""))
}

/**
 * Genera un nullifier aleatorio (256 bits)
 */
export function generateNullifier(): bigint {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return BigInt("0x" + Array.from(array).map(b => b.toString(16).padStart(2, "0")).join(""))
}

/**
 * Estructura de un ticket privado
 */
export interface PrivateTicket {
  secret: bigint
  nullifier: bigint
  commitment?: bigint
  leafIndex?: number
  raffleId?: bigint
}

/**
 * Guarda un ticket en localStorage
 */
export function saveTicket(ticket: PrivateTicket, raffleId: bigint): void {
  const key = `raffle_ticket_${raffleId}`
  const data = {
    secret: ticket.secret.toString(),
    nullifier: ticket.nullifier.toString(),
    commitment: ticket.commitment?.toString(),
    leafIndex: ticket.leafIndex,
    raffleId: raffleId.toString(),
    timestamp: Date.now(),
  }
  localStorage.setItem(key, JSON.stringify(data))
}

/**
 * Recupera un ticket de localStorage
 */
export function loadTicket(raffleId: bigint): PrivateTicket | null {
  const key = `raffle_ticket_${raffleId}`
  const stored = localStorage.getItem(key)
  if (!stored) return null
  
  try {
    const data = JSON.parse(stored)
    return {
      secret: BigInt(data.secret),
      nullifier: BigInt(data.nullifier),
      commitment: data.commitment ? BigInt(data.commitment) : undefined,
      leafIndex: data.leafIndex,
      raffleId: BigInt(data.raffleId),
    }
  } catch {
    return null
  }
}

/**
 * Lista todos los tickets guardados
 */
export function listAllTickets(): Array<PrivateTicket & { raffleId: bigint }> {
  const tickets: Array<PrivateTicket & { raffleId: bigint }> = []
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith("raffle_ticket_")) {
      const stored = localStorage.getItem(key)
      if (stored) {
        try {
          const data = JSON.parse(stored)
          tickets.push({
            secret: BigInt(data.secret),
            nullifier: BigInt(data.nullifier),
            commitment: data.commitment ? BigInt(data.commitment) : undefined,
            leafIndex: data.leafIndex,
            raffleId: BigInt(data.raffleId),
          })
        } catch {
          // Skip invalid entries
        }
      }
    }
  }
  
  return tickets
}

/**
 * Borra un ticket de localStorage
 */
export function deleteTicket(raffleId: bigint): void {
  const key = `raffle_ticket_${raffleId}`
  localStorage.removeItem(key)
}
