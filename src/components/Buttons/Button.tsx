import React from 'react'
import { cn } from '../../lib/utils'
import { Link } from 'wouter'
export interface ButtonProps {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'link'
    | 'accent'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  rounded?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  isLink?: boolean
  to?: string
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  rounded = true,
  children,
  isLink = false,
  to = '',
  onClick
}) => {
  const classNameValue = cn(
    'flex items-center gap-2 justify-center font-bold transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2',
    {
      'bg-primary-500 text-primary-foreground hover:bg-primary-600 focus:ring-primary':
        variant === 'primary',
      'bg-muted text-muted-foreground hover:bg-muted-foreground/10 focus:ring-muted':
        variant === 'secondary',
      'border-2 border-ink-500 text-ink-foreground hover:bg-ink/20 focus:ring-ink':
        variant === 'outline',
      'bg-accent text-accent-foreground hover:bg-accent/90 focus:ring-accent':
        variant === 'accent',
      'bg-transparent text-ink-foreground hover:bg-ink/20 focus:ring-ink':
        variant === 'ghost',
      'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive':
        variant === 'destructive',
      'text-primary-foreground hover:text-primary-foreground/80 hover:underline focus:ring-primary':
        variant === 'link',
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-base': size === 'md',
      'px-6 py-3 text-lg': size === 'lg',
      'p-2': size === 'icon',
      'opacity-50 cursor-not-allowed': disabled,
      'cursor-pointer': !disabled,
      'rounded-full': rounded,
      'rounded-lg': !rounded
    }
  )

  if (isLink) {
    return (
      <Link to={to} className={classNameValue}>
        {children}
      </Link>
    )
  }
  return (
    <button className={classNameValue} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
