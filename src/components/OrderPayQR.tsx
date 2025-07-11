import React, { useMemo, useEffect, memo, useState, useCallback } from 'react'
import LightningQR from './LightningQR'
import LightningInvoiceCopyArea from './LightningInvoiceCopyArea'
import { OrderUtils } from 'nostr-commerce-schema'
import type { NostrEvent } from '@nostr-dev-kit/ndk'
import Avatar from './Avatar'
import { useNostrProfile } from '@/hooks/useNostrProfile'
import { usePaymentExpiration } from '@/hooks/usePaymentExpiration'

interface OrderPayQRProps {
  event: NostrEvent
}

const ExpirationCountdown = memo<{
  event: NostrEvent
  onExpirationChange: (isExpired: boolean) => void
}>(({ event, onExpirationChange }) => {
  const { formattedTime, isExpired, expirationSource } =
    usePaymentExpiration(event)

  useEffect(() => {
    onExpirationChange(isExpired)
  }, [isExpired, onExpirationChange])

  if (!formattedTime) return null

  return (
    <div
      className={`font-mono text-sm ${isExpired ? 'mb-2' : 'mb-1'} ${
        isExpired ? 'text-red-400' : 'text-orange-400'
      }`}
    >
      <div>Expires: {formattedTime}</div>
      {expirationSource !== 'none' && (
        <div className="text-xs opacity-75">
          Source:{' '}
          {expirationSource === 'lightning'
            ? 'Lightning Invoice'
            : 'Nostr Event'}
        </div>
      )}
    </div>
  )
})

ExpirationCountdown.displayName = 'ExpirationCountdown'

// Memoized main content component that doesn't re-render unless isExpired changes
const OrderPayQRContent = memo<{
  event: NostrEvent
  handleExpirationChange: (isExpired: boolean) => void
  paymentMethod: any
  amount: any
  merchant: any
  isExpired: boolean
}>(
  ({
    event,
    handleExpirationChange,
    paymentMethod,
    amount,
    merchant,
    isExpired
  }) => {
    return (
      <>
        {/* Merchant Info */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <Avatar
            imageUrl={merchant.picture}
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

        <ExpirationCountdown
          event={event}
          onExpirationChange={handleExpirationChange}
        />

        {isExpired ? (
          <div className="flex flex-col items-center justify-center w-[300px] h-[300px] bg-red-900/20 border-2 border-red-500 rounded-lg">
            <div className="text-red-400 text-6xl font-bold mb-4">EXPIRED</div>
            <div className="text-red-300 text-lg text-center">
              This invoice has expired
            </div>
          </div>
        ) : (
          <div className="relative w-full max-w-lg mx-auto p-8 shadow-2xl backdrop-blur-md overflow-hidden animate-fade-in">
            {/* Animated border glow */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-primary-500/20 animate-border-glow" />

            <div className="flex flex-col items-center gap-6">
              <div className="text-primary-400 w-full text-center animate-pulse">
                ⚡ Scan with your Lightning wallet to pay
              </div>

              <LightningQR lightningInvoice={paymentMethod.value} width={300} />
              {amount && (
                <div className="text-2xl font-bold text-primary-200 mt-2">
                  {amount}
                </div>
              )}
              <LightningInvoiceCopyArea
                lightningInvoice={paymentMethod.value}
              />
            </div>
          </div>
        )}
      </>
    )
  }
)

OrderPayQRContent.displayName = 'OrderPayQRContent'

const OrderPayQR: React.FC<OrderPayQRProps> = memo(({ event }) => {
  const [isExpired, setIsExpired] = useState(false)

  const paymentMethod = useMemo(
    () => OrderUtils.getPaymentMethod(event),
    [event]
  )
  console.log('Event: ', event)
  const amount = useMemo(() => OrderUtils.getOrderAmount(event as any), [event])
  const merchant = useNostrProfile(event.pubkey)

  const handleExpirationChange = useCallback((expired: boolean) => {
    setIsExpired(expired)
  }, [])

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  if (!paymentMethod || paymentMethod.type !== 'lightning') {
    return (
      <div className="text-center p-8 text-primary-200">
        No Lightning invoice found for this payment request.
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <OrderPayQRContent
        event={event}
        handleExpirationChange={handleExpirationChange}
        paymentMethod={paymentMethod}
        amount={amount}
        merchant={merchant}
        isExpired={isExpired}
      />
    </div>
  )
})

OrderPayQR.displayName = 'OrderPayQR'

export default OrderPayQR
