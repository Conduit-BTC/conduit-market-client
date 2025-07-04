import { useLocation } from 'wouter'
import Button from '@/components/Buttons/Button'
import Icon from '@/components/Icon'
import Logo from '@/components/Logo'

const NotFoundPage: React.FC = () => {
  const [_, navigate] = useLocation()

  return (
    <div className="rounded-lg px-8 py-12 grid h-full place-content-center place-items-center gap-8">
      <Logo variant="icon" className="max-w-20" />

      <div className="grid gap-4 text-center">
        <h1 className="voice-6l text-[160px] leading-none font-black text-center text-balance text-white">
          404
        </h1>
        <h2 className="voice-4l text-center text-balance mt-2">
          Page Not Found
        </h2>
        <p className="voice-2l text-center text-balance max-w-lg text-secondary-foreground">
          Oops! The page you're looking for doesn't exist.
        </p>
      </div>

      <div className="flex items-center gap-6 mt-12">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 border-primary text-3xl font-display px-8 py-4"
          onClick={() => window.history.back()}
          rounded={false}
        >
          <Icon.ArrowLeft className="shrink-0 mr-2" />
          Back
        </Button>
        <Button
          variant="muted"
          size="lg"
          className="flex-1 text-3xl font-display px-8 py-4"
          onClick={() => navigate('/')}
          rounded={false}
        >
          <Icon.Home className="shrink-0 mr-2" />
          Home
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
