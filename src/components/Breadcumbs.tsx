import React from 'react'
import Button from './Buttons/Button'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  path: string
  isActive?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center">
      {items.map((item, index) => (
        <React.Fragment key={item.path}>
          <Button
            variant="link"
            size="sm"
            isLink
            to={item.path}
            disabled={item.isActive}
            className={cn(index === 0 && 'pl-0')}
          >
            {item.label}
          </Button>
          {index < items.length - 1 && (
            <span className="text-base-400 font-bold text-xs">/</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumbs
