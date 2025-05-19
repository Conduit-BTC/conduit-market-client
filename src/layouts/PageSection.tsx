import { cn } from '@/lib/utils'

interface PageSectionProps {
  children: React.ReactNode
  width?: 'wide' | 'narrow' | 'full'
  gap?: 'none' | 'sm' | 'md' | 'lg'
}

const PageSection: React.FC<PageSectionProps> = ({
  children,
  width = 'wide',
  gap = 'md'
}) => {
  const gapClass = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  }[gap]

  const className = cn('inner-column grid', gapClass, width)
  return (
    <section>
      <div className={className}>{children}</div>
    </section>
  )
}

export default PageSection
