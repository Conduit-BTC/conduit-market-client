import React from 'react'
import { cn } from '../../lib/utils'
import { Link } from 'wouter'
export interface ButtonProps {
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'muted'
    | 'ink'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  rounded?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  isLink?: boolean
  to?: string
  className?: string
  ref?: React.RefObject<HTMLButtonElement>
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  rounded = true,
  children,
  isLink = false,
  to = '',
  onClick,
  className,
  ref
}) => {
  const classNameValue = cn(
    // Base styles applied to all buttons
    'flex items-center gap-2 justify-center font-bold transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2 whitespace-nowrap flex-shrink-0',
    {
      // Primary variant - Solid background with primary color
      'bg-primary-500 text-primary-foreground hover:bg-primary-600 focus:ring-primary':
        variant === 'primary',
      // Secondary variant - Muted background with subtle hover effect
      'bg-secondary text-secondary-foreground hover:bg-secondary-foreground/10 focus:ring-secondary':
        variant === 'secondary',
      // Muted variant - Muted background with subtle hover effect
      'bg-muted text-muted-foreground hover:bg-muted/80 focus:ring-muted':
        variant === 'muted',
      // Ink variant - Muted background with subtle hover effect
      'bg-ink text-paper hover:bg-paper hover:text-ink focus:ring-ink':
        variant === 'ink',
      // Outline variant - Bordered button with transparent background
      'border-2 border-ink-500 text-ink-foreground hover:bg-ink/20 focus:ring-ink':
        variant === 'outline',
      // Accent variant - Special emphasis button
      'bg-accent text-accent-foreground hover:bg-accent/90 focus:ring-accent':
        variant === 'accent',
      // Ghost variant - Transparent button that shows background on hover
      'bg-transparent text-ink-foreground hover:bg-ink/20 focus:ring-ink':
        variant === 'ghost',
      // Destructive variant - Used for delete/remove actions
      'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive':
        variant === 'destructive',
      // Link variant - Appears as a text link with hover underline
      'text-ink-foreground font-medium hover:text-ink-foreground/80 hover:underline focus:ring-0 ':
        variant === 'link',
      // Size variants
      'px-3 py-1.5 text-sm': size === 'sm', // Small size
      'px-4 py-2 text-base': size === 'md', // Medium size (default)
      'px-6 py-3 text-lg': size === 'lg', // Large size
      'p-1': size === 'icon', // Icon button (square padding)
      // State styles
      'opacity-50 cursor-not-allowed': disabled, // Disabled state
      'cursor-pointer': !disabled, // Enabled state
      // Border radius variants
      'rounded-full': rounded, // Fully rounded corners
      'rounded-lg': !rounded // Slightly rounded corners
    },
    className
  )

  if (isLink) {
    return (
      <Link to={to} className={classNameValue}>
        {children}
      </Link>
    )
  }
  return (
    <button
      className={classNameValue}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </button>
  )
}

export default Button
