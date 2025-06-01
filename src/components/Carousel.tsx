import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import React, { useRef, useState, useEffect, Children } from 'react'
import Button from './Buttons/Button'

interface CarouselProps {
  children: React.ReactNode
  className?: string
  visibleItems?: number
  visibleItemsMobile?: number
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  visibleItems = 4,
  visibleItemsMobile = 1,
  className,
  ...props
}) => {
  const carouselRef = useRef<HTMLUListElement>(null)
  const childrenCount = Children.count(children)

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(
    childrenCount > visibleItems
  )

  const updateScrollButtons = () => {
    const carousel = carouselRef.current
    if (carousel) {
      // Only allow prev scroll if we've scrolled right
      setCanScrollPrev(carousel.scrollLeft > 0)

      // Check if we can scroll further right
      const hasMoreToScroll =
        Math.ceil(carousel.scrollLeft + carousel.clientWidth) <
        carousel.scrollWidth
      setCanScrollNext(hasMoreToScroll)
    }
  }

  // Run on mount and when children or visibleItems change
  useEffect(() => {
    setCanScrollNext(childrenCount > visibleItems)

    // Run on next tick to ensure DOM is updated
    setTimeout(updateScrollButtons, 0)
  }, [children, visibleItems, childrenCount])

  useEffect(() => {
    updateScrollButtons()
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener('scroll', updateScrollButtons)
      window.addEventListener('resize', updateScrollButtons)
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', updateScrollButtons)
        window.removeEventListener('resize', updateScrollButtons)
      }
    }
  }, [])

  const handleScrollPrev = () => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.scrollLeft -= carousel.clientWidth
      updateScrollButtons()
    }
  }

  const handleScrollNext = () => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.scrollLeft += carousel.clientWidth
      updateScrollButtons()
    }
  }

  // Calculate item width based on visibleItems
  const itemBasis = Math.floor(100 / visibleItems) + -2 + '%'
  const itemBasisMobile = Math.floor(100 / visibleItemsMobile) + -2 + '%'

  return (
    <div className={cn('grid relative mt-4', className)}>
      <ul
        ref={carouselRef}
        className="flex gap-4 overflow-hidden scroll-smooth "
      >
        {Children.map(children, (child, index) => (
          <li
            key={index}
            className="flex-shrink-0 min-w-fit md:min-w-min"
            style={{
              flexBasis: itemBasis
            }}
          >
            {child}
          </li>
        ))}
      </ul>

      {canScrollPrev && (
        <Button
          variant="primary"
          size="icon"
          rounded={false}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10"
          onClick={handleScrollPrev}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}

      {canScrollNext && (
        <Button
          variant="primary"
          size="icon"
          rounded={false}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10"
          onClick={handleScrollNext}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export default Carousel
