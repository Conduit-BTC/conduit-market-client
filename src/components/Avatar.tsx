import React from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps {
  imageUrl?: string | null
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-9 h-9',
  xl: 'w-12 h-12'
} as const

const DEFAULT_IMAGE_URL = 'https://avatar.iran.liara.run/public'

const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  alt = '',
  size = 'md',
  fallback
}) => {
  const sizeClass = sizeClasses[size as keyof typeof sizeClasses]

  const pictureClass = cn(
    'rounded-full relative bg-gray-800 overflow-hidden',
    sizeClass
  )

  return (
    <picture className={pictureClass}>
      {imageUrl ? (
        <img src={imageUrl} alt={alt} className="w-full h-full object-cover" />
      ) : fallback ? (
        <p className="text-ink leading-none font-bold text-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {fallback.charAt(0).toUpperCase()}
        </p>
      ) : null}
    </picture>
  )
}

export default Avatar
