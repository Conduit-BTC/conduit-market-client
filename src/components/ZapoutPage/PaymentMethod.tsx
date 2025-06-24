import { useCallback, useState } from 'react'
import { useLocation, useParams } from 'wouter'
import Button from '../Buttons/Button'
import Field from '../Form/Field'

import Icon from '../Icon'
import { IconPill } from '../Pill'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs'
import { createOrder } from '@/lib/nostr/createOrder'
import { NDKEvent } from '@nostr-dev-kit/ndk'
import postOrder from '@/lib/nostr/postOrder'
import { useCartStore } from '@/stores/useCartStore'
import type { ShippingFormData } from './ShippingForm'

import { useZapoutStore } from '@/stores/useZapoutStore'

const PaymentMethod: React.FC = () => {
  const [location, navigate] = useLocation()
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const { carts, getCart } = useCartStore()
  const { merchantPubkey } = useParams()
  const cart = useCallback(
    () => merchantPubkey && getCart(merchantPubkey),
    [merchantPubkey]
  )

  // ✅ Zustand integration + tab sync
  const paymentMethod = useZapoutStore((s) => s.paymentMethod)
  const setPaymentMethod = useZapoutStore((s) => s.setPaymentMethod)
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod ?? 'lightning')

  const paymentMethods = [
    {
      label: 'Lightning',
      value: 'lightning',
      icon: 'Zap',
      component: LightningPaymentMethod
    },
    {
      label: 'USDT',
      value: 'usdt',
      icon: 'Type'
    },
    {
      label: 'On-Chain',
      value: 'onchain',
      icon: 'Link'
    },
    {
      label: 'Minipay',
      value: 'minipay',
      icon: 'PhoneCall'
    }
  ]

  // TODO: guard this page from non-logged in users

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
    shippingInfo: ShippingFormData,
    pubkey: string
  ) {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // when submitted, ie generate invoice, then the tabs content is shown
    navigate(`?zapoutStep=confirmation`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs
        className="mt-8"
        value={selectedMethod}
        onValueChange={(val) => {
          setSelectedMethod(val)
          setPaymentMethod(val)
        }}
      >
        <TabsList>
          {paymentMethods.map((method) => (
            <TabsTrigger
              key={method.value}
              value={method.value}
              isSelectedClassName="bg-ink text-primary border-ink"
              className="flex items-center gap-2 rounded-full p-0 bg-muted"
            >
              <IconPill
                text={method.label}
                leftIcon={method.icon as keyof typeof Icon}
                size="md"
                className="border-none bg-transparent"
              />
            </TabsTrigger>
          ))}
        </TabsList>

        {paymentMethods.map((method) => {
          if (isGenerated) {
            return (
              <TabsContent key={method.value} value={method.value}>
                {method.component && <method.component />}
              </TabsContent>
            )
          }
        })}
      </Tabs>

      <Button variant="primary" className="w-full mt-8" rounded={false}>
        Generate Invoice
      </Button>
    </form>
  )
}

const LightningPaymentMethod: React.FC = () => {
  return (
    <div className="grid gap-4 border-muted border-2 rounded-lg p-4 bg-primary-900/50">
      <picture className="max-w-2/3 mx-auto rounded-lg">
        <img
          src="/images/placeholders/square.jpg"
          alt="Lightning"
          className="w-full h-full object-cover"
        />
      </picture>

      <Field
        name="lightningAddress"
        placeholder="npub1q2w3e4r5t64392f3921u... "
      />

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="border-primary flex-1"
          rounded={false}
          size="lg"
        >
          <Icon.Copy className="size-5" />
          <span>Copy</span>
        </Button>

        <Button
          variant="outline"
          className="border-primary flex-1"
          rounded={false}
          size="lg"
        >
          <Icon.Share className="size-5" />
          <span>Share</span>
        </Button>
      </div>
    </div>
  )
}

export default PaymentMethod
