import { cn } from '@/lib/utils'
import Icon from '@/components/Icon'
import React, { useRef, useState, useEffect, Children } from 'react'
import Button from './Buttons/Button'
import { useInterfaceStore } from '@/stores/useInterfaceStore'
import autoAnimate from '@formkit/auto-animate'
//to
interface CarouselProps {
  children: React.ReactNode
  className?: string
  visibleItems?: number
  visibleItemsMobile?: number
  variant?: 'default' | 'hud'
  indicatorVariant?: 'dots' | 'lines'
}

interface ScrollIndicatorProps {
  totalPages: number
  currentPage: number
  variant?: 'dots' | 'lines'
  onPageChange: (pageIndex: number) => void
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  totalPages,
  currentPage,
  variant = 'dots',
  onPageChange
}) => {
  const getIndicatorClassName = (isCurrentPage: boolean) =>
    cn('rounded-full transition-all duration-300', {
      'size-3': variant === 'dots',
      'h-1 w-full max-w-15': variant === 'lines',
      // Colors for dots
      'bg-primary-400 shadow-md shadow-primary':
        isCurrentPage && variant === 'dots',
      'bg-base-300 hover:bg-base-400': !isCurrentPage && variant === 'dots',
      // Colors for lines
      'bg-ink': isCurrentPage && variant === 'lines',
      'bg-ink/50 hover:bg-ink/75': !isCurrentPage && variant === 'lines'
    })

  return (
    <div className="flex justify-center gap-2 flex-1 max-w-full">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index)}
          className={getIndicatorClassName(currentPage === index)}
          aria-label={`Go to page ${index + 1}`}
          aria-current={currentPage === index ? 'true' : 'false'}
        />
      ))}
    </div>
  )
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  visibleItems = 4,
  visibleItemsMobile = 1,
  className,
  variant = 'default',
  indicatorVariant = 'dots',
  ...props
}) => {
  const carouselRef = useRef<HTMLUListElement>(null)
  useEffect(() => {
    if (carouselRef.current) {
      autoAnimate(carouselRef.current)
    }
  }, [carouselRef.current])
  const childrenCount = Children.count(children)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // Get viewport information from shared interface store
  const { isMobile } = useInterfaceStore()

  // Determine how many items should be visible at this breakpoint
  const currentVisibleItems = isMobile ? visibleItemsMobile : visibleItems

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(
    childrenCount > currentVisibleItems
  )

  // Update scroll-next availability when viewport (and thus visible-items) changes
  useEffect(() => {
    setCanScrollNext(childrenCount > currentVisibleItems)
  }, [childrenCount, currentVisibleItems])

  const calculateCurrentPage = (
    scrollLeft: number,
    clientWidth: number,
    scrollWidth: number
  ) => {
    // If we can't scroll, we're always on page 0
    if (scrollWidth <= clientWidth) return 0

    // Calculate the progress through the scrollable area (0 to 1)
    const maxScroll = scrollWidth - clientWidth
    const progress = Math.max(0, Math.min(1, scrollLeft / maxScroll))

    // Convert progress to page number
    return Math.round(progress * (totalPages - 1))
  }

  const updateScrollInfo = () => {
    const carousel = carouselRef.current
    if (carousel) {
      const { scrollLeft, clientWidth, scrollWidth } = carousel

      // Update scroll buttons visibility
      setCanScrollPrev(scrollLeft > 0)
      setCanScrollNext(Math.ceil(scrollLeft + clientWidth) < scrollWidth)

      // Update current page
      const newPage = calculateCurrentPage(scrollLeft, clientWidth, scrollWidth)
      setCurrentPage(newPage)
    }
  }

  // Calculate total pages whenever the content changes
  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      const { clientWidth, scrollWidth } = carousel
      const newTotalPages = Math.max(1, Math.ceil(scrollWidth / clientWidth))
      setTotalPages(newTotalPages)

      // Also update current page when total pages changes
      updateScrollInfo()
    }
  }, [children, currentVisibleItems])

  // Add scroll event listener
  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      const handleScroll = () => {
        requestAnimationFrame(updateScrollInfo)
      }

      carousel.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll, { passive: true })

      // Initial update
      handleScroll()

      return () => {
        carousel.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
      }
    }
  }, [totalPages]) // Re-run when totalPages changes

  const handleScrollPrev = () => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.scrollLeft -= carousel.clientWidth
    }
  }

  const handleScrollNext = () => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.scrollLeft += carousel.clientWidth
    }
  }

  const scrollToPage = (pageIndex: number) => {
    const carousel = carouselRef.current
    if (carousel) {
      const { clientWidth, scrollWidth } = carousel
      const maxScroll = scrollWidth - clientWidth
      const targetScroll = (maxScroll * pageIndex) / (totalPages - 1)
      carousel.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
    }
  }

  // Calculate item width based on the number of visible items for the current breakpoint
  const itemBasisPercent = Math.floor(100 / currentVisibleItems) - 2
  const itemBasis = `${itemBasisPercent}%`

  // Conditional styling variables
  const carouselWrapperClassName = cn('grid relative mt-4', className)
  const carouselListClassName =
    'flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
  const carouselItemClassName = 'flex-shrink-0 md:min-w-min snap-start'
  const carouselItemStyle = { maxWidth: itemBasis }

  const prevButtonClassName = cn(
    'absolute -left-0 top-1/2 -translate-y-1/2 z-10',
    {
      'static translate-y-0': variant === 'hud',
      'opacity-0 pointer-events-none': !canScrollPrev
    }
  )
  const nextButtonClassName = cn(
    'absolute -right-0 top-1/2 -translate-y-1/2 z-10',
    {
      'static translate-y-0': variant === 'hud',
      'opacity-0 pointer-events-none': !canScrollNext
    }
  )

  return (
    <div className={carouselWrapperClassName}>
      <ul ref={carouselRef} className={carouselListClassName}>
        {Children.map(children, (child, index) => (
          <li
            key={index}
            className={carouselItemClassName}
            style={carouselItemStyle}
          >
            {child}
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div
          className={cn(
            'mt-2 flex items-center justify-between px-4 gap-5',
            variant === 'hud' && 'relative'
          )}
        >
          <Button
            variant={variant === 'hud' ? 'ghost' : 'primary'}
            size="icon"
            rounded={false}
            className={prevButtonClassName}
            onClick={handleScrollPrev}
          >
            <Icon icon="chevronLeft" className="size-6" />
          </Button>

          <ScrollIndicator
            totalPages={totalPages}
            currentPage={currentPage}
            variant={indicatorVariant}
            onPageChange={scrollToPage}
          />

          <Button
            variant={variant === 'hud' ? 'ghost' : 'primary'}
            size="icon"
            rounded={false}
            className={nextButtonClassName}
            onClick={handleScrollNext}
          >
            <Icon icon="chevronRight" className="size-6" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default Carousel
