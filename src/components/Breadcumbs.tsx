import React, { useMemo } from 'react'
import Button from './Buttons/Button'
import { cn } from '@/lib/utils'
import { useLocation } from 'wouter'

interface BreadcrumbItem {
  label: string
  path: string
  isActive?: boolean
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  // Optional prop to override automatic path labels
  pathLabels?: Record<string, string>
}

const defaultPathLabels: Record<string, string> = {
  zapout: 'Checkout',
  orders: 'Orders',
  'style-guide': 'Style Guide',
  shop: 'Shop',
  user: 'Profile',
  login: 'Login'
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  pathLabels = {}
}) => {
  const [location] = useLocation()

  const breadcrumbItems = useMemo(() => {
    // If items are provided, use those instead of generating from path
    if (items && items.length > 0) {
      return items
    }

    // Remove trailing slash and split path into segments
    const pathSegments = location.split('/').filter(Boolean)

    // Generate breadcrumb items from path segments
    return pathSegments.reduce<BreadcrumbItem[]>(
      (acc: BreadcrumbItem[], segment: string, index: number) => {
        // Build the path up to this segment
        const path = '/' + pathSegments.slice(0, index + 1).join('/')

        // Get the label from props or defaults, fallback to capitalized segment
        const label =
          pathLabels[segment] ||
          defaultPathLabels[segment] ||
          segment.charAt(0).toUpperCase() + segment.slice(1)

        acc.push({
          label,
          path,
          isActive: index === pathSegments.length - 1
        })

        return acc
      },
      []
    )
  }, [location, items, pathLabels])

  // If we're on the home page or have no breadcrumbs, don't render anything
  if (breadcrumbItems.length === 0) {
    return null
  }

  // Add home as the first breadcrumb if we're not already showing custom items
  const allBreadcrumbs = items
    ? breadcrumbItems
    : [
        { label: 'Home', path: '/', isActive: location === '/' },
        ...breadcrumbItems
      ]

  return (
    <nav className="flex items-center">
      {allBreadcrumbs.map((item: BreadcrumbItem, index: number) => (
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
          {index < allBreadcrumbs.length - 1 && (
            <span className="text-base-400 font-bold text-xs">/</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumbs
