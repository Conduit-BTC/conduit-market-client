import React, { useState, useRef, useEffect } from 'react'
import Button from './Buttons/Button'
import { cn } from '@/lib/utils'
import { useAutoAnimate } from '@formkit/auto-animate/react'
interface CategoryHeaderProps {
  title: string
  description: string
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  title,
  description
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTextTruncated, setIsTextTruncated] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)
  const [animate] = useAutoAnimate()
  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const isOverflowing =
          textRef.current.scrollHeight > textRef.current.clientHeight
        setIsTextTruncated(isOverflowing)
      }
    }

    checkTruncation()
    window.addEventListener('resize', checkTruncation)
    return () => window.removeEventListener('resize', checkTruncation)
  }, [description])

  return (
    <div className="grid gap-2">
      <h2 className="voice-5l">{title}</h2>
      <div className="grid" ref={animate}>
        <p
          ref={textRef}
          className={cn('voice-lg max-w-prose', !isExpanded && 'line-clamp-3')}
        >
          {description}
        </p>
        {isTextTruncated && (
          <Button
            className="justify-self-end"
            variant="link"
            size="md"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </Button>
        )}
      </div>
    </div>
  )
}

export default CategoryHeader
