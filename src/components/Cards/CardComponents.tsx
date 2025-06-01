import { cn } from '@/lib/utils'

export const Card = ({
  children,
  className = '',
  style = {}
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) => {
  return (
    <div
      className={cn(
        'bg-paper border-base-700 border rounded-lg shadow-md overflow-hidden hover:border-accent-500 transition-colors duration-300',
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn('px-2 py-2', className)}>{children}</div>
}

export const CardTitle = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <h3 className={cn('voice-2l text-ink', className)}>{children}</h3>
}

export const CardDescription = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <p className={cn('mt-1 voice-base', className)}>{children}</p>
}

export const CardContent = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn('px-2 py-2', className)}>{children}</div>
}

export const CardFooter = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn('px-2 py-2', className)}>{children}</div>
}
