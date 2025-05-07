import React from 'react'

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
  const baseStyles =
    'flex items-center gap-2 font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2'

  const variantStyles = {
    primary:
      'bg-primary-500 text-primary-foreground hover:bg-primary-600 focus:ring-primary',
    secondary:
      'bg-muted text-muted-foreground hover:bg-muted-foreground/10 focus:ring-muted',
    outline:
      'border-2 border-primary-500 text-primary-foreground hover:bg-primary/20 focus:ring-primary',
    destructive:
      'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive',
    link: 'text-primary-foreground hover:text-primary-foreground/80 hover:underline focus:ring-primary'
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2'
  }

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer'

  const roundedStyles = rounded ? 'rounded-full' : 'rounded-lg'

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyles} ${disabledStyles}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
