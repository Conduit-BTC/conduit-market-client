import Icon from '@/components/Icon'
import Button from '@/components/Buttons/Button'
import React from 'react'
import PageSection from '@/layouts/PageSection'
import Field from '@/components/Form/Field'

const AuthPage: React.FC = () => {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    }
  }

  const ifComingFromZapout = false

  return (
    <PageSection width="xNarrow" sectionClassName="relative overflow-hidden">
      <div className="flex gap-2 items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="-ml-12"
        >
          <Icon icon="chevronLeft" className="size-10" />
        </Button>
        <h1 className="voice-5l">
          {ifComingFromZapout ? 'Continue to Zapout' : 'Sign in'}
        </h1>
      </div>
      <p className="voice-base text-center text-balance">
        To connect to thousands of independent merchants and millions of
        products
      </p>

      {/* todo replace with better form when adding functionality */}
      <form className="grid gap-4 mt-4">
        <h2 className="voice-lg">Sign in</h2>
        <Button
          variant="outline"
          size="lg"
          className="border-primary"
          rounded={false}
        >
          <Icon icon="lock" />
          Nostr Signer
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="border-primary"
          rounded={false}
        >
          <Icon icon="mail" />
          Email Sign in
        </Button>
        <Field label="Paste Nsec" name="nsec" type="text" leftIcon="paste" />
      </form>
      <div className="grid gap-4 mt-16 border-t border-muted pt-8">
        <h2 className="voice-lg">Sign up</h2>
        <p className="voice-base">
          You can create a profile (nsec) per transaction
        </p>
        <Button variant="primary" size="lg" rounded={false}>
          <Icon icon="userPlus" />
          Create Nsec
        </Button>
      </div>

      <picture className="absolute w-auto h-full rotate-y-180  -left-1/6  top-1/2 translate-x-1/2 -translate-y-1/2 -z-10 hidden lg:block 3xl:left-1">
        <img
          src="/images/sprites/acea-sprite.png"
          alt="Acea sprite"
          className="object-contain w-auto h-full"
        />
      </picture>

      {/* Eric sprite on the right */}
      <picture className="absolute w-auto h-full -right-1/6  top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 hidden lg:block 3xl:right-1">
        <img
          src="/images/sprites/eric-sprite.png"
          alt="Eric sprite"
          className="object-contain w-auto h-full"
        />
      </picture>
    </PageSection>
  )
}

export default AuthPage
