import { useLogin } from 'nostr-hooks'
import Button from '@/components/Buttons/Button.tsx'
import Icon from './Icon'
import { useAccountStore } from '@/stores/useAccountStore'

export const SignerLoginButton = () => {
  const { login, isLoggedIn, user } = useAccountStore()

  return (
    <Button
      variant="outline"
      size="lg"
      className="border-primary"
      rounded={false}
      onClick={async (e) => {
        e?.preventDefault()
        if (isLoggedIn) console.log('Already logged in: ', user)
        else {
        }
        console.log('Logging in...')
        await login()
      }}
    >
      <Icon.Lock />
      Nostr Signer
    </Button>
  )
}
