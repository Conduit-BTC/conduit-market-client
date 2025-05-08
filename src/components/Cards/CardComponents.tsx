export const Card = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={`bg-paper border-base-700 border rounded-lg shadow-md overflow-hidden hover:border-accent-500 transition-colors duration-300 ${className}`}
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
  return <div className={`p-4 ${className}`}>{children}</div>
}

export const CardTitle = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <h3 className={`firm-voice text-ink ${className}`}>{children}</h3>
}

export const CardDescription = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <p className={`mt-1 calm-voice ${className}`}>{children}</p>
}

export const CardContent = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={`p-4 pt-0 ${className}`}>{children}</div>
}

export const CardFooter = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>
}
