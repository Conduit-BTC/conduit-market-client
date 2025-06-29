import React, { useMemo } from 'react'
import BitcoinQR from './BitcoinQR'
import { OrderUtils } from 'nostr-commerce-schema'
import type { NostrEvent } from '@nostr-dev-kit/ndk'
import Avatar from './Avatar'
import { useNostrProfile } from '@/hooks/useNostrProfile'

function useExpirationCountdown(expiration?: number) {
  const [remaining, setRemaining] = React.useState<number | null>(null)
  React.useEffect(() => {
    if (!expiration) return
    const update = () => {
      const now = Math.floor(Date.now() / 1000)
      setRemaining(Math.max(0, expiration - now))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [expiration])
  if (remaining === null) return null
  if (remaining <= 0) return 'Expired'
  const m = Math.floor(remaining / 60)
  const s = remaining % 60
  return `${m > 0 ? m + 'm ' : ''}${s}s` + ' left'
}

interface OrderPayQRProps {
  event: NostrEvent
}

const OrderPayQR: React.FC<OrderPayQRProps> = ({ event }) => {
  const paymentMethod = OrderUtils.getPaymentMethod(event)
  const amount = OrderUtils.getOrderAmount(event as any)
  // Find merchant pubkey (assume event.pubkey is merchant)
  const merchantPubkey = event.pubkey
  const merchant = useNostrProfile(merchantPubkey)
  // Find expiration tag
  const expirationTag = event.tags.find((t) => t[0] === 'expiration')
  const expiration = expirationTag ? parseInt(expirationTag[1]) : undefined
  const countdown = useExpirationCountdown(expiration)

  if (!paymentMethod || paymentMethod.type !== 'lightning') {
    return (
      <div className="text-center p-8 text-primary-200">
        No Lightning invoice found for this payment request.
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      {/* Merchant Info */}
      <div className="flex flex-col items-center gap-2 mb-2">
        <Avatar
          picture={merchant.picture}
          alt={merchant.name || merchant.npub}
          size="lg"
          npub={merchant.npub}
          href={`https://njump.me/${merchant.npub}`}
        />
        <div className="text-primary-100 font-semibold text-lg">
          {merchant.displayName || merchant.name || merchant.npub}
        </div>
        <a
          href={`https://njump.me/${merchant.npub}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-400 text-xs hover:underline"
        >
          {merchant.npub}
        </a>
      </div>
      {/* Expiration countdown */}
      {expiration && (
        <div className="text-orange-400 font-mono text-sm mb-2">
          Expires: {countdown}
        </div>
      )}
      <BitcoinQR lightningInvoice={paymentMethod.value} width={300} />
      {amount && (
        <div className="text-2xl font-bold text-primary-200 mt-2">
          {OrderUtils.formatSats(amount)}
        </div>
      )}
    </div>
  )
}

export default OrderPayQR
