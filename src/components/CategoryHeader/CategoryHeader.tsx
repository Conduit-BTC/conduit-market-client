import React, { useState } from 'react'
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

  return (
    <div className="grid gap-2 ">
      <h2 className="loud-voice">{title}</h2>
      <div className="grid justify-items-end">
        <p
          className={cn(
            'notice-voice max-w-prose',
            !isExpanded && 'line-clamp-3'
          )}
        >
          {description}
        </p>
        <Button
          variant="link"
          size="md"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </Button>
      </div>
    </div>
  )
}

export default CategoryHeader
