import { useState, useEffect, useCallback, useRef } from 'react'

interface ExchangeRate {
  rate: number
  lastUpdated: number
}

interface UseSatsReturn {
  convertToSats: (currency: string, value: number) => number
  convertToUsd: (currency: string, value: number) => number
  isLoading: boolean
  error: string | null
  lastUpdated: number | null
}

// Cache for the exchange rate to avoid multiple API calls
let rateCache: ExchangeRate | null = null
let fetchPromise: Promise<number> | null = null

const CACHE_DURATION = 10000 // 10 seconds in milliseconds

async function fetchBitcoinRate(): Promise<number> {
  try {
    const response = await fetch('https://mempool.space/api/v1/prices', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const btcToUsd = data.USD
    if (!btcToUsd) {
      throw new Error('Invalid response format from mempool.space API')
    }

    // 1 USD = (1 / btcToUsd) * 100,000,000 sats
    const satsPerUsd = (1 / btcToUsd) * 100000000
    return satsPerUsd
  } catch (error) {
    console.error('Error fetching Bitcoin rate:', error)
    throw error
  }
}

async function getCachedRate(): Promise<number> {
  const now = Date.now()

  // Check if we have a valid cached rate
  if (rateCache && now - rateCache.lastUpdated < CACHE_DURATION) {
    return rateCache.rate
  }

  // If there's already a fetch in progress, wait for it
  if (fetchPromise) {
    return fetchPromise
  }

  // Start a new fetch
  fetchPromise = fetchBitcoinRate()

  try {
    const rate = await fetchPromise
    rateCache = {
      rate,
      lastUpdated: now
    }
    return rate
  } finally {
    fetchPromise = null
  }
}

export function useSats(): UseSatsReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const convertToSats = useCallback(
    (currency: string, value: number): number => {
      if (currency.toUpperCase() !== 'USD') {
        console.warn(
          `Currency ${currency} not supported, only USD is supported`
        )
        return 0
      }

      if (!rateCache) {
        return 0
      }

      // Convert USD to sats
      return Math.round(value * rateCache.rate)
    },
    []
  )

  const convertToUsd = useCallback(
    (currency: string, value: number): number => {
      if (
        currency.toUpperCase() !== 'SAT' &&
        currency.toUpperCase() !== 'SATS'
      ) {
        console.warn(
          `Currency ${currency} not supported for SAT->USD conversion`
        )
        return 0
      }
      if (!rateCache) {
        return 0
      }
      // Convert sats to USD
      return value / rateCache.rate
    },
    []
  )

  // Initial fetch and periodic updates
  useEffect(() => {
    let cancelled = false

    const fetchRate = async () => {
      if (cancelled) return

      setIsLoading(true)
      setError(null)

      try {
        const rate = await getCachedRate()
        if (!cancelled) {
          setLastUpdated(Date.now())
          setIsLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch exchange rate'
          )
          setIsLoading(false)
        }
      }
    }

    // Initial fetch
    fetchRate()

    // Set up periodic updates every 10 seconds
    intervalRef.current = setInterval(fetchRate, CACHE_DURATION)

    return () => {
      cancelled = true
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    convertToSats,
    convertToUsd,
    isLoading,
    error,
    lastUpdated
  }
}
