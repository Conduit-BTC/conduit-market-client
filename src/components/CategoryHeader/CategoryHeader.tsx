import React, { useState, useRef, useEffect } from 'react'
import Button from '../Buttons/Button'
import { cn } from '@/lib/utils'

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
      <h2 className="loud-voice">{title}</h2>
      <div className="grid">
        <p
          ref={textRef}
          className={cn(
            'notice-voice max-w-prose',
            !isExpanded && 'line-clamp-3'
          )}
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
