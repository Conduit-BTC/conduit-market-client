import { cn } from '../lib/utils'

export const Badge = ({
  children,
  className = '',
  variant = 'primary'
}: {
  children: React.ReactNode
  className?: string
  variant?:
    | 'primary'
    | 'secondary'
    | 'muted'
    | 'destructive'
    | 'success'
    | 'warning'
}) => {
  const classNameValue = cn(
    'inline-flex items-center px-4 py-1 rounded-full voice-sm font-bold',
    {
      'bg-primary text-primary-foreground': variant === 'primary',
      'bg-secondary text-secondary-foreground': variant === 'secondary',
      'bg-muted text-muted-foreground': variant === 'muted',
      'bg-destructive text-destructive-foreground': variant === 'destructive',
      'bg-success text-success-foreground': variant === 'success',
      'bg-warning text-warning-foreground animate-bounce': variant === 'warning'
    },
    className
  )

  return <span className={classNameValue}>{children}</span>
}
