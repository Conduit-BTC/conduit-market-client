import { cn } from '@/lib/utils'
import { Link } from 'wouter'

interface LogoProps {
  variant?: 'full' | 'bg' | 'icon' | 'word'
  className?: string
}

const Logo: React.FC<LogoProps> = ({ variant = 'full', className }) => {
  let logoSrc = '/images/logo/'

  switch (variant) {
    case 'bg':
      logoSrc += 'logo-full-bg.svg'
      break
    case 'icon':
      logoSrc += 'logo-icon.svg'
      break
    case 'word':
      logoSrc += 'logo-word.svg'
      break
    default:
      logoSrc += 'logo-full.svg'
      break
  }

  return (
	<Link to="/" className="flex items-center gap-2 select-none">
	<picture className={cn('', className)}>
	  <img src={logoSrc} alt="Logo" />
	</picture>
	<p className="font-bold font-display text-4xl border-l border-primary-foreground pl-2">market</p>
 </Link>
  )
}

export default Logo
