/**
 * Parses a number that may have format with commas, decimals, and suffixes like USD
 * Examples: "1,000,000 USD" -> 1000000, "1.5K" -> 1500, "100" -> 100
 */
export function parseFormattedNumber(value: string | number): number {
  if (typeof value === 'number') return value
  
  try {
    let cleaned = value.trim().toLowerCase()
    
    cleaned = cleaned.replace(/[$€£¥]/g, '')
    cleaned = cleaned.replace(/\s*(usd|eur|eth|dai|usdc)\s*/gi, '')
    
    // Handle suffixes like K, M, B
    let multiplier = 1
    if (cleaned.endsWith('k')) {
      multiplier = 1_000
      cleaned = cleaned.slice(0, -1)
    } else if (cleaned.endsWith('m')) {
      multiplier = 1_000_000
      cleaned = cleaned.slice(0, -1)
    } else if (cleaned.endsWith('b')) {
      multiplier = 1_000_000_000
      cleaned = cleaned.slice(0, -1)
    }
    
    // Remove commas (American format: 1,000,000)
    cleaned = cleaned.replace(/,/g, '')
    
    // Parse the number
    const parsed = parseFloat(cleaned)
    
    if (isNaN(parsed)) {
      throw new Error(`Cannot parse "${value}" as number`)
    }
    
    return parsed * multiplier
  } catch (error) {
    console.error(`Error parsing formatted number: "${value}"`, error)
    return 0
  }
}


export function formatNumberWithCommas(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(num)) return '0'
  
  return num.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  })
}


export function parseSafeBalance(balance: string | number): number {
  try {
    if (typeof balance === 'number') {
      return isNaN(balance) ? 0 : balance
    }
    
    const parsed = parseFormattedNumber(balance)
    return isNaN(parsed) ? 0 : parsed
  } catch (error) {
    console.error('Error parsing balance:', balance, error)
    return 0
  }
}
