import Button from '@/components/Buttons/Button'
import ZapoutButton from '@/components/Buttons/ZapoutButton'
import Field from '@/components/Form/Field'
import Icon from '@/components/Icon'
import PageSection from '@/layouts/PageSection'

const CreateAccountPage: React.FC = () => {
  const ifComingFromZapout = true

  return (
    <PageSection width="normal" sectionClassName="relative overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <div className="grid gap-2">
            <h1 className="voice-5l text-balance">You’ve created an Nsec!</h1>
            <p className="voice-base text-balance">
              This is your decentralized identity. No emails, no passwords, no
              platform lock-in. Just your key to the open internet.
            </p>
            <p className="voice-sm font-bold text-warning-foreground flex items-center gap-2">
              <Icon icon="alert" className="size-4" /> Don’t lose it. We can’t
              recover it for you.
            </p>
          </div>
          <form className="grid gap-8 mt-8 border-t pt-8 border-muted">
            <div className="relative grid gap-4">
              <Field
                name="nsec"
                type="text"
                label="Your Private Key"
                placeholder="Nsec"
                labelClassName="voice-lg font-bold mb-2"
              />

              <p className="md:absolute top-0 right-0 voice-sm font-bold text-info-foreground flex items-center gap-1">
                <Icon icon="key" className="size-4" /> nsec1 = secret, never
                share
              </p>

              <div className="grid md:flex gap-4 md:justify-between items-center ">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary flex-1"
                  rounded={false}
                >
                  <Icon icon="copy" className="size-4" /> Copy Your Nsec
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary flex-1"
                  rounded={false}
                >
                  <Icon icon="lock" className="size-4" /> Encrypt with Pin
                </Button>
              </div>
            </div>

            <div className="relative grid gap-4">
              <Field
                name="nsec"
                type="text"
                label="Your Public Key"
                placeholder="Npub"
                labelClassName="voice-lg font-bold mb-2"
              />

              <p className="md:absolute top-0 right-0 voice-sm font-bold text-info-foreground flex items-center gap-1">
                <Icon icon="shieldCheck" className="size-4" /> npub1 = public,
                safe to share
              </p>
              <Button
                variant="outline"
                size="lg"
                className="border-primary flex-1"
                rounded={false}
              >
                <Icon icon="copy" className="size-4" /> Copy Your Npub
              </Button>
            </div>

            <Button
              variant="ghost"
              size="lg"
              className="text-primary flex-1"
              rounded={false}
            >
              Create New Nsec
            </Button>
          </form>
        </div>
        <div className="grid gap-8 items-end">
          <ul className="grid gap-8">
            <li className="border-b pb-8 border-muted">
              <h3 className="voice-base font-bold">What’s a Nostr Key?</h3>
              <p className="voice-base  mt-2">
                This is your passport to decentralized commerce. It’s how
                Conduit and other Nostr apps know it’s you—without tracking you.
              </p>
            </li>
            <li className="border-b pb-8 border-muted">
              <h3 className="voice-base font-bold">
                What’s my <Icon icon="key" className="size-4 inline-block" />{' '}
                nsec1 ?
              </h3>
              <p className="voice-base  mt-2">
                Think of it as your password that cannot be changed or forged.
                Keep it safe. Anyone with this key can act as you.
              </p>
            </li>
            <li className="border-b pb-8 border-muted">
              <h3 className="voice-base font-bold">
                What’s my{' '}
                <Icon icon="shieldCheck" className="size-4 inline-block" />{' '}
                npub1 ?
              </h3>
              <p className="voice-base  mt-2">
                This is your public Nostr identity. (like your username) You can
                share it with others to receive messages, reviews, or zaps.
              </p>
            </li>
          </ul>

          {ifComingFromZapout && (
            // todo get merchant pubkey somehow
            <div>
              <h2 className="voice-lg font-bold">Continue to Zapout</h2>
              <ZapoutButton className="mt-4" size="lg" rounded={false}>
                Zapout
              </ZapoutButton>
            </div>
          )}
        </div>
      </div>

      {/* Eric sprite on the right */}
      <picture className="absolute w-auto h-full -right-2/10  top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 hidden lg:block 3xl:right-1">
        <img
          src="/images/sprites/eric-sprite.png"
          alt="Eric sprite"
          className="object-contain w-auto h-full"
        />
      </picture>
    </PageSection>
  )
}

export default CreateAccountPage
