import React from 'react'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  name?: string | null
  imageUrl?: string | null
  size?: number
  showName?: boolean
}

const DEFAULT_IMAGE_URL = 'https://avatar.iran.liara.run/public'

const UserAvatar: React.FC<UserAvatarProps> = ({
  name = 'John Doe',
  imageUrl = DEFAULT_IMAGE_URL,
  size = 8,
  showName = true
}) => {
  const pictureClass = cn('rounded-full relative bg-gray-800', {
    [`w-${size} h-${size}`]: size
  })

  return (
    <div className="flex items-center gap-1">
      <picture className={pictureClass}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name || 'User Avatar'}
            className="object-cover"
          />
        ) : (
          <p className="text-ink leading-none font-bold text-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {name ? name.charAt(0).toUpperCase() : '?'}
          </p>
        )}
      </picture>
      {showName && name && <p className="solid-voice font-medium">{name}</p>}
    </div>
  )
}

export default UserAvatar
