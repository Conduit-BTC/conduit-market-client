import {
  useCartStore,
  type CartItem as StoreCartItem
} from '@/stores/useCartStore'
import ShippingForm from '@/components/ZapoutPage/ShippingForm.tsx'
import { createOrder } from '@/lib/nostr/createOrder.ts'
import { useCallback, useEffect } from 'react'
import { NDKEvent } from '@nostr-dev-kit/ndk'
import postOrder from '@/lib/nostr/postOrder.ts'
import { useAccountStore } from '@/stores/useAccountStore'
import useWindowState, { WindowTypes } from '@/stores/useWindowState'
import BackButton from '@/components/Buttons/BackButton'
import PageSection from '@/layouts/PageSection'
import OrderSummary from '@/components/ZapoutPage/OrderSummary'
import { useParams, useSearch, useLocation } from 'wouter'
import PaymentMethod from '@/components/ZapoutPage/PaymentMethod'
import Button from '@/components/Buttons/Button'
import Icon from '@/components/Icon'
import ZapoutConfirmation from '@/components/ZapoutPage/ZapoutConfirmation'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useZapoutStore } from '@/stores/useZapoutStore'


type ZapoutStep = {
  label: string
  query: string
  component?: React.FC
}

const ZapoutPage: React.FC = () => {
  const { merchantPubkey } = useParams()
  const { getCart } = useCartStore()
  const setCartItems = useZapoutStore((s) => s.setCartItems)

  useEffect(() => {
    if (merchantPubkey) {
      const cart = getCart(merchantPubkey)
      if (cart && cart.items.length > 0) {
        setCartItems(cart.items) // ✅ Just the items go into Zustand
      }
    }
  }, [merchantPubkey])


  const query = useSearch() // zapoutStep=shipping
  const step = query.split('=')[1] ?? 'shipping' // shipping

  const [location, setLocation] = useLocation()

  const zapoutSteps: ZapoutStep[] = [
    {
      label: 'Shipping',
      query: 'shipping',
      component: ShippingForm
    },
    {
      label: 'Payment',
      query: 'payment',
      component: PaymentMethod
    },
    {
      label: 'Confirmation',
      query: 'confirmation',
      component: ZapoutConfirmation
    }
  ]

  const currentStep = zapoutSteps.find((s) => s.query === step)
  const CurrentStep = currentStep?.component

  useEffect(() => {
    // If no search query is present, set it to the first step
    if (!query || query === '?') {
      // `setLocation` behaves like the `navigate` helper from wouter and accepts
      // an options object where `replace: true` performs a history.replaceState
      // instead of history.pushState.
      setLocation(`?zapoutStep=${zapoutSteps[0].query}`, { replace: true })
    }
  }, [query, location])

  const handleBack = () => {
    console.log('handleBack', location)
    if (window.history.length > 1) {
      window.history.back()
    }
  }

  const [animate] = useAutoAnimate()

  return (
    <PageSection width="normal">
      <div className="grid md:grid-cols-2 items-start gap-12">
        <div ref={animate}>
          <div className="flex gap-2 items-center border-b border-ink pb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="lg:-ml-12"
            >
              <Icon.ChevronLeft className="size-10" />
            </Button>
            <h1 className="voice-2l">{currentStep?.label}</h1>
          </div>
          {CurrentStep && <CurrentStep />}

          <p className="voice-sm text-muted-foreground mt-8 text-balance">
            {`Your data stays between you and the Merchant. Order details and shipping info are sent directly to them via NIP-17 Private Message. We don’t store it. We don’t see it.`}
          </p>
        </div>

        <OrderSummary merchantPubkey={merchantPubkey as string} />
      </div>
    </PageSection>
  )
}

export default ZapoutPage
