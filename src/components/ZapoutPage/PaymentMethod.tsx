import { useLocation } from 'wouter'
import Button from '../Buttons/Button'
import Field from '../Form/Field'

import Icon, { type IconName } from '../Icon'
import { IconPill } from '../Pill'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs'

const PaymentMethod: React.FC = () => {
  const [location, navigate] = useLocation()

  const paymentMethods = [
    {
      label: 'Lightning',
      value: 'lightning',
      icon: 'zap',
      component: LightningPaymentMethod
    },
    {
      label: 'USDT',
      value: 'usdt',
      icon: 'type'
    },
    {
      label: 'On-Chain',
      value: 'onchain',
      icon: 'link'
    },
    {
      label: 'Minipay',
      value: 'minipay',
      icon: 'phoneCall'
    },
    {
      label: 'Fiat',
      value: 'fiat',
      icon: 'landmark'
    }
  ]

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate(`?zapoutStep=confirmation`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs className="mt-8" defaultValue="lightning">
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
                leftIcon={method.icon as IconName}
                size="md"
                className="border-none bg-transparent"
              />
            </TabsTrigger>
          ))}
        </TabsList>
        {paymentMethods.map((method) => (
          <TabsContent key={method.value} value={method.value}>
            {method.component && <method.component />}
          </TabsContent>
        ))}
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
          <Icon icon="copy" className="size-5" />
          <span>Copy</span>
        </Button>

        <Button
          variant="outline"
          className="border-primary flex-1"
          rounded={false}
          size="lg"
        >
          <Icon icon="share" className="size-5" />
          <span>Share</span>
        </Button>
      </div>
    </div>
  )
}

export default PaymentMethod
