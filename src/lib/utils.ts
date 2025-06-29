import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

type VoiceClassGroupIds = 'voice'

const twMerge = extendTailwindMerge<VoiceClassGroupIds>({
  extend: {
    classGroups: {
      voice: [
        { voice: ['xs', 'sm', 'base', 'lg', '2l', '3l', '4l', '5l', '6l'] }
      ]
    },
    conflictingClassGroups: {
      voice: ['voice']
    }
  }
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number,
  currency: string = 'SAT',
  convertToSats?: (currency: string, value: number) => number
) {
  if (currency === 'SAT' || currency === 'SATS') {
    return `S ${new Intl.NumberFormat('en-US').format(price)}`
  }

  // If we have a convertToSats function and the currency is USD, convert to sats
  if (convertToSats && currency.toUpperCase() === 'USD') {
    const sats = convertToSats(currency, price)
    return `S ${new Intl.NumberFormat('en-US').format(sats)}`
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(price)
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat('en-US').format(number)
}

const formatPubkey = (pubkey: string) => {
  if (!pubkey) return ''
  return `${pubkey.substring(0, 8)}...${pubkey.substring(pubkey.length - 4)}`
}
