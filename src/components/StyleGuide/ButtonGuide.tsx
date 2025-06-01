import Button from '@/components/Buttons/Button'
import { Zap } from 'lucide-react'

const buttonVariants = [
  'primary',
  'secondary',
  'muted',
  'outline',
  'destructive',
  'ghost',
  'link',
  'accent'
] as const

const buttonSizes = ['sm', 'md', 'lg'] as const

export function ButtonGuide() {
  return (
    <div className="space-y-8">
      <h2 className="voice-3l mb-6">Buttons</h2>

      {/* Variants */}
      <div className="space-y-4">
        <h3 className="voice-2l">Variants</h3>
        <div className="flex flex-wrap gap-4">
          {buttonVariants.map((variant) => (
            <Button key={variant} variant={variant as any}>
              {variant}
            </Button>
          ))}
          {buttonVariants.map((variant) => (
            <Button rounded={false} key={variant} variant={variant as any}>
              {variant}
            </Button>
          ))}
        </div>
      </div>

      {/* Rounded
      <div className="space-y-4">
        <h3 className="firm">Rounded</h3>
        <div className="flex flex-wrap gap-4">
          <Button rounded={false}>Rounded</Button>
        </div>
      </div> */}

      {/* Sizes */}
      <div className="space-y-4">
        <h3 className="firm">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Zap />
          </Button>
        </div>
      </div>

      {/* With Icons */}
      <div className="space-y-4">
        <h3 className="firm">With Icons</h3>
        <div className="flex flex-wrap gap-4 items-center">
          {buttonVariants.map((variant) => (
            <Button key={variant} variant={variant}>
              <Zap className="size-6" />
              {variant} with Icon
            </Button>
          ))}
        </div>
      </div>

      {/* Disabled State */}
      <div className="space-y-4">
        <h3 className="firm">Disabled State</h3>
        <div className="flex flex-wrap gap-4">
          {buttonVariants.map((variant) => (
            <Button key={variant} variant={variant} disabled>
              {variant} Disabled
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
