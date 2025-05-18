import { Zap } from 'lucide-react'
import Button from './Button'

export const ZapButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Zap className="text-primary" />
    </Button>
  )
}
