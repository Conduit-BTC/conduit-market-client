import { cn } from '@/lib/utils'

interface PageSectionProps {
  children: React.ReactNode
  width?: 'wide' | 'narrow' | 'full'
  gap?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
}

const PageSection: React.FC<PageSectionProps> = ({
  children,
  width = 'wide',
  gap = 'md',
  className
}) => {
  const gapClass = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  }[gap]

  const sectionClassName = cn('inner-column grid', gapClass, width, className)
  return (
    <section>
      <div className={sectionClassName}>{children}</div>
    </section>
  )
}

export default PageSection
