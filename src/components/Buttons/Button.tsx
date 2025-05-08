import React from 'react'
import { cn } from '../../lib/utils'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  rounded?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  rounded = true,
  children,
  onClick
}) => {
  const classNameValue = cn(
    'flex items-center gap-2 font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2',
    {
      'bg-primary-500 text-primary-foreground hover:bg-primary-600 focus:ring-primary':
        variant === 'primary',
      'bg-muted text-muted-foreground hover:bg-muted-foreground/10 focus:ring-muted':
        variant === 'secondary',
      'border-2 border-primary-500 text-primary-foreground hover:bg-primary/20 focus:ring-primary':
        variant === 'outline',
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
      'rounded-full': !rounded,
      'rounded-lg': rounded
    }
  )

  return (
    <button className={classNameValue} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
