import { cn } from '@/lib/utils'

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
    <picture className={cn(className)}>
      <img src={logoSrc} alt="Logo" />
    </picture>
  )
}

export default Logo
