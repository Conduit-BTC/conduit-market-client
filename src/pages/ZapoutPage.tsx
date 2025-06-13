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

interface OrderData {
  items: Array<{
    eventId: string
    productId: string
    quantity: number
    price: number
  }>
  shipping?: {
    eventId: string
    methodId: string
  }
  address?: string
  phone?: string
  email?: string
  message?: string
}

async function prepareOrder(
  cart: CartItem[],
  shippingInfo: unknown,
  pubkey: string
) {
  const isMultiMerchantCart = cart.some(
    (item) => item.merchantPubkey !== cart[0].merchantPubkey
  )

  if (isMultiMerchantCart) {
    console.error('TODO: Process multi-merchant carts')
    return
  }

  const addressString =
    typeof shippingInfo === 'string'
      ? shippingInfo
      : JSON.stringify(shippingInfo)

  const orderData: OrderData = {
    items: cart.map((item) => ({
      eventId: item.eventId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    })),
    address: addressString,
    message: `Order from Pubkey: ${pubkey}`
  }

  const order = await createOrder(orderData, cart[0].merchantPubkey)

  if (!order || !(order instanceof NDKEvent)) {
    console.error(
      '[ZapoutPage.prepareOrder] Failed to create order. Error:',
      order?.message || 'Unknown error'
    )
    // TODO: Display error to user
    return
  }

  postOrder(order, cart[0].merchantPubkey)
}

type ZapoutStep = {
  label: string
  query: string
  component?: React.FC
}

const ZapoutPage: React.FC = () => {
  const { merchantPubkey } = useParams()
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
              <Icon icon="chevronLeft" className="size-10" />
            </Button>
            <h1 className="voice-2l">{currentStep?.label}</h1>
          </div>
          {CurrentStep && <CurrentStep />}

          <p className="voice-sm text-muted-foreground mt-8 text-balance">
            Your personal data will be used to process your order, support your
            experience throughout this website, and for other purposes described
            in our privacy policy.
          </p>
        </div>

        <OrderSummary merchantPubkey={merchantPubkey as string} />
      </div>
    </PageSection>
  )
}

export default ZapoutPage
