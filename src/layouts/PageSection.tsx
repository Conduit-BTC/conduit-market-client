interface PageSectionProps {
  children: React.ReactNode
  width?: 'wide' | 'narrow' | 'full'
}

const PageSection: React.FC<PageSectionProps> = ({
  children,
  width = 'wide'
}) => {
  return (
    <section>
      <div className={`inner-column ${width}`}>{children}</div>
    </section>
  )
}

export default PageSection
